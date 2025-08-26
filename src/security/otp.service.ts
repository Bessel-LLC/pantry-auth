import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as OTPAuth from 'otpauth';

import { Otp } from './entities/otp.entity';
import { OtpType } from 'src/common/otp-type.enum';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { getExpiryDate, isExpired } from 'src/common/time_token.utils';
import { ConfigService } from '@nestjs/config';
import { ResendOtpDto } from './dto/resendotp.dto';
import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class OtpService {
  private readonly otpExpirationMinutes: number;

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private configService: ConfigService,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {
    this.otpExpirationMinutes = parseInt(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES')!,
      10,
    );
  }

  async generateOtp(email: string): Promise<{ otp: string; secret: string }> {
    const secretObj = new OTPAuth.Secret({ size: 20 });
    const secret = secretObj.base32;

    const totp = new OTPAuth.TOTP({
      issuer: 'TuApp',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: this.otpExpirationMinutes * 60, // two (2) minutes
      secret,
    });

    const otp = totp.generate();

    return { otp, secret };
  }

  async saveOtp(
    user_id: string,
    otpCode: string,
    expiresAt: Date,
  ): Promise<void> {
    try {
      await this.otpModel.create({
        user_id,
        otpCode,
        expiresAt,
        createdAt: new Date(),
        type: OtpType.SIGUNP,
      });
    } catch (error) {
      console.error('Failed to save OTP:', error);
      throw error;
    }
  }

  private async clearOtpData(user_id: string): Promise<void> {
    try {
      const result = await this.otpModel.updateOne(
        { user_id },
        {
          $set: {
            otpCode: null,
            expiresAt: null,
          },
        },
      );

      if (!result.modifiedCount) {
        throw new BadRequestException(
          `No OTP data updated for user_id ${user_id}`,
        );
      }
    } catch (error) {
      console.error(`Error clearing OTP data for user_id ${user_id}:`, error);
      throw error;
    }
  }

  async resendOtp(
    resendOtp: ResendOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const { user_id } = resendOtp;
    //find existing user
    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const user_otp = await this.otpModel.findOne({ user_id });
    if (!user_otp) {
      throw new NotFoundException('user_otp not found');
    }
    //delete existing otp
    await this.otpModel.findOneAndDelete({user_id: user_id});
    //create new otp
    const expiresAt = getExpiryDate(this.otpExpirationMinutes); // Add two (2) minutes to date now
    const { otp, secret } = await this.generateOtp(user.email);
    try {
      await this.saveOtp(user_id, otp, expiresAt);

      try {
        await this.mailerService.sendMail(
          user.email,
          `Pantry AI - Verify Your Account`,
          'Account Verification Code',
          `<p>Hello <strong>${user.email}</strong>,</p>
   <p>To complete your registration, please use the following One-Time Password (OTP) to verify your account:</p>
   <h3>${otp}</h3>
   <p>This code will expire in ${this.otpExpirationMinutes} minutes. If you didn’t request this, please ignore this email.</p>`,
        );

        return {
          success: true,
          message: `OTP sent successfully to your email`,
        };
      } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new UnauthorizedException('Failed to send OTP email');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw new UnauthorizedException('Failed to generate OTP');
    }

    return { success: false, message: 'Failed to resend OTP' };
  }

  async validateOtp(
    validateOtpDto: ValidateOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { user_id, otpCode } = validateOtpDto;
      const user_otp = await this.otpModel.findOne({ user_id });

      if (!user_otp) {
        throw new NotFoundException('user_otp not found');
      }

      if (user_otp.otpCode === null || user_otp.expiresAt === null) {
        throw new UnauthorizedException('Try to resend OTP code first again');
      }

      if (user_otp.otpCode !== otpCode) {
        throw new UnauthorizedException('Invalid OTP');
      }

      const isOtpExpired = user_otp.expiresAt && isExpired(user_otp.expiresAt);
      await this.clearOtpData(user_id);

      if (isOtpExpired) {
        return { success: false, message: 'OTP has expired' };
      } else {
        return { success: true, message: 'OTP successfully verified' };
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      throw error;
    }
  }
}
