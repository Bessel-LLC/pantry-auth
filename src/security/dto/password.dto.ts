import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class PasswordDto {
  // For password recovery
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User email address for password recovery',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  // For updating password
  @ApiProperty({
    example: '12345678',
    description: 'Current password of the user to verify',
  })
  @IsString()
  @MinLength(8)
  @IsOptional() // Only required for password update
  password: string;

  @ApiProperty({
    example: 'new12345',
    description: 'New password to set for the user',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    example: 'new12345',
    description: 'Confirm the new password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    example: 'yourAccessToken',
    description: 'Access token for user authentication or password reset',
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
