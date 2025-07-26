import {
  ConflictException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserProfile,
  UserProfileDocument,
} from './entities/user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersService } from 'src/users/users.service';
import { RukuService } from 'src/services/rukupay';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile.name)
    private profileModel: Model<UserProfileDocument>,

    private rukuService: RukuService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(
    userId: string,
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`No user found with userId: ${userId}`);
      }

      await this.verifyInformationIsAvailable(userId);
      //create ruku id
      try {
        const fullname =
          createUserProfileDto.name + createUserProfileDto.lastName;

        const response = await this.rukuService.createRukuCustomer({
          name: fullname,
          email: user.email,
        });
        console.log('rukuid ', response.id);

        const created = new this.profileModel({
          userId: new Types.ObjectId(userId),
          ...createUserProfileDto,
            ruku_client_id: response.id,
        });
        console.log('created ', created);
        const savedProfile = await created.save();
        await this.usersService.update(userId, { isActive: true, ruku_client_id: response.id  });

        return savedProfile;
      } catch (error) {
        return error;
      }
    } catch (error) {
      console.error('Error creating user information:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<UserProfile> {
    const userProfileId = new Types.ObjectId(userId);
    const profile = await this.profileModel
      .findOne({ userId: userProfileId })
      .exec();
    if (!profile) {
      throw new NotFoundException(`No profile found for userId: ${userId}`);
    }
    return profile;
  }

  async update(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const userProfileId = new Types.ObjectId(userId);
    const updated = await this.profileModel
      .findOneAndUpdate({ userId: userProfileId }, updateUserProfileDto, {
        new: true,
      })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    return updated;
  }

  async findByInformation(userId: string): Promise<UserProfile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }

  async verifyUserExists(userId: string): Promise<UserProfileDocument> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException(`No user exists with this userId: ${userId}`);
    }
    return profile;
  }

  async verifyInformationIsAvailable(userId: string): Promise<void> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    if (profile) {
      throw new ConflictException('User information is already registered');
    }
  }
}
