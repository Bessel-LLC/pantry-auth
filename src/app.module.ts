import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SecurityModule } from './security/security.module';
import { MailerModule } from './mailer/mailer.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AddressModule } from './address/address.module';
import { RukuService } from './services/rukupay';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().uri().required(),
        MAIL_USER: Joi.string().email().required(),
        MAIL_PASS: Joi.string().min(3).required(),
        JWT_SECRET: Joi.string().min(10).required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        OTP_EXPIRATION_MINUTES: Joi.number().default(2).required(),
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    UsersModule,
    SecurityModule,
    MailerModule,
    UserProfileModule,
    AddressModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
