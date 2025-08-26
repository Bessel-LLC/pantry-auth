import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'User ID',
    required: true,
  })
  @IsNotEmpty({
    message: 'UserId is required',
  })
  user_id: string;

  @ApiProperty({
    example: '12345678',
    description: 'Password(minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    example: '12345678',
    description: 'Password(minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty({
    message: 'Old password is required',
  })
  oldPassword: string;
}
