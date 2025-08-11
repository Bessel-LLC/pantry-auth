import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { TokenService } from 'src/users/token.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './entities/otp.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    MailerModule
  ],
  providers: [SecurityService, TokenService, OtpService, AuthService],
  controllers: [SecurityController],
})
export class SecurityModule {}
