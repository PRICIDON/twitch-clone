import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { MailService } from "../../libs/mail/mail.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class CronService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron("0 0 * * *")
  async deleteDeactivatedAccount() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7);
    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    });

    for (const user of deactivatedAccounts) {
      await this.mailService.sendAccountDeletion(user.email);
    }

    console.log("Deactivated Account:", deactivatedAccounts);
    await this.prismaService.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
