import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsString as IsStringType, IsDate as IsDateType } from 'class-validator';

export class UpdateTokenDto {
  @ApiProperty({ example: 'jwt_token_here', description: 'JWT access token', required: false, nullable: true })
  @IsOptional()
  @IsString()
  token?: string | null;

  @ApiProperty({ example: new Date(), description: 'Expiration date for token', required: false, nullable: true })
  @IsOptional()
  expirationToken?: Date | null;
}
