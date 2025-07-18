import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateOtpDto {
  @ApiProperty({
    description: 'User ID',
    required: true,
  })
  @IsNotEmpty({
    message: 'UserId is required',
  })
  user_id: string;

  @ApiProperty({
    description: 'OTP',
    required: true,
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  @IsNotEmpty({
    message: 'OTP is required',
  })
  otpCode: string;
}
