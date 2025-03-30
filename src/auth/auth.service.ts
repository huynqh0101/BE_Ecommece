import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/Schema/user.schema';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    // Kiểm tra nếu username đã tồn tại
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      return { msg: 'Username already exists', data: null };
    }

    // Tạo người dùng mới
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

    // Tìm người dùng theo username
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return { msg: 'Invalid username or password', data: null };
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { msg: 'Invalid username or password', data: null };
    }

    return {
      msg: 'Login successful',
      data: {
        username: user.username,
        id: user._id
      }
    };
  }
}
