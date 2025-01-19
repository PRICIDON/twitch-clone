import {ConfigService} from "@nestjs/config";
import {TelegrafModuleOptions} from "nestjs-telegraf";

export function getTelegrafConfig(configService: ConfigService): TelegrafModuleOptions {
    return {
        token: configService.getOrThrow('TELEGRAM_BOT_TOKEN')
    }
}