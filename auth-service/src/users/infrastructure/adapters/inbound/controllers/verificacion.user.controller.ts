// infrastructure/adapters/inbound/controllers/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from 'src/users/application/ports/input/generate-otp-use-case';

@ApiTags('auth')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    await this.authService.sendOtpEmail(email);
    return { message: 'OTP enviado al correo electrónico' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    await this.authService.verifyOtp(body.email, body.otp);
    return { message: 'Cuenta verificada' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    await this.authService.resetPassword(body.email, body.otp, body.newPassword);
    return { message: 'Contraseña actualizada' };
  }
}
