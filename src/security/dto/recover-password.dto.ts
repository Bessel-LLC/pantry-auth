import { IsUUID, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}