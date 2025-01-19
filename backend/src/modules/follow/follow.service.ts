import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { User } from "../../../prisma/generated";
import { NotificationService } from "../notification/notification.service";
import { TelegramService } from "../libs/telegram/telegram.service";

@Injectable()
export class FollowService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
  ) {}

  async findMyFollowers(user: User) {
    return this.prismaService.follow.findMany({
      where: {
        followingId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        follower: true,
      },
    });
  }

  async findMyFollowings(user: User) {
    return this.prismaService.follow.findMany({
      where: {
        followerId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        following: true,
      },
    });
  }

  async follow(user: User, channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }

    if (channel.id === user.id) {
      throw new ConflictException("Нельзя подписатся на себя");
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channel.id,
      },
    });
    if (existingFollow) {
      throw new ConflictException("Вы уже подпиcаны на этот канал");
    }

    const follow = await this.prismaService.follow.create({
      data: {
        followerId: user.id,
        followingId: channelId,
      },
      include: {
        follower: true,
        following: {
          include: {
            notificationsSettings: true,
          },
        },
      },
    });

    if (follow.following.notificationsSettings.siteNotifications) {
      await this.notificationService.createNewFollowing(
        follow.following.id,
        follow.follower,
      );
    }

    if (
      follow.following.notificationsSettings.telegramNotifications &&
      follow.following.telegramId
    ) {
      await this.telegramService.sendNewFollowing(
        follow.following.telegramId,
        follow.follower,
      );
    }

    return true;
  }

  async unfollow(user: User, channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new NotFoundException("Канал не найден");
    }

    if (channel.id === user.id) {
      throw new ConflictException("Нельзя отписатся от себя");
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channel.id,
      },
    });
    if (!existingFollow) {
      throw new ConflictException("Вы не подписаны на этот канал");
    }

    await this.prismaService.follow.delete({
      where: {
        id: existingFollow.id,
        followerId: user.id,
        followingId: channel.id,
      },
    });
    return true;
  }
}
