export class CreateUserDto {
  username: string;
  password: string; // Mật khẩu sẽ được băm tự động
  amountCart?: number;
}

export class UpdateUserDto {
  username?: string;
  password?: string;
  amountCart?: number;
}
