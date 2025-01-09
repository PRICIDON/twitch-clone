import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { MailService } from "../../libs/mail/mail.service";
import type { Request } from "express";
import { VerificationInput } from "./inputs/verification.input";
import { $Enums, User } from "../../../../prisma/generated";
import TokenType = $Enums.TokenType;
import { NotFoundError } from "rxjs";
import { getSessionMetadata } from "../../../shared/utils/session-metadata.utils";
import { saveSession } from "../../../shared/utils/session.util";
import { generateToken } from "../../../shared/utils/generate-token.util";

@Injectable()
export class VerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async verify(req: Request, input: VerificationInput, userAgent: string) {
    const { token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.EMAIL_VERIFY,
      },
    });

    if (!existingToken) {
      throw new NotFoundError("Токен не найден");
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException("Токен Истек");
    }

    const user = await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.EMAIL_VERIFY,
      },
    });
    const metadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, metadata);
  }

  async sendVerificationToken(user: User) {
    const verification = await generateToken(
      this.prismaService,
      user,
      TokenType.EMAIL_VERIFY,
      true,
    );

    await this.mailService.sendVerificationToken(
      user.email,
      verification.token,
    );
    return true;
  }
}
