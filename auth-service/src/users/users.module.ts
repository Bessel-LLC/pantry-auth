import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/adapters/inbound/controllers/user.controller';
import { UserUseCaseModule } from './application/ports/input/user-use-case.module';
import { UserPersistenceModule } from './infrastructure/adapters/outbound/persistence/mongoose/user-persistence.module';

@Module({
  imports: [UserUseCaseModule, UserPersistenceModule],
  controllers: [UserController],
  providers: [],
})
export class UsersModule {}
