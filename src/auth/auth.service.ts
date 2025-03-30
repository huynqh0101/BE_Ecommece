import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/Schema/user.schema';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

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

    // Tạo token và refreshToken
    const payload = { id: user._id, username: user.username };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token hết hạn sau 7 ngày

    return {
      msg: 'Login successful',
      token,
      refreshToken,
      id: user._id
    };
  }
}
