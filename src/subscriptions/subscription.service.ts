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
import { ConfigService } from '@nestjs/config';
import {
  SubscriptionType,
  SubscriptionTypeDocument,
} from 'src/subscription-types/entities/subscription-type.entity';
import axios from 'axios';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(SubscriptionType.name)
    private subscriptionTypeModel: Model<SubscriptionTypeDocument>,
    private readonly configService: ConfigService,
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
        throw new NotFoundException(
          `No user profile found with userId: ${userId}`,
        );
      }

      await this.verifySubscriptionIsAvailable(userId);

      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];

      const subscriptionData = {
        userId: new Types.ObjectId(userId),
        subscriptionTypeId: new Types.ObjectId(
          createSubscriptionDto.subscriptionTypeId,
        ),
        status: createSubscriptionDto.status ?? true,
        dateStarted: createSubscriptionDto.dateStarted ?? formattedDate, //YYYY-MM-DD format
        mealPlans: createSubscriptionDto.mealPlans ?? 0,
        specialMeals: createSubscriptionDto.specialMeals ?? 0,
        healthyDrinks: createSubscriptionDto.healthyDrinks ?? 0,
        generateMeals: createSubscriptionDto.generateMeals ?? 0,
        dayOfTheMonth: createSubscriptionDto.dayOfTheMonth ?? now.getDate(),
        rukusubscriptionID: createSubscriptionDto.rukusubscriptionID,
      };
      console.log('subscription data ', subscriptionData);
      const created = new this.subscriptionModel(subscriptionData);

      const savedSubscription = await created.save();
      console.log('subscribed save ', savedSubscription);
      await this.usersService.update(userId, { isActive: true });
      await this.userProfileService.update(userId, {
        subscriptionId: savedSubscription._id as Types.ObjectId,
      });

      return savedSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  //subscribe
  async subscribe(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription | any> {
    const subscriptionFreeID = this.configService.get<string>(
      'FREMIUM_SUBSCRIPTION_ID',
    );
    const rukuURL = this.configService.get<string>('RUKU_API_URL');

    const user = await this.usersService.findOne(userId);
    console.log('user found! ', user);
    if (!user) {
      throw new NotFoundException(`No user found with userId: ${userId}`);
    }
    console.log('this is the user ', user);

    try {
      const userProfile = await this.userProfileService.findByUserId(userId);
      console.log('user profile found ', userProfile);
      if (!userProfile) {
        throw new NotFoundException(
          `No user profile found with userId: ${userId}`,
        );
      }

      //revisar si hay una subscripcion previa

      const actualSubscription = await this.subscriptionModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      console.log('actual subscription ', actualSubscription);
      //eliminar la subscripcion anterior
      if (actualSubscription) {
        //eliminate in the database
        const deletedSubscription = await this.subscriptionModel
          .findOneAndDelete({ userId: new Types.ObjectId(userId) })
          .exec();
        console.log('resultado de borrar cuenta ', deletedSubscription);
        if (
          actualSubscription.subscriptionTypeId !=
          new Types.ObjectId(subscriptionFreeID)
        ) {
          console.log('no tiene una subscription free');
          try {
            let config = {
              method: 'delete',
              maxBodyLength: Infinity,
              url: `${rukuURL}/stripe/subscriptionPeriod/${actualSubscription?.rukusubscriptionID}`,
              headers: {},
            };

            const responseDelete = await axios.request(config);
            console.log('deleted from rukupay ', responseDelete);
          } catch (error) {
            return {
              code: '02',
              message: 'Error deleting in rukupay',
              return: error,
            };
          }
        }
      }

      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];

      const subscriptionData = {
        userId: new Types.ObjectId(userId),
        subscriptionTypeId: new Types.ObjectId(
          createSubscriptionDto.subscriptionTypeId,
        ),
        status: createSubscriptionDto.status ?? true,
        dateStarted: createSubscriptionDto.dateStarted ?? formattedDate, //YYYY-MM-DD format
        mealPlans: createSubscriptionDto.mealPlans ?? 0,
        specialMeals: createSubscriptionDto.specialMeals ?? 0,
        healthyDrinks: createSubscriptionDto.healthyDrinks ?? 0,
        generateMeals: createSubscriptionDto.generateMeals ?? 0,
        dayOfTheMonth: createSubscriptionDto.dayOfTheMonth ?? now.getDate(),
        rukusubscriptionID: createSubscriptionDto.rukusubscriptionID,
      };
      console.log('subscription data ', subscriptionData);
      const created = new this.subscriptionModel(subscriptionData);

      const savedSubscription = await created.save();
      console.log('subscribed save ', savedSubscription);
      await this.usersService.update(userId, { isActive: true });
      await this.userProfileService.update(userId, {
        subscriptionId: savedSubscription._id as Types.ObjectId,
      });

      return {
        code: '01',
        message: 'Subscription updated successfully!',
        return: savedSubscription,
      };
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
      throw new NotFoundException(
        `No subscription found for userId: ${userId}`,
      );
    }
    return subscription;
  }

  async update(
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscriptionData = {
      subscriptionTypeId: new Types.ObjectId(
        updateSubscriptionDto.subscriptionTypeId,
      ),
      status: updateSubscriptionDto.status,
      dateStarted: updateSubscriptionDto.dateStarted,
      mealPlans: updateSubscriptionDto.mealPlans,
      specialMeals: updateSubscriptionDto.specialMeals,
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
      throw new NotFoundException(
        `No subscription found for userId: ${userId}`,
      );
    }

    return updatedSubscription;
  }

  async delete(userId: string): Promise<Subscription | any> {
    const subscriptionID = this.configService.get<string>(
      'FREMIUM_SUBSCRIPTION_ID',
    );
    const rukuURL = this.configService.get<string>('RUKU_API_URL');

    //get the information of the freemium subscription
    const subscriptiontypeFree =
      await this.subscriptionTypeModel.findById(subscriptionID);
    console.log('this is the subscription free ', subscriptiontypeFree);
    if (!subscriptiontypeFree) {
      throw new NotFoundException('No freemium subscription found');
    }

    // cancel the subscription in Rukupay
    const subscriptionToDelete = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    console.log(
      'this is the subscription of ruku ',
      subscriptionToDelete?.rukusubscriptionID,
    );

    try {
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${rukuURL}/stripe/subscriptionPeriod/${subscriptionToDelete?.rukusubscriptionID}`,
        headers: {},
      };

      const responseDelete = await axios
        .request(config);
        console.log('this is the result of delete subscription ', responseDelete);
    } catch (error) {
      console.log('error deleting subscription ', error);
    }

    //delete the actual user subscription
    const deletedSubscription = await this.subscriptionModel
      .findOneAndDelete({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!deletedSubscription) {
      throw new NotFoundException(
        `No subscription found for userId: ${userId}`,
      );
    }

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    //create a new subscription for the user with the freemium subscription
    const subscriptionData = {
      userId: new Types.ObjectId(userId),
      subscriptionTypeId: new Types.ObjectId(subscriptionID),
      status: true,
      dateStarted: formattedDate, //YYYY-MM-DD format
      mealPlans: 0,
      specialMeals: 0,
      healthyDrinks: 0,
      generateMeals: 0,
      dayOfTheMonth: now.getDay(),
      rukusubscriptionID: new Types.ObjectId(subscriptionID), ///temporal tu complete the type
    };

    //create the new subscription
    const created = new this.subscriptionModel(subscriptionData);
    console.log('created ', created)
    const newSubscription = await created.save();

    //update the subscription of the user in the profile to a free subscription
    await this.userProfileService.update(userId, {
      subscriptionId: created.id as any,
    });

    return {
      code: '01',
      success:true,
      message: 'subscribed to free',
      subscription: newSubscription,
    };
  }

  async verifySubscriptionIsAvailable(userId: string): Promise<void> {
    const profile = await this.subscriptionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (profile) {
      throw new ConflictException('User subscription is already registered');
    }
  }
}
