// application/services/auth.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/user.repository.interface';
import { mailMailerOutbound } from 'src/users/infrastructure/adapters/outbound/mailer/mailer.outbound';
import { UserService } from '../../services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly mailer: mailMailerOutbound,
    private readonly userService: UserService,
  ) {}

  async sendOtpEmail(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { code, expiresAt } = this.userService.generateOtp();

    user.otp = code;
    user.otpExpiresAt = expiresAt;

    await this.userRepo.save(user);
    await this.mailer.sendOtp(email, code);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!this.userService.isOtpValid(otp, user.otp, user.otpExpiresAt)) {
      throw new UnauthorizedException('OTP inválido o expirado');
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await this.userRepo.save(user);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!this.userService.isOtpValid(otp, user.otp, user.otpExpiresAt)) {
      throw new UnauthorizedException('OTP inválido o expirado');
    }

    user.password = newPassword; // Aplica hash si usas bcrypt
    user.otp = null;
    user.otpExpiresAt = null;

    await this.userRepo.save(user);
  }
}
