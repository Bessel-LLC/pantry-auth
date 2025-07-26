import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create address for user' })
  @ApiParam({ name: 'userId', description: 'User ID (Mongo ID)' })
  create(
    @Param('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(userId, createAddressDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get address by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  findByUserId(@Param('userId') userId: string) {
    return this.addressService.findByUserId(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update address by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID (ID)' })
  update(
    @Param('userId') userId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(userId, updateAddressDto);
  }
}