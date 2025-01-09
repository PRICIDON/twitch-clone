import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { MailService } from "../../libs/mail/mail.service";
import type { Request } from "express";
import { ResetPasswordInput } from "./inputs/reset-password.input";
import { generateToken } from "../../../shared/utils/generate-token.util";
import { $Enums } from "../../../../prisma/generated";
import TokenType = $Enums.TokenType;
import { getSessionMetadata } from "../../../shared/utils/session-metadata.utils";
import { NewPasswordInput } from "./inputs/new-password.input";
import { NotFoundError } from "rxjs";
import { hash } from "argon2";

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string,
  ) {
    const { email } = input;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotAcceptableException("Пользователь не найден");
    }

    const resetToken = await generateToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET,
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendPasswordResetToken(
      user.email,
      resetToken.token,
      metadata,
    );

    return true;
  }

  async newPassword(input: NewPasswordInput) {
    const { password, token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
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
        password: await hash(password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });
    return true;
  }
}
