import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.createMailTransportProvider();
  }

  async createMailTransportProvider(): Promise<nodemailer.Transporter> {
    const user = this.configService.get<string>('MAIL_USER')!;
    const pass = this.configService.get<string>('MAIL_PASS')!;
    
    this.fromEmail = user;

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    try {
      await this.transporter.verify();
      return this.transporter;
    } catch (err) {
      throw error;
    }
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: this.fromEmail,
      to,
      subject,
      text,
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
