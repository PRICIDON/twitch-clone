import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
  UnauthorizedException,
  RawBody,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("livekit")
  @HttpCode(HttpStatus.OK)
  async receiveWebhookLivekit(
    @Body() body: string,
    @Headers("Authorization") authorization: string,
  ) {
    if (!authorization) {
      throw new UnauthorizedException("Отсутсует заголовок авторизации");
    }
    return this.webhookService.receiveWebhookLivekit(body, authorization);
  }

  @Post("stripe")
  @HttpCode(HttpStatus.OK)
  async receiveWEbhookStripe(
    @RawBody() rawBody: string,
    @Headers("stripe-signature") sig: string,
  ) {
    if (!sig) {
      throw new UnauthorizedException("Отсутсвует подпись Stripe в заголовке");
    }
    const event = await this.webhookService.constructStripeEvent(rawBody, sig);
    await this.webhookService.receiveWebhookStripe(event);
  }
}
