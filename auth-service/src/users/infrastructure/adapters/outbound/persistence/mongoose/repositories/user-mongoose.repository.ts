import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from '../../../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../../../domain/entities/user.entity';
import { UserMongoose, UserDocument } from '../entities/user.schema';
import { UserMapper } from '../../../mappers/user.mapper';

@Injectable()
export class UserMongooseRepository implements IUserRepository {
  constructor(
    @InjectModel(UserMongoose.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(UserMapper.toPersistence(user));
    const savedUser = await createdUser.save();
    return UserMapper.toDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.userModel.findById(id).exec();
    return found ? UserMapper.toDomain(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.userModel.findOne({ email }).exec();
    return found ? UserMapper.toDomain(found) : null;
  }

  async findAll(): Promise<User[]> {
    const foundUsers = await this.userModel.find().exec();
    return foundUsers.map(UserMapper.toDomain);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
    return updated ? UserMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async save(user: User): Promise<User> {
    await this.userModel.updateOne({ _id: user.id }, user, { upsert: true }).exec();
    return user;
  }
}
