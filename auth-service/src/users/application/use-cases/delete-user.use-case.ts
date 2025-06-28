import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../infrastructure/infrastructure.constants';

@Injectable()
export class DeleteUserUseCase {
  constructor(    
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  /**
   * @param id
   * @returns 
   */
  async execute(id: string): Promise<boolean> {
    
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
    
      throw new NotFoundException(`User with ID ${id} not found`);
    
    }
    
    const isDeleted = await this.userRepository.delete(id);
    return isDeleted;
  }
}