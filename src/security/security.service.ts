import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { PasswordDto } from './dto/password.dto';
import { AuthService } from './auth.service';

@Injectable()
export class SecurityService {
  private readonly otpExpirationMinutes: number;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    private otpService: OtpService,
    private configService: ConfigService,
  ) {
    this.otpExpirationMinutes = parseInt(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES')!,
      10,
    );
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.verifyUserExists(email); 
  
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }  
      throw new UnauthorizedException('Invalid password');

    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  

  async login(loginDto: LoginDto): Promise<UserResponseBodyDto> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      const payload = { email: user.email, sub: user.id };
      const access_token = this.authService.generateToken(payload);

      const updatedUser = await this.tokenService.updateToken(user.id, { token: access_token });

      const { _id, password, __v, ...responseBody } = updatedUser.toObject();

      return {...responseBody, userId: _id };

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
            response: {...responseBody, userId: _id }
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

  async updatePassword(passwordDto: PasswordDto): Promise<{ message: string, user: UserResponseBodyDto }> {
    try {
      const { password, newPassword, confirmPassword, access_token } = passwordDto;

      const decodedToken = this.authService.verifyToken(access_token)
      const user = await this.validateUser(decodedToken.email, password);

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const storedUser = await this.tokenService.findTokenByUserId(user.id);
      if (!storedUser) {
        throw new UnauthorizedException('Token not found for user with ID ${user.id}');
      }
      if (storedUser.token !== access_token) {
        throw new UnauthorizedException('Token does not match the stored token');
      }

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      } catch (error) {
        throw error;
      }
      await user.save();

      const { _id, __v, ...responseBody } = user.toObject();

      return { message: 'Password updated successfully', ...responseBody, userId: _id };
    } catch (error) {
      throw error;
    }
  }
}
