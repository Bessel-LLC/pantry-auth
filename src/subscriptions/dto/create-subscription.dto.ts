import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsBoolean,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subscriptionTypeId: string;

  @ApiProperty({ example: '12' })
  @IsOptional()
  @IsNumber()
  dayOfTheMonth: number;

  @ApiProperty({ example: '2025-07-12' })
  @IsOptional()
  @IsDate()
  dateStarted: Date;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  mealPlans: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  specialMeals: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  healthyDrinks: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  generateMeals: number;
}
