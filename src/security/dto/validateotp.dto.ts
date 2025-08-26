import { IsString, IsUUID } from 'class-validator';

export class ValidateOtpRecoverDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}