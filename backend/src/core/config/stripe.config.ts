import { ConfigService } from "@nestjs/config";
import { TypeStripeOptions } from "../../modules/libs/stripe/types/stripe.types";

export function getStripeConfig(
  configService: ConfigService,
): TypeStripeOptions {
  return {
    apiKey: configService.getOrThrow("STRIPE_SECRET_KEY"),
    config: {
      apiVersion: "2024-12-18.acacia",
    },
  };
}
