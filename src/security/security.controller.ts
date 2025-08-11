import { Controller, Post, Body, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { SecurityService } from './security.service';
import { LoginDto } from './dto/login.dto';
import { UserResponseBodyDto } from 'src/users/dto/response-user.dto';
import { SignupDto } from './dto/signup.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';
import { PasswordDto } from './dto/password.dto';

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
password
  @Put('update-')
  async updatePassword(
    @Body() passwordDto: PasswordDto 
  ) {
    return await this.securityService.updatePassword(passwordDto);
  }

  /*@Post('resend-otp')
  async resendOtp(@Body() validateOtpDto: ValidateOtpDto) {
    return this.otpService.resendOtp(validateOtpDto);
  }*/
}
