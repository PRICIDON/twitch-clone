import { Injectable } from "@nestjs/common";
import { LivekitService } from "../libs/livekit/livekit.service";
import { PrismaService } from "../../core/prisma/prisma.service";
import { NotificationService } from "../notification/notification.service";
import { TelegramService } from "../libs/telegram/telegram.service";

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
  ) {}

  async receiveWebhookLivekit(body: string, authorization: string) {
    const event = this.livekitService.receiver.receive(
      body,
      authorization,
      true,
    );

    if (event.event === "ingress_started") {
      console.log("STREAM STARTED:", event.ingressInfo.url);
      const stream = await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo.ingressId,
        },
        data: {
          isLive: true,
        },
        include: {
          user: true,
        },
      });
      const followers = await this.prismaService.follow.findMany({
        where: {
          followingId: stream.userId,
          follower: {
            isDeactivated: false,
          },
        },
        include: {
          follower: {
            include: {
              notificationsSettings: true,
            },
          },
        },
      });
      for (const follow of followers) {
        const follower = follow.follower;

        if (follower.notificationsSettings.siteNotifications) {
          await this.notificationService.createStreamStart(
            follower.id,
            stream.user,
          );
        }
        if (
          follower.notificationsSettings.telegramNotifications &&
          follower.telegramId
        ) {
          await this.telegramService.sendStreamStart(
            follower.telegramId,
            stream.user,
          );
        }
      }
    }
    if (event.event === "ingress_ended") {
      const stream = await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo.ingressId,
        },
        data: {
          isLive: false,
        },
      });

      await this.prismaService.chatMessage.deleteMany({
        where: {
          streamId: stream.id,
        },
      });
    }
  }
}
