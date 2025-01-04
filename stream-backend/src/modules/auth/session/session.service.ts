import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { LoginInput } from "./inputs/login.input";
import type { Request } from "express";
import { verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { getSessionMetadata } from "../../../shared/utils/session-metadata.utils";
import { RedisService } from "../../../core/redis/redis.service";

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException("Пользователь не обнаружен в сессии");
    }

    const keys = await this.redisService.keys("*");
    const userSessions = [];
    for (const key of keys) {
      const sessionData = await this.redisService.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(":")[1],
          });
        }
      }
    }
    userSessions.sort((a, b) => b.createdAt - a.createdAt);
    return userSessions.filter((session) => session.id !== req.session.id);
  }

  async findCurrentUser(req: Request) {
    const sessionId = req.session.userId;

    const sessionData = await this.redisService.get(
      `${this.configService.getOrThrow<string>("SESSION_FOLDER")}${sessionId}`,
    );

    const session = JSON.parse(sessionData);

    return {
      ...session,
      id: sessionId,
    };
  }
  async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password } = input;
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль");
    }

    const metadata = getSessionMetadata(req, userAgent);
    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;
      req.session.metadata = metadata;
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException("Не удалось сохранить сессию"),
          );
        }
        resolve(user);
      });
    });
  }
  async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException("Не удалось завершить сессию"),
          );
        }
        req.res.clearCookie(
          this.configService.getOrThrow<string>("SESSION_NAME"),
        );
        resolve(true);
      });
    });
  }

  async clearSession(req: Request) {
    req.res.clearCookie(this.configService.getOrThrow("SESSION_NAME"));
    return true;
  }
  async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException("Текущую сессию удалить нельзя");
    }
    await this.redisService.del(
      `${this.configService.getOrThrow<string>("SESSION_FOLDER")}${id}`,
    );
    return true;
  }
}
