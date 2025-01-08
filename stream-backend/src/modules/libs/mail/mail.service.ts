import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private sendMail(email: string, subject: string, html: string) {
    return this.mailService.sendMail(email, subject, html);
  }
}
