import { Prisma, PrismaClient } from "../../../prisma/generated";
import { BadRequestException, Logger } from "@nestjs/common";
import { CATEGORIES } from "./data/categories.data";
import { USERNAMES } from "./data/users.data";
import { STREAMS } from "./data/streams.data";
import { hash } from "argon2";

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 5000,
    timeout: 100000,
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  },
});

async function main() {
  try {
    Logger.log("Начало заполнения в базой данных");
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.socialLink.deleteMany(),
      prisma.stream.deleteMany(),
      prisma.category.deleteMany(),
    ]);

    await prisma.category.createMany({
      data: CATEGORIES,
    });
    Logger.log("Категории успешно созданы");

    const categories = await prisma.category.findMany();
    const categoriesBySlug = Object.fromEntries(
      categories.map((category) => [category.slug, category]),
    );
    await prisma.$transaction(async (tx) => {
      for (const username of USERNAMES) {
        const randomCategory =
          categoriesBySlug[
            Object.keys(categoriesBySlug)[
              Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
            ]
          ];

        const userExists = await tx.user.findUnique({
          where: {
            username,
          },
        });
        if (!userExists) {
          const createdUser = await tx.user.create({
            data: {
              email: `${username}@pricidon.stream`,
              password: await hash("12345678"),
              username,
              displayName: username,
              avatar: `/channels/${username}.webp`,
              isEmailVerified: true,
              socialLink: {
                createMany: {
                  data: [
                    {
                      title: "Telegram",
                      url: `https://t.me/${username}`,
                      position: 1,
                    },
                    {
                      title: "YouTube",
                      url: `https://youtube.com/${username}`,
                      position: 2,
                    },
                  ],
                },
              },
              notificationsSettings: {
                create: {},
              },
            },
          });
          const randomTitles = STREAMS[randomCategory.slug];
          const randomTitle =
            randomTitles[Math.floor(Math.random() * randomTitles.length)];

          await tx.stream.create({
            data: {
              title: randomTitle,
              thumbnailUrl: `/streams/${createdUser.username}.webp`,
              user: {
                connect: {
                  id: createdUser.id,
                },
              },
              category: {
                connect: {
                  id: randomCategory.id,
                },
              },
            },
          });
          Logger.log(
            `Пользователь "${createdUser.username}" и его стрим успешно созданы`,
          );
        }
      }
    });
    Logger.log("Заполнение базы данных завершены успешно");
  } catch (e) {
    Logger.error(e);
    throw new BadRequestException("Ошибка при заполнении базы данных");
  } finally {
    Logger.log("Закрытие соединения с базой данных");
    await prisma.$disconnect();
    Logger.log("Соединение с базой данных успешно закрыто");
  }
}
main();
