import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfile, UserProfileSchema } from './entities/user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UsersModule } from '../users/users.module';
import { RukuService } from 'src/services/rukupay';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserProfile.name, schema: UserProfileSchema }]),
     forwardRef(() => UsersModule),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, RukuService],
  exports: [UserProfileService, MongooseModule],
})
export class UserProfileModule {}
