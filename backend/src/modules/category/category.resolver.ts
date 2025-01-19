import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CategoryModel } from "./models/category.model";

@Resolver("Category")
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryModel], { name: "findAllCategories" })
  async findAll() {
    return await this.categoryService.findAll();
  }
  @Query(() => [CategoryModel], { name: "findRandomCategories" })
  async findRandom() {
    return await this.categoryService.findRandom();
  }
  @Query(() => [CategoryModel], { name: "findCategoryBySlug" })
  async findBySlug(@Args("slug") slug: string) {
    return await this.categoryService.findBySlug(slug);
  }
}
