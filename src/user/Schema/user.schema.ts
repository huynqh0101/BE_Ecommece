import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string; // Thêm trường mật khẩu

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: 0 })
  amountCart: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware để băm mật khẩu trước khi lưu
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const salt = await bcrypt.genSalt(10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
