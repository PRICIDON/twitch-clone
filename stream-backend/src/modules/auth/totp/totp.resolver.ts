import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TotpService } from "./totp.service";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import type { User } from "../../../../prisma/generated";
import { TotpModel } from "./models/totp.model";
import { EnableTotpInput } from "./inputs/enable-totp.input";
import { Authorization } from "../../../shared/decocators/auth.decorator";

@Resolver("Totp")
export class TotpResolver {
  constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Query(() => TotpModel, { name: "generateTotpSecret" })
  async generate(@Authorized() user: User) {
    return this.totpService.generate(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "enableTotp" })
  async enable(@Authorized() user: User, @Args("data") input: EnableTotpInput) {
    return this.totpService.enable(user, input);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "disableTotp" })
  async disable(@Authorized() user: User) {
    return this.totpService.disable(user);
  }
}
