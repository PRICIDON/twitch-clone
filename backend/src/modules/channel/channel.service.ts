import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async findRecommendedChannel() {
    return this.prismaService.user.findMany({
      where: {
        isDeactivated: false,
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      include: {
        stream: true,
      },
      take: 7,
    });
  }

  async findByUsername(username: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        username,
        isDeactivated: false,
      },
      include: {
        socialLink: {
          orderBy: {
            position: "asc",
          },
        },
        stream: {
          include: {
            category: true,
          },
        },
        followings: true,
      },
    });

    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }
    return channel;
  }

  async findFollowersCountByChannel(channelId: string) {
    return this.prismaService.follow.count({
      where: {
        following: {
          id: channelId,
        },
      },
    });
  }

  async findSponsorsByChannel(channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }

    return this.prismaService.sponsorshipSubscription.findMany({
      where: {
        channelId: channel.id,
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
