import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException
} from '@nestjs/common'

import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
	public constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookLivekit(
		@Body() body: string,
		@Headers('Authorization') authorization: string
	) {
		if (!authorization) {
			throw new UnauthorizedException('Отсутствует заголовок авторизации')
		}

		return this.webhookService.receiveWebhookLivekit(body, authorization)
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
		const event = this.webhookService.constructStripeEvent(rawBody, sig);
		await this.webhookService.receiveWebhookStripe(event);
	}
}
