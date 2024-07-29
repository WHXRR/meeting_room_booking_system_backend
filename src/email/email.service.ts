import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transport: Transporter;

  constructor(private configService: ConfigService) {
    this.transport = createTransport({
      host: configService.get('nodemail_host'),
      port: configService.get('nodemail_port'),
      secure: false,
      auth: {
        user: configService.get('nodemail_auth_user'),
        pass: configService.get('nodemail_auth_pass'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transport.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('nodemail_auth_user'),
      },
      to,
      subject,
      html,
    });
  }
}
