import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { IS_DEV_ENV } from "../shared/utils/is-dev.util";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { getGraphQLConfig } from "./config/graphql.config";
import { RedisModule } from "./redis/redis.module";
import { AccountModule } from "../modules/auth/account/account.module";
import { SessionModule } from "../modules/auth/session/session.module";
import { VerificationModule } from "../modules/auth/verification/verification.module";
import { MailModule } from "../modules/libs/mail/mail.module";
import { PasswordRecoveryModule } from "../modules/auth/password-recovery/password-recovery.module";
import { TotpModule } from "../modules/auth/totp/totp.module";
import { DeactivateModule } from "../modules/auth/deactivate/deactivate.module";
import { CronModule } from "../modules/auth/cron/cron.module";
import { StorageModule } from "../modules/libs/storage/storage.module";
import { ProfileModule } from "../modules/auth/profile/profile.module";
import { StreamModule } from "../modules/stream/stream.module";
import { LivekitModule } from "../modules/libs/livekit/livekit.module";
import { getLiveKitConfig } from "./config/livekit.config";
import { IngressModule } from "../modules/stream/ingress/ingress.module";
import { CategoryModule } from "../modules/category/category.module";
import { ChatModule } from "../modules/chat/chat.module";
import { FollowModule } from "../modules/follow/follow.module";
import { ChannelModule } from "../modules/channel/channel.module";
import { NotificationModule } from "../modules/notification/notification.module";
import { TelegramModule } from "src/modules/libs/telegram/telegram.module";
import Stripe from "stripe";
import { StripeModule } from "../modules/libs/stripe/stripe.module";
import { getStripeConfig } from "./config/stripe.config";
import { SubscriptionModule } from "../modules/sponsorship/subscription/subscription.module";
import { PlanModule } from "../modules/sponsorship/plan/plan.module";
import { TransactionModule } from "../modules/sponsorship/transaction/transaction.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService],
    }),
    LivekitModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getLiveKitConfig,
      inject: [ConfigService],
    }),
    StripeModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getStripeConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    MailModule,
    AccountModule,
    SessionModule,
    VerificationModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivateModule,
    CronModule,
    StorageModule,
    ProfileModule,
    StreamModule,
    IngressModule,
    CategoryModule,
    ChatModule,
    FollowModule,
    ChannelModule,
    NotificationModule,
    TelegramModule,
    PlanModule,
    TransactionModule,
    SubscriptionModule,
  ],
})
export class CoreModule {}
