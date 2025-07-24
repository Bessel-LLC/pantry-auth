import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'US' })
  @IsNotEmpty()
  @IsString()
  country_code: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @ApiProperty({ example: 'California' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'Los Angeles' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  line1: string;

  @ApiProperty({ example: 'Apt 4B' })
  @IsOptional()
  @IsString()
  line2: string;
}
