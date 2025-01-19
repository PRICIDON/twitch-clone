import { Global, Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { TelegrafModule } from "nestjs-telegraf";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getTelegrafConfig } from "../../../core/config/telegraf.config";

@Global()
@Module({
  providers: [TelegramService],
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTelegrafConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
