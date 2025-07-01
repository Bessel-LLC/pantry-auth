import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserMongoose & Document;

@Schema({ timestamps: true })
export class UserMongoose {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: true })
  otp!: string;

  @Prop({ default: true })
  otpExpiresAt!: Date;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoose);
