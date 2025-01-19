import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { MailService } from "../../libs/mail/mail.service";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { NotFoundError } from "rxjs";
import { destroySession } from "../../../shared/utils/session.util";
import { $Enums, type User } from "../../../../prisma/generated";
import TokenType = $Enums.TokenType;
import { generateToken } from "../../../shared/utils/generate-token.util";
import { getSessionMetadata } from "../../../shared/utils/session-metadata.utils";
import { DeactivateAccountInput } from "./inputs/deactivate-account.input";
import { verify } from "argon2";
import { TelegramService } from "../../libs/telegram/telegram.service";

@Injectable()
export class DeactivateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly telegramService: TelegramService,
  ) {}

  private async validateDeactivateToken(req: Request, token: string) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    });

    if (!existingToken) {
      throw new NotFoundError("Токен не найден");
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException("Токен Истек");
    }

    await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date(),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    });

    return destroySession(req, this.configService);
  }

  async sendDeactivateToken(req: Request, user: User, userAgent: string) {
    const deactivateToken = await generateToken(
      this.prismaService,
      user,
      TokenType.DEACTIVATE_ACCOUNT,
      false,
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendDeactivateToken(
      user.email,
      deactivateToken.token,
      metadata,
    );

    if (
      deactivateToken.user.notificationsSettings.telegramNotifications &&
      deactivateToken.user.telegramId
    ) {
      await this.telegramService.sendDeactivateToken(
        user.telegramId,
        deactivateToken.token,
        metadata,
      );
    }

    return true;
  }

  async deactivate(
    req: Request,
    input: DeactivateAccountInput,
    user: User,
    userAgent: string,
  ) {
    const { email, password, pin } = input;

    if (user.email !== email) {
      throw new BadRequestException("Неверная почта");
    }
    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new BadRequestException("Неверный пароль");
    }

    if (!pin) {
      await this.sendDeactivateToken(req, user, userAgent);

      return { message: "Требуется код потверждения" };
    }

    await this.validateDeactivateToken(req, pin);

    return { user };
  }
}
