import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { SecurityService } from './security.service';
import { LoginDto } from './dto/login.dto';
import { UserResponseBodyDto } from 'src/users/dto/response-user.dto';
import { SignupDto } from './dto/signup.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';
import { ResendOtpDto } from './dto/resendotp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('security')
export class SecurityController {
  constructor(
    private securityService: SecurityService,
    private otpService: OtpService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Logged in user' })
  async login(@Body() loginDto: LoginDto): Promise<UserResponseBodyDto> {
    const logged_in_user = this.securityService.login(loginDto);
    return logged_in_user;
  }

  @Post('signup')
  async signUp(@Body() signupDto: SignupDto) {
    return this.securityService.signup(signupDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() validateOtpDto: ValidateOtpDto) {
    return await this.otpService.validateOtp(validateOtpDto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() validateOtpDto: ResendOtpDto) {
    return this.otpService.resendOtp(validateOtpDto);
  }

  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.securityService.updatePassword(updatePasswordDto);
  }
}
