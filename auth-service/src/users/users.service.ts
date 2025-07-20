import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { assertValidMongoId } from 'src/common/mongo-validation.common';
import {
  UserProfile,
  UserProfileDocument,
} from 'src/user-profile/entities/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name)
    private profileModel: Model<UserProfileDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      await this.verifyEmailIsAvailable(createUserDto.email);

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return await createdUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error getting users', error);
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.findUserById(id);
    } catch (error) {
      console.error(`Error retrieving user with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.findUserById(id);
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      return updatedUser!;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      await this.findUserById(id);
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      return deletedUser!;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Finds a user by ID and throws a NotFoundException if the user does not exist.
   *
   * @param id - The ID of the user to retrieve.
   * @returns The found user document.
   * @throws NotFoundException - If no user is found with the given ID.
   */
  private async findUserById(id: string): Promise<User> {
    assertValidMongoId(id);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found.`);
    }
    return user;
  }

  /**
   * Method that is called in SECURITY.SERVICE for email validation during login.
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Method for login
   * @param email
   * @returns
   */
  async verifyUserExists(email: string): Promise<UserDocument> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user exists with email: ${email}`);
    }
    return user;
  }

  /**
   * Method for signup
   * @param email
   */
  async verifyEmailIsAvailable(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already registered');
    }
  }

  async findOneWithProfile(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const profile = await this.profileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    return {
      user,
      profile: profile || null,
    };
  }
}
