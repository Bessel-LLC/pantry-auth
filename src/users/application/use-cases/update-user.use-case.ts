import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../infrastructure/dtos/create-user.dto';
import { USER_REPOSITORY } from '../../infrastructure/infrastructure.constants';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithNewEmail = await this.userRepository.findByEmail(updateUserDto.email);
      if (userWithNewEmail && userWithNewEmail.id !== id) {
        
        delete updateUserDto.email;
      }
    }

    const userUpdate: Partial<User> = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      isActive: updateUserDto.isActive,
      updatedAt: new Date(),
    };
    
    Object.keys(userUpdate).forEach((key) => {
      const propKey = key as keyof User;
      if (userUpdate[propKey] === undefined) {
        delete userUpdate[propKey];
      }
    });


    const updatedUser = await this.userRepository.update(id, userUpdate);

    return updatedUser;
  }
}