import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserUseCaseModule } from './application/use-cases/user-use-case.module';
import { UserPersistenceModule } from './infrastructure/persistence/mongoose/user-persistence.module';


@Module({
  imports: [
    UserUseCaseModule,    
    UserPersistenceModule,
  ],
  controllers: [UserController], 
  providers: [], 
})
export class UsersModule {}