import { type MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { RawBodyMiddleware } from "../../shared/middlewares/raw-body.middleware";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes({
      path: "webhook/livekit",
      method: RequestMethod.POST,
    });
  }
}
