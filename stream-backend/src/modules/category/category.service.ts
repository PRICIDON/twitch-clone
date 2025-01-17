import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const categories = await this.prismaService.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        streams: {
          include: {
            category: true,
            user: true,
          },
        },
      },
    });
    return categories;
  }

  async findRandom() {
    const total = await this.prismaService.category.count();

    const randomIndexes = new Set<number>();

    while (randomIndexes.size < 7) {
      const randomIndex = Math.floor(Math.random() * total);

      randomIndexes.add(randomIndex);
    }

    const categories = await this.prismaService.category.findMany({
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
      take: total,
      skip: 0,
    });

    return Array.from(randomIndexes).map((index) => categories[index]);
  }

  async findBySlug(slug: string) {
    const categories = await this.prismaService.category.findMany({
      where: {
        slug,
      },
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });

    if (!categories) {
      throw new NotFoundException("Category not found");
    }

    return categories;
  }
}
