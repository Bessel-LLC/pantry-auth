import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as OTPAuth from 'otpauth';

import { Otp } from './entities/otp.entity';
import { OtpType } from 'src/common/otp-type.enum';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { isExpired } from 'src/common/time_token.utils';
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
    await this.otpModel.updateOne(
      { user_id },
      {
        $set: {
          otpCode: null,
          expiresAt: null,
        },
      },
    );
  }

  async validateOtp(
    validateOtpDto: ValidateOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { user_id, otpCode } = validateOtpDto;
      const user = await this.otpModel.findOne({ user_id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.otpCode !== otpCode) {
        throw new UnauthorizedException('Invalid OTP');
      }

      if (user.otpCode === null || user.expiresAt === null) {
        throw new UnauthorizedException('Try to sign up first again');
      }

      const isOtpExpired = user.expiresAt && isExpired(user.expiresAt);

      if (isOtpExpired) {
        await this.clearOtpData(user.id);
        return { success: false, message: 'OTP has expired' };
      } else {
        await this.clearOtpData(user.id);

        return { success: true, message: 'OTP successfully verified' };
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      throw error;
    }
  }
}
