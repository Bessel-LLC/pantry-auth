import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtpType } from 'src/common/otp-type.enum';
import { User } from 'src/users/entities/user.entity';

@Schema({ collection: 'otps', timestamps: true })
export class Otp extends Document {
  @Prop({ type: String, required: true })
  //otp: string[];
  otpCode: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ enum: OtpType, required: false })
  type?: OtpType;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId; // to distinguish type of OTP
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
