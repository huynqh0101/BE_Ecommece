import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info/:username')
  async getUserInfo(@Param('username') username: string) {
    return await this.userService.getUserInfo(username);
  }

  @Get('all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
