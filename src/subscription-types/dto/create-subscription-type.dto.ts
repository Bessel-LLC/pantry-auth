import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubscriptionTypeDto {
  @ApiProperty({ example: 'Family' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '4000' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: '5' })
  @IsOptional()
  @IsNumber()
  mealPlans: number;

  @ApiProperty({ example: '5' })
  @IsOptional()
  @IsNumber()
  specialMeals: number;

  @ApiProperty({ example: '5' })
  @IsOptional()
  @IsNumber()
  healthyDrinks: number;

  @ApiProperty({ example: '5' })
  @IsOptional()
  @IsNumber()
  generateMeals: number;
}
