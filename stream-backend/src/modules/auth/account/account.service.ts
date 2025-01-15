import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { CreateUserInput } from "./inputs/create-user.input";
import { hash, verify } from "argon2";
import { VerificationService } from "../verification/verification.service";
import type { User } from "../../../../prisma/generated";
import { ChangeEmailInput } from "./inputs/change-email.input";
import { ChangePasswordInput } from "./inputs/change-password.input";

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  async me(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        socialLink: true,
      },
    });
  }
  async findAll() {
    return this.prismaService.user.findMany();
  }
  async create(input: CreateUserInput) {
    const { username, email, password } = input;

    const isUsernameExists = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (isUsernameExists) {
      throw new ConflictException("Username already exists");
    }
    const isEmailExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (isEmailExists) {
      throw new ConflictException("Email already exists");
    }
    const user = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: await hash(password),
        displayName: username,
        stream: {
          create: {
            title: `Стрим ${username}`,
          },
        },
      },
    });

    await this.verificationService.sendVerificationToken(user);

    return true;
  }

  async changeEmail(user: User, input: ChangeEmailInput) {
    const { email } = input;

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
      },
    });

    return true;
  }
  async changePassword(user: User, input: ChangePasswordInput) {
    const { oldPassword, newPassword } = input;

    const isValidPassword = await verify(user.password, oldPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный старый пароль");
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await hash(newPassword),
      },
    });

    return true;
  }
}
