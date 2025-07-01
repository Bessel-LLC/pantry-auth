import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoose, UserSchema } from './entities/user.schema';
import { UserMongooseRepository } from './repositories/user-mongoose.repository';
import { IUserRepository } from '../../../../../domain/repositories/user.repository.interface';

import { USER_REPOSITORY } from '../../../../infrastructure.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMongoose.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserMongooseRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserPersistenceModule {}
