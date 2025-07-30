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
  Subscription,
  SubscriptionDocument,
} from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UsersService } from 'src/users/users.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => UserProfileService))
    private userProfileService: UserProfileService,
  ) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`No user found with userId: ${userId}`);
      }
      const userProfile = await this.userProfileService.findByUserId(userId);
      if (!userProfile) {
        throw new NotFoundException(`No user profile found with userId: ${userId}`);
      }

      await this.verifySubscriptionIsAvailable(userId);

      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];

      const subscriptionData = {
        userId: new Types.ObjectId(userId),
        subscriptionTypeId: new Types.ObjectId(createSubscriptionDto.subscriptionTypeId),
        status: createSubscriptionDto.status ?? true,
        dateStarted: createSubscriptionDto.dateStarted ?? formattedDate,
        mealPlans: createSubscriptionDto.mealPlans ?? 0,
        specialMeal: createSubscriptionDto.specialMeal ?? 0,
        healthyDrinks: createSubscriptionDto.healthyDrinks ?? 0,
        generateMeals: createSubscriptionDto.generateMeals ?? 0,
        dayOfTheMonth: createSubscriptionDto.dayOfTheMonth ?? now.getDate(),
      };

      const created = new this.subscriptionModel(subscriptionData);

      const savedSubscription = await created.save();
      await this.usersService.update(userId, { isActive: true });
      await this.userProfileService.update(userId, { subscriptionId: savedSubscription._id as Types.ObjectId });

      return savedSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (!subscription) {
      throw new NotFoundException(`No subscription found for userId: ${userId}`);
    }
    return subscription;
  }

  async update(
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {

    const subscriptionData = {
        subscriptionTypeId: new Types.ObjectId(updateSubscriptionDto.subscriptionTypeId),
        status: updateSubscriptionDto.status,
        dateStarted: updateSubscriptionDto.dateStarted,
        mealPlans: updateSubscriptionDto.mealPlans,
        specialMeal: updateSubscriptionDto.specialMeal,
        healthyDrinks: updateSubscriptionDto.healthyDrinks,
        generateMeals: updateSubscriptionDto.generateMeals,
        dayOfTheMonth: updateSubscriptionDto.dayOfTheMonth,
    };

    const updatedSubscription = await this.subscriptionModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        subscriptionData,
        { new: true },
      )
      .exec();

    if (!updatedSubscription) {
      throw new NotFoundException(`No subscription found for userId: ${userId}`);
    }
    
    return updatedSubscription;
  }

  async delete(userId: string): Promise<Subscription> {
    const deletedSubscription = await this.subscriptionModel
      .findOneAndDelete({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!deletedSubscription) {
      throw new NotFoundException(`No subscription found for userId: ${userId}`);
    }

    await this.userProfileService.update(userId, { subscriptionId: "" as any });

    return deletedSubscription;
  }

  async verifySubscriptionIsAvailable(userId: string): Promise<void> {
    const profile = await this.subscriptionModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (profile) {
      throw new ConflictException('User subscription is already registered');
    }
  }
}