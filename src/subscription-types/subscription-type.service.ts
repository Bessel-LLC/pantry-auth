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
  SubscriptionType,
  SubscriptionTypeDocument,
} from './entities/subscription-type.entity';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';

@Injectable()
export class SubscriptionTypeService {
  constructor(
    @InjectModel(SubscriptionType.name)
    private subscriptionTypeModel: Model<SubscriptionTypeDocument>,
  ) {}

  async create(
    createSubscriptionTypeDto: CreateSubscriptionTypeDto,
  ): Promise<SubscriptionType> {
    try {
      const created = new this.subscriptionTypeModel({
        ...createSubscriptionTypeDto,
      });

      const savedSubscriptionType = await created.save();

      return savedSubscriptionType;
    } catch (error) {
      console.error('Error creating subscription type:', error);
      throw error;
    }
  }

  async getAll(): Promise<SubscriptionType[]> {
    try {
      const allSubscriptionTypes = await this.subscriptionTypeModel.find();

      return allSubscriptionTypes;
    } catch (error) {
      console.error('Error getting subscription type:', error);
      throw error;
    }
  }

  async findBySubscriptionTypeId(id: string): Promise<SubscriptionType> {
    const subscriptionType = await this.subscriptionTypeModel
      .findOne({ _id: new Types.ObjectId(id) })
      .exec();
    if (!subscriptionType) {
      throw new NotFoundException(`No subscription found: ${id}`);
    }
    return subscriptionType;
  }

  async update(
    id: string,
    updateSubscriptionTypeDto: UpdateSubscriptionTypeDto,
  ): Promise<SubscriptionType> {
    const updatedSubscriptionType = await this.subscriptionTypeModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateSubscriptionTypeDto,
        { new: true },
      )
      .exec();

    if (!updatedSubscriptionType) {
      throw new NotFoundException(`The Subscription Type not found: ${id}`);
    }

    return updatedSubscriptionType;
  }
}
