import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AccountService } from "./account.service";
import { UserModel } from "./models/user.module";
import { CreateUserInput } from "./inputs/create-user.input";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import { Authorization } from "../../../shared/decocators/auth.decorator";

@Resolver("Account")
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, { name: "findProfile" })
  async me(@Authorized("id") id: string) {
    return this.accountService.me(id);
  }
  @Mutation(() => Boolean, { name: "createUser" })
  async create(@Args("data") input: CreateUserInput) {
    return this.accountService.create(input);
  }
}
