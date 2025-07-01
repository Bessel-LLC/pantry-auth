// src/domain/services/user.service.ts
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {
  /**
   * Genera un OTP y su secreto base32, válido por 10 minutos.
   */
  generateOtp(): { code: string; secret: string; expiresAt: Date } {
    const secret = speakeasy.generateSecret().base32;

    const code = speakeasy.totp({
      secret,
      encoding: 'base32',
      step: 600, // OTP válido por 10 minutos
    });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    return { code, secret, expiresAt };
  }

  /**
   * Valida un OTP, su secreto y su expiración.
   * Retorna false si falta información o si ya expiró.
   */
  isOtpValid(
    token: string,
    secret: string | null | undefined,
    expiry: Date | null | undefined,
  ): boolean {
    if (!secret || !expiry) {
      return false;
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      step: 600,
      window: 1,
    });

    return isValid && new Date() < expiry;
  }
}
