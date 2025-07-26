import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/users/entities/user.entity';

export type UserProfileDocument = UserProfile & Document;

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  weight?: number;

  @Prop()
  height?: number;

  @Prop()
  birthday?: Date;

  @Prop({
    type: {
      dailyCaloriesGoal: { type: Number },
      mealsPerDay: { type: Number },
      personCount: { type: Number },
    },
  })
  healthGoals?: {
    dailyCaloriesGoal?: number;
    mealsPerDay?: number;
    personCount?: number;
  };

  @Prop([String])
  dietTypes?: string[];

  @Prop([String])
  alergies?: string[];

  @Prop({ required: false })
  languages: string;

  @Prop({ required: false, unique: false })
  phone?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: false, unique: false })
  ruku_client_id?: string;

  @Prop({ required: false, unique: false })
  suscription_id?: string;

  @Prop({ type: Types.ObjectId, ref: Address.name, required: false })
  addressId?: Types.ObjectId;
  
  @Prop({ default: true })
  termsAccepted: boolean;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
