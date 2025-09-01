import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionType } from 'src/subscription-types/entities/subscription-type.entity';


export type SubscriptionDocument = Subscription & Document;
@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: SubscriptionType.name, required: true })
  subscriptionTypeId: Types.ObjectId;

  @Prop({ required: true, unique: false  })
  dayOfTheMonth: number;

  @Prop({ required: true, unique: false  })
  dateStarted: Date;

  @Prop({ required: true, unique: false  })
  status: boolean;

  @Prop({ required: true, unique: false  })
  mealPlans: number;

  @Prop({ required: true, unique: false  })
  specialMeals: number;
  
  @Prop({ required: true, unique: false  })
  healthyDrinks: number;

  @Prop({ required: true, unique: false  })
  generateMeals: number;

  @Prop()
  rukusubscriptionID:string;  
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);