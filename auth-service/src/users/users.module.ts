// src/users/user.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/adapters/inbound/controllers/user.controller';
import { CreateUserUseCase } from './application/ports/input/create-user.use-case';
import { GetUserByIdUseCase } from './application/ports/input/get-user-by-id.use-case';
import { UpdateUserUseCase } from './application/ports/input/update-user.use-case';
import { DeleteUserUseCase } from './application/ports/input/delete-user.use-case';
import { UserUseCaseModule } from './application/ports/input/user-use-case.module';
import { UserRepositoryModule } from './infrastructure/adapters/outbound/persistence/user-repository.module';
// Agrega también aquí tu repositorio si es necesario
import { UserMongooseRepository } from './infrastructure/adapters/outbound/persistence/mongoose/repositories/user-mongoose.repository';
import { UserService } from './application/services/user.service';
import { AuthController } from './infrastructure/adapters/inbound/controllers/verificacion.user.controller';


@Module({
  imports: [UserUseCaseModule, UserRepositoryModule],
  controllers: [UserController, AuthController],
  providers: [
    // Casos de uso (application layer)
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    // Servicios de dominio y adaptadores
    UserService,
    UserMongooseRepository,
  ],
})
export class UserModule {}
