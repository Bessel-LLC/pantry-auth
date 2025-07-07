import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {

  @ApiProperty({ example: 'juan@mail.com', description: 'Correo electrónico del usuario' })
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 25, description: 'Edad del usuario', required: false })
  @Prop()
  age?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

