import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { TokenService } from 'src/users/token.service';
import { LoginDto } from './dto/login.dto';
import { UserResponseBodyDto } from 'src/users/dto/response-user.dto';
import { SignupDto } from './dto/signup.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { OtpService } from './otp.service';
import { ConfigService } from '@nestjs/config';
import { getExpiryDate } from 'src/common/time_token.utils';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ValidateOtpRecoverDto } from './dto/validateotp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Otp } from './entities/otp.entity';
import { Model } from 'mongoose';
import { RecoverPasswordDto } from './dto/recover-password.dto';

@Injectable()
export class SecurityService {
  private readonly otpExpirationMinutes: number;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    private otpService: OtpService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) {
    this.otpExpirationMinutes = parseInt(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES')!,
      10,
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.verifyUserExists(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
  }

  async login(loginDto: LoginDto): Promise<UserResponseBodyDto> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { email: user.email, sub: user._id };
      const access_token = this.jwtService.sign(payload);

      await this.tokenService.updateToken(user.id, { token: access_token });

      const { _id, password, __v, ...responseBody } = user.toObject();

      return { ...responseBody, userId: _id };
    } catch (error) {
      throw error;
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const user = await this.usersService.create(signupDto);
      const expiresAt = getExpiryDate(this.otpExpirationMinutes); // Add two (2) minutes to date now

      const { otp, secret } = await this.otpService.generateOtp(user.email);

      try {
        await this.otpService.saveOtp(user.id, otp, expiresAt);

        try {
          const { _id, password, __v, ...responseBody } = user.toObject();
          await this.mailerService.sendMail(
            user.email,
            `Welcome to Pantry AI.`,
            'Verification Code:',
            `<p>Hello <strong>${user.email}</strong>, thank you for signing up.</p>
      <h3>Your verification code is: ${otp}</h3>
      <p>This code will expire in ${this.otpExpirationMinutes} minutes.</p>`,
          );

          return {
            message: 'User registered. An OTP code has been sent to the email.',
            response: { ...responseBody, userId: _id },
          };
        } catch (error) {
          console.error('Error sending OTP email:', error);
          throw new UnauthorizedException('Failed to send OTP email');
        }
      } catch (error) {
        console.error('Error generating OTP:', error);
        throw new UnauthorizedException('Failed to generate OTP');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }
  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { user_id: userId, oldPassword, newPassword } = updatePasswordDto;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: hashedPassword });
    return { message: 'Password updated successfully', success: true };
  }

  //recovery password services

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  }

  async requestOtp(dto: RequestOtpDto) {
    console.log('request and otp ', dto);
    const user = await this.userModel.findOne({ email: dto.email });
    console.log('this is the user', user);
    if (!user) throw new NotFoundException('Account not found');

    const otp = this.generateOtp();
    console.log('first ', otp);
    await this.otpModel.create({
      user_id: user._id,
      otpCode: otp,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // valid 10 mins
    });
    //send email with otp to recover password
    try {
      const { _id, password, __v, ...responseBody } = user.toObject();
      await this.mailerService.sendMail(
        user.email,
        `Pantry AI - Password Reset`,
        'Password Reset Verification Code',
        `<p>Hello <strong>${user.email}</strong>,</p>
    <p>We received a request to reset your password for your Pantry AI account.</p>
    <h3>Your password reset code is: ${otp}</h3>
    <p>This code will expire in ${this.otpExpirationMinutes} minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>`,
      );

      console.log(`Send OTP ${otp} to email ${dto.email}`);

      return { message: 'OTP sent to email', success: true };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new UnauthorizedException('Failed to send OTP email');
    }
  }
  //not used
  async resendOtpRecoverPassword(email: string) {
    const otp = this.generateOtp();
    await this.otpModel.findOneAndUpdate(
      { email: email },
      { otp, expiresAt: new Date(Date.now() + 1000 * 60 * 2) }, ///valid 2 minutes
      { upsert: true },
    );

    const user = await this.userModel.findById(email);
    if (!user) throw new NotFoundException('User not found');

    // TODO: integrate real email service
    console.log(`Resend OTP ${otp} to email ${user.email}`);

    return { message: 'OTP resent to email' };
  }

  async validateOtp(dto: ValidateOtpRecoverDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('Account not found');
    const otpRecord = await this.otpModel.findOne({
      user_id: user._id,
      otpCode: dto.otp,
    });
    console.log('result of otp record', otpRecord);
    if (!otpRecord) throw new BadRequestException('Invalid OTP');

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    await this.otpModel.deleteOne({ user_id: user._id, otpCode: dto.otp });
    return { message: 'OTP is valid', success: true };
  }

  async recoverPassword(dto: RecoverPasswordDto) {
    console.log('this is the dto', dto);
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userModel.findOneAndUpdate(
      { email: dto.email },
      {
        password: hashedPassword,
      },
    );

    try {
      const { _id, password, __v, ...responseBody } = user.toObject();
      await this.mailerService.sendMail(
        user.email,
        `Pantry AI - Password Updated`,
        'Password Successfully Updated',
        `<p>Hello <strong>${user.email}</strong>,</p>
  <p>Your password for your Pantry AI account has been successfully updated.</p>
  <p>If you did not make this change, please contact our support team immediately.</p>
  <p>Thank you for using Pantry AI.</p>`,
      );

      console.log(`Send confirmation to email ${dto.email}`);

      return {
        message: 'Your password was successfully updated!',
        success: true,
      };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new UnauthorizedException('Failed to send OTP email');
    }

    return { message: 'Password updated successfully' };
  }
}
