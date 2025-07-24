import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './entities/address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService, MongooseModule],
})
export class AddressModule {}