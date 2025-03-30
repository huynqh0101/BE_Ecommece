import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './Schema/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return {
      msg: 'Get all users successfully',
      data: users
    };
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return { msg: 'User not found', data: null };
    }
    return {
      msg: 'Get user successfully',
      data: user
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const { username, password, amountCart } = createUserDto;

    // Kiểm tra nếu username đã tồn tại
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      return { msg: 'Username already exists', data: null };
    }

    // Tạo người dùng mới
    const newUser = new this.userModel({
      username,
      password, // Mật khẩu sẽ được băm tự động bởi middleware trong schema
      amountCart
    });
    await newUser.save();
    return {
      msg: 'User created successfully',
      data: {
        username: newUser.username,
        id: newUser._id,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true
      })
      .exec();
    if (!updatedUser) {
      return { msg: 'User not found', data: null };
    }
    return {
      msg: 'User updated successfully',
      data: updatedUser
    };
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      return { msg: 'User not found', data: null };
    }
    return {
      msg: 'User deleted successfully',
      data: deletedUser
    };
  }
}
