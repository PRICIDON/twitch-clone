import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import type { User } from "../../../../prisma/generated";

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMySponsors(user: User) {
    return this.prismaService.sponsorshipSubscription.findMany({
      where: {
        channelId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: true,
        user: true,
        channel: true,
      },
    });
  }
}
