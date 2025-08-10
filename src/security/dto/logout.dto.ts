import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ example: 'user_id_here', description: 'User ID to logout' })
  @IsString()
  userId: string;
}
