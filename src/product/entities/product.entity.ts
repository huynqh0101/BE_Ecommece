import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'products',
  timestamps: true, // Tự động tạo createdAt và updatedAt
  versionKey: false // Không tự động thêm __v
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({
    required: true,
    type: [{ name: String, amount: String }],
    _id: false
  })
  size: { name: string; amount: string }[];

  @Prop({ required: true, type: String })
  material: string;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ default: null })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
