import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { User } from "../../../prisma/generated";

@Injectable()
export class FollowService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMyFollowers(user: User) {
    const followers = await this.prismaService.follow.findMany({
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
    return followers;
  }

  async findMyFollowings(user: User) {
    const followings = await this.prismaService.follow.findMany({
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
    return followings;
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
      throw new ConflictException("Вы уже подпианы на этот канал");
    }

    await this.prismaService.follow.create({
      data: {
        followerId: user.id,
        followingId: channelId,
      },
    });
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
