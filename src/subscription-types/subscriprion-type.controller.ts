import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SubscriptionTypeService } from './subscription-type.service';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';

@ApiTags('SubscriptionType')
@Controller('subscriptionType')
export class SubscriptionTypeController {
  constructor(private readonly subscriptionTypeService: SubscriptionTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create Subscription Type' })
  create(
    @Body() createSubscriptionTypeDto: CreateSubscriptionTypeDto,
  ) {
    return this.subscriptionTypeService.create(createSubscriptionTypeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Subscription Type by its ID' })
  @ApiParam({ name: 'id', description: 'Subscription Type ID (ID)' })
  findByUserId(@Param('id') id: string) {
    return this.subscriptionTypeService.findBySubscriptionTypeId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update SubscriptionType by its ID' })
  @ApiParam({ name: 'id', description: 'Subscription Type ID (ID)' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionTypeDto: UpdateSubscriptionTypeDto,
  ) {
    return this.subscriptionTypeService.update(id, updateSubscriptionTypeDto);
  }
}