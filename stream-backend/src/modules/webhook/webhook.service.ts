import { Injectable } from "@nestjs/common";
import { LivekitService } from "../libs/livekit/livekit.service";
import { PrismaService } from "../../core/prisma/prisma.service";

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
  ) {}

  async receiveWebhookLivekit(body: string, authorization: string) {
    const event = await this.livekitService.receiver.receive(
      body,
      authorization,
      true,
    );

    if (event.event === "ingress_started") {
      console.log("STREAM STARTED:", event.ingressInfo.url);
      await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo.ingressId,
        },
        data: {
          isLive: true,
        },
      });
    }
    if (event.event === "ingress_ended") {
      await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo.ingressId,
        },
        data: {
          isLive: false,
        },
      });
    }
  }
}
