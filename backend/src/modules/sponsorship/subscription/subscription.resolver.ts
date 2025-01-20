import { Query, Resolver } from "@nestjs/graphql";
import { SubscriptionService } from "./subscription.service";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { PlanModel } from "../plan/models/plan.model";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import { User } from "../../../../prisma/generated";
import { SubscriptionModel } from "./models/subscription.model";

@Resolver("Subscription")
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Authorization()
  @Query(() => [SubscriptionModel], { name: "findMySponsors" })
  async findMySponsors(@Authorized() user: User) {
    return this.subscriptionService.findMySponsors(user);
  }
}
