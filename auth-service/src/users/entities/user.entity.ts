import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { UserProfile } from 'src/user-profile/entities/user-profile.entity';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @ApiProperty({ example: 'juan@mail.com', description: 'enter email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'phone', description: 'enter phone number' })
  @Prop({ required: false, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  ruku_client_id: string;

  @Prop()
  suscription_id: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  addressId: string;

  @Prop()
  token: string;

  @Prop()
  expirationToken: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserProfile' }) 
  profile: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
