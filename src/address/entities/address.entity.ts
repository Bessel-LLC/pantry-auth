import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type AddressDocument = Address & Document;
@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true, unique: false  })
  country_code: string;

  @Prop({ required: true, unique: false  })
  zipcode: string;

  @Prop({ required: true, unique: false  })
  state: string;

  @Prop({ required: true, unique: false  })
  city: string;

  @Prop({ required: true, unique: false  })
  line1: string;
  
  @Prop({ required: true, unique: false  })
  line2?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);