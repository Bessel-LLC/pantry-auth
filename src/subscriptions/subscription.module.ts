import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscriprion.controller';
import { UsersModule } from '../users/users.module';
import { UserProfileModule } from 'src/user-profile/user-profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => UserProfileModule), 
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService, MongooseModule],
})
export class SubscriptionModule {}