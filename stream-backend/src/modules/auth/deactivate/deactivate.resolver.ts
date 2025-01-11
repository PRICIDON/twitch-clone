import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { DeactivateService } from "./deactivate.service";
import type { GqlContext } from "../../../shared/types/gql-context.types";
import { UserAgent } from "../../../shared/decocators/user-agent.decorator";
import { DeactivateAccountInput } from "./inputs/deactivate-account.input";
import { User } from "../../../../prisma/generated";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import { AuthModel } from "../account/models/auth.model";
import { Authorization } from "../../../shared/decocators/auth.decorator";

@Resolver("Deactivate")
export class DeactivateResolver {
  constructor(private readonly deactivateService: DeactivateService) {}

  @Authorization()
  @Mutation(() => AuthModel, { name: "deactivateAccount" })
  async deactivate(
    @Context() { req }: GqlContext,
    @Args("data") input: DeactivateAccountInput,
    @Authorized() user: User,
    @UserAgent() userAgent: string,
  ) {
    return this.deactivateService.deactivate(req, input, user, userAgent);
  }
}
