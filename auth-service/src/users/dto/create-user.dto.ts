import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'jhon@gmail.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Password(minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  ruku_client_id?: string;

  @IsOptional()
  @IsString()
  suscription_id?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsDate()
  expirationToken?: Date;
}
