import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AccountService } from "./account.service";
import { UserModel } from "./models/user.model";
import { CreateUserInput } from "./inputs/create-user.input";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { ChangePasswordInput } from "./inputs/change-password.input";
import { ChangeEmailInput } from "./inputs/change-email.input";
import { User } from "../../../../prisma/generated";

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

  @Authorization()
  @Mutation(() => Boolean, { name: "changePassword" })
  public async changePassword(
    @Authorized() user: User,
    @Args("data") input: ChangePasswordInput,
  ) {
    return this.accountService.changePassword(user, input);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "changeEmail" })
  async changeEmail(
    @Authorized() user: User,
    @Args("data") input: ChangeEmailInput,
  ) {
    return this.accountService.changeEmail(user, input);
  }
}
