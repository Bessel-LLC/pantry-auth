import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Ingredient } from 'src/utils/types/types';


@Schema({ timestamps: true })
export class Pantry extends Document {
  @Prop()
  user_id: string;
  @Prop()
  ingredients: Ingredient[] | []; // Array of ingredients in the pantry
}

export const PantrySchema = SchemaFactory.createForClass(Pantry);
