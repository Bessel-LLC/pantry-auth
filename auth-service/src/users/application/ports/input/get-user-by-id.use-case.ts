import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/user.repository.interface';
import { User } from 'src/users/domain/entities/user.entity';
import { USER_REPOSITORY } from 'src/users/infrastructure/infrastructure.constants';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
