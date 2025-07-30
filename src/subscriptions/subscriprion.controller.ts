import { Controller, Post, Body, Param, Get, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriprionService: SubscriptionService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create subscriprion for user' })
  @ApiParam({ name: 'userId', description: 'User ID (Mongo ID)' })
  create(
    @Param('userId') userId: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriprionService.create(userId, createSubscriptionDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get subscriprion by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  findByUserId(@Param('userId') userId: string) {
    return this.subscriprionService.findByUserId(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update subscriprion by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  update(
    @Param('userId') userId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriprionService.update(userId, updateSubscriptionDto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete subscriprion by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  delete(@Param('userId') userId: string) {
    return this.subscriprionService.delete(userId);
  }
}