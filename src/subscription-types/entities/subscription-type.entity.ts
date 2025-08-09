import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type SubscriptionTypeDocument = SubscriptionType & Document;
@Schema({ timestamps: true })
export class SubscriptionType {

  @Prop({ required: true, unique: false  })
  name: string;

  @Prop({ required: true, unique: false  })
  price: number;

  @Prop({ required: true, unique: false  })
  mealPlans: number;

  @Prop({ required: true, unique: false  })
  specialMeals: number;
  
  @Prop({ required: true, unique: false  })
  healthyDrinks: number;

  @Prop({ required: true, unique: false  })
  generateMeals: number;
}

export const SubscriptionTypeSchema = SchemaFactory.createForClass(SubscriptionType);