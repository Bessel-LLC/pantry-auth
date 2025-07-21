import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class HealthGoalsDto {
  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsNumber()
  dailyCaloriesGoal?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  mealsPerDay?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  personCount?: number;
}

export class CreateUserProfileDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 1.75 })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @ApiPropertyOptional({ type: HealthGoalsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => HealthGoalsDto)
  healthGoals?: HealthGoalsDto;

  @ApiPropertyOptional({ example: ['Vegetarian', 'Low Carb'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietTypes?: string[];

  @ApiPropertyOptional({ example: ['Gluten', 'Peanuts'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergies?: string[];


  @ApiPropertyOptional({ example: 'English'})
  @IsOptional()
  @IsString()
  language: string;
}
