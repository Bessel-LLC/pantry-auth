import { Exclude, Expose } from 'class-transformer';
import { IsString, IsEmail, IsBoolean, IsDateString } from 'class-validator';

@Exclude()
export class UserResponseDto {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsBoolean()
  isActive!: boolean;

  @Expose()
  @IsDateString()
  createdAt!: Date;

  @Expose()
  @IsDateString()
  updatedAt!: Date;
}
