import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class mailMailerOutbound {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('MAIL_USER'),
      to,
      subject: 'Tu código de verificación',
      text: `Tu código OTP es: ${otp}. Expira en 10 minutos.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}