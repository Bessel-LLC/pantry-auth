import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'User ID',
    required: true,
  })
  @IsNotEmpty({
    message: 'UserId is required',
  })
  user_id: string;
}
