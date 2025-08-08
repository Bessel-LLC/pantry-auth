import { Ingredient } from 'src/utils/types/types';

export class CreatePantryDto {
  user_id: string;
  ingredients: Ingredient[] | []; // Array of ingredients in the pantry
}
