import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import type { User } from "../../../../prisma/generated";

import { EnableTotpInput } from "./inputs/enable-totp.input";
import { TotpModel } from "./models/totp.model";
import { TotpService } from "./totp.service";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { Authorized } from "../../../shared/decocators/authorized.decorator";

@Resolver("Totp")
export class TotpResolver {
  public constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Query(() => TotpModel, { name: "generateTotpSecret" })
  public async generate(@Authorized() user: User) {
    return this.totpService.generate(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "enableTotp" })
  public async enable(
    @Authorized() user: User,
    @Args("data") input: EnableTotpInput,
  ) {
    return this.totpService.enable(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "disableTotp" })
  public async disable(@Authorized() user: User) {
    return this.totpService.disable(user);
  }
}
