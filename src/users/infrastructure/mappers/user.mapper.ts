
import { User } from '../../domain/entities/user.entity';
import { UserDocument } from '../persistence/mongoose/entities/user.schema';
import { UserResponseDto } from '../dtos/user-response.dto';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

export class UserMapper {
  static toDomain(raw: UserDocument): User {
    
    
    return new User(
      raw.name!,          
      raw.email!,         
      raw.password,       
      raw.isActive!,      
      raw.createdAt!,     
      raw.updatedAt!,     
      (raw._id as Types.ObjectId).toString(), 
    );
  }

  static toPersistence(user: User): UserDocument { 
    const data: any = {
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    if (user.id) {
      data._id = new Types.ObjectId(user.id);
    }
    return data as UserDocument;
  }

  static toResponseDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id!; 
    dto.name = user.name!;
    dto.email = user.email!;
    dto.isActive = user.isActive!;
    dto.createdAt = user.createdAt!;
    dto.updatedAt = user.updatedAt!;
    return dto;
  }
}