import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException,
	Req
} from '@nestjs/common'
import { Request } from 'express';
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
	public constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookLivekit(
		@RawBody() rawBody: Buffer,  // Заменили @Body() на @RawBody()
		@Headers('Authorization') authorization: string
	) {
		if (!authorization) {
		  throw new UnauthorizedException('Отсутствует заголовок авторизации');
		}

		const bodyString = rawBody.toString(); // Преобразуем Buffer в строку
		return await this.webhookService.receiveWebhookLivekit(bodyString, authorization);
	}

	@Post('stripe')
	@HttpCode(HttpStatus.OK)
	async receiveWebhookStripe(
	  @Headers('stripe-signature') signature: string,
	  @Req() req: Request, // Используем весь запрос
	) {
	  if (!signature) {
		throw new UnauthorizedException('❌ Отсутствует подпись Stripe');
	  }

	  // Принудительно приводим Buffer в строку
	  const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : req.body;

	  console.log('🟢 VK Tunnel Raw Body:', rawBody);
	  console.log('🟢 Type:', typeof rawBody);
	  console.log('🟢 Length:', rawBody ? rawBody.length : 'undefined');

	  const event = this.webhookService.constructStripeEvent(rawBody, signature);
	  await this.webhookService.receiveWebhookStripe(event);
	}
}
