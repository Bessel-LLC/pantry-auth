import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { UpdateUserUseCase } from './update-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { UserRepositoryModule } from 'src/users/infrastructure/adapters/outbound/persistence/user-repository.module';

@Module({
  imports: [UserRepositoryModule],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserUseCaseModule {}
