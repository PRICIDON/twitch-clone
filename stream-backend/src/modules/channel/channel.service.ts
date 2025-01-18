import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async findRecommendedChannel() {
    const channels = await this.prismaService.user.findMany({
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
    return channels;
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
    const followers = await this.prismaService.follow.count({
      where: {
        following: {
          id: channelId,
        },
      },
    });
    return followers;
  }
}
