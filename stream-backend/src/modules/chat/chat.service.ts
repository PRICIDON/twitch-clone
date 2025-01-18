import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { SendMessageInput } from "./inputs/send-message.input";
import { User } from "../../../prisma/generated";
import { ChangeChatSettingsInput } from "./inputs/change-chat-settings.input";

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByStream(streamId: string) {
    const messages = await this.prismaService.chatMessage.findMany({
      where: { streamId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
    return messages;
  }

  async sendMessage(userId: string, input: SendMessageInput) {
    const { text, streamId } = input;
    const stream = await this.prismaService.stream.findUnique({
      where: {
        id: streamId,
      },
    });
    if (!stream) {
      throw new NotFoundException("Стрим не найден");
    }
    if (!stream.isLive) {
      throw new BadRequestException("Стрим не в режиме живого вещания");
    }

    return this.prismaService.chatMessage.create({
      data: {
        text,
        user: {
          connect: {
            id: userId,
          },
        },
        stream: {
          connect: {
            id: streamId,
          },
        },
      },
      include: {
        stream: true,
      },
    });
  }

  async changeSettings(user: User, input: ChangeChatSettingsInput) {
    const { isChatPremiumFollowersOnly, isChatFollowersOnly, isChatEnabled } =
      input;

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        isChatPremiumFollowersOnly,
        isChatEnabled,
        isChatFollowersOnly,
      },
    });
    return true;
  }
}
