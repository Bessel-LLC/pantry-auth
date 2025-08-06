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
  Address,
  AddressDocument,
} from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UsersService } from 'src/users/users.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: Model<AddressDocument>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => UserProfileService))
    private userProfileService: UserProfileService,
  ) {}

  async create(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`No user found with userId: ${userId}`);
      }

      const userProfile = await this.userProfileService.findByUserId(userId);
      if (!userProfile) {
        throw new NotFoundException(`No user profile found with userId: ${userId}`);
      }

      const created = new this.addressModel({
        userId: new Types.ObjectId(userId),
        ...createAddressDto,
      });

      const savedAddress = await created.save();
      await this.usersService.update(userId, { isActive: true });
      await this.userProfileService.update(userId, { addressId: savedAddress._id as Types.ObjectId });

      return savedAddress;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Address> {
    const address = await this.addressModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (!address) {
      throw new NotFoundException(`No address found for userId: ${userId}`);
    }
    return address;
  }

  async update(
    userId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const updatedAddress = await this.addressModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        updateAddressDto,
        { new: true },
      )
      .exec();

    if (!updatedAddress) {
      throw new NotFoundException(`No address found for userId: ${userId}`);
    }
    
    return updatedAddress;
  }

  async verifyAddressIsAvailable(userId: string): Promise<void> {
    const profile = await this.addressModel.findOne({ userId }).exec();
    if (profile) {
      throw new ConflictException('User address is already registered');
    }
  }
}