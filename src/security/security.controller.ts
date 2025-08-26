import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { SecurityService } from './security.service';
import { LoginDto } from './dto/login.dto';
import { UserResponseBodyDto } from 'src/users/dto/response-user.dto';
import { SignupDto } from './dto/signup.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';
import { ResendOtpDto } from './dto/resendotp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ValidateOtpRecoverDto } from './dto/validateotp.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

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
  async resendRecoverOtp(@Body() validateOtpDto: ResendOtpDto) {
    return this.otpService.resendOtp(validateOtpDto);
  }

  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.securityService.updatePassword(updatePasswordDto);
  }
  //recover-password
  @Post('request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.securityService.requestOtp(dto);
  }

  @Post('resend-otp/:userId')
  resendOtp(@Param('userId') userId: string) {
    return this.securityService.resendOtpRecoverPassword(userId);
  }

  @Post('validate-otp')
  validateOtp(@Body() dto: ValidateOtpRecoverDto) {
    return this.securityService.validateOtp(dto);
  }

  @Post('recover-password')
  recoverPassword(@Body() dto: RecoverPasswordDto) {
    return this.securityService.recoverPassword(dto);
  }
}
