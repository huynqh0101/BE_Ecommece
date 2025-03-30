import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './Schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserInfo(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return { msg: 'User not found', data: null };
    }
    return {
      msg: 'Get info user successfully',
      data: {
        username: user.username,
        id: user._id,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        amountCart: user.amountCart
      }
    };
  }

  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return {
      msg: 'Get all users successfully',
      data: users
    };
  }
}
