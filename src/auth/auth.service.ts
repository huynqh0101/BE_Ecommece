import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/Schema/user.schema';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private redis: Redis;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379
    });
  }

  async signUp(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      return { msg: 'Username already exists', data: null };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      password: hashedPassword
    });
    await newUser.save();

    return {
      msg: 'User registered successfully',
      data: {
        username: newUser.username,
        id: newUser._id
      }
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return { msg: 'Invalid username or password', data: null };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { msg: 'Invalid username or password', data: null };
    }
    const userId = (user._id as string).toString();
    // Tạo token và refreshToken
    const payload = { id: userId, username: user.username };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token hết hạn sau 7 ngày

    await this.redis.set(`auth:token:${userId}`, token, 'EX', 3600); // 1 giờ
    await this.redis.set(`auth:refresh:${userId}`, refreshToken, 'EX', 604800); // 7 ngày

    return {
      msg: 'Login successful',
      token,
      refreshToken,
      id: userId,
      username: user.username
    };
  }

  // Thêm hàm kiểm tra token
  async validateToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redis.get(`auth:token:${userId}`);
    return storedToken === token;
  }

  // Thêm hàm đăng xuất
  async logout(userId: string): Promise<{ msg: string }> {
    await this.redis.del(`auth:token:${userId}`);
    await this.redis.del(`auth:refresh:${userId}`);
    return { msg: 'Logout successful' };
  }
}
