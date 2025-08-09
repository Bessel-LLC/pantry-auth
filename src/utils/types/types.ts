export interface Ingredient {
  name: string;
  quantity: number; // total amount across the meal plan
  unit: string;
  classification:
    | 'fruit'
    | 'vegetable'
    | 'grain'
    | 'protein'
    | 'dairy'
    | 'spice'
    | 'herb'
    | 'oil'
    | 'other';
  carbonFootPrintToWaste: number; // Total carbon emission if the ingredient is wasted in CO2 Kilograms
  daysToExpire: number; // days before the ingredient expires
  dayAdded?: Date; // Optional field to track when the ingredient was added
}
