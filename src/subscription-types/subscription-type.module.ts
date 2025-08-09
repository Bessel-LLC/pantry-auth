import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionType, SubscriptionTypeSchema } from './entities/subscription-type.entity';
import { SubscriptionTypeService } from './subscription-type.service';
import { SubscriptionTypeController } from './subscriprion-type.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubscriptionType.name, schema: SubscriptionTypeSchema }]),
  ],
  controllers: [SubscriptionTypeController],
  providers: [SubscriptionTypeService],
  exports: [SubscriptionTypeService, MongooseModule],
})
export class SubscriptionTypeModule {}