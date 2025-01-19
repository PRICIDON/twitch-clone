import { Args, Mutation, Resolver } from "@nestjs/graphql";
import type { IngressInput } from "livekit-server-sdk";

import { IngressService } from "./ingress.service";
import type { User } from "../../../../prisma/generated";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { Authorized } from "../../../shared/decocators/authorized.decorator";

@Resolver("Ingress")
export class IngressResolver {
  public constructor(private readonly ingressService: IngressService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: "createIngress" })
  public async create(
    @Authorized() user: User,
    @Args("ingressType") ingressType: IngressInput,
  ) {
    return this.ingressService.create(user, ingressType);
  }
}
