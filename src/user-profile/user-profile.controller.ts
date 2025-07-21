import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create profile for user' })
  @ApiParam({ name: 'userId', description: 'User ID (Mongo ID)' })
  create(
    @Param('userId') userId: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userProfileService.create(userId, createUserProfileDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  findByUserId(@Param('userId') userId: string) {
    return this.userProfileService.findByUserId(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update profile by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  update(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.update(userId, updateUserProfileDto);
  }
}
