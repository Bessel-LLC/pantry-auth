import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../infrastructure/dtos/create-user.dto';
import { USER_REPOSITORY } from '../../infrastructure/infrastructure.constants';


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