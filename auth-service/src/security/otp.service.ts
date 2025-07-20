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
import { isExpired } from 'src/common/time.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly otpExpirationMinutes: number;

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private configService: ConfigService,
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
