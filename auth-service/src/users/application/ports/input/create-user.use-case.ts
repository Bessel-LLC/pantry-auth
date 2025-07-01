import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/users/application/dtos/create-user.dto';
import { IUserRepository } from 'src/users/domain/repositories/user.repository.interface';
import { User } from 'src/users/domain/entities/user.entity';
import { USER_REPOSITORY } from 'src/users/infrastructure/infrastructure.constants';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );

    return this.userRepository.create(newUser);
  }
}
