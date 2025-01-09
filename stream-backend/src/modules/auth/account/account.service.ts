import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { CreateUserInput } from "./inputs/create-user.input";
import { hash } from "argon2";
import { VerificationService } from "../verification/verification.service";

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  async me(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
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
      },
    });

    await this.verificationService.sendVerificationToken(user);

    return true;
  }
}
