import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlanService } from "./plan.service";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { User } from "../../../../prisma/generated";
import { PlanModel } from "./models/plan.model";
import { CreatePlanInput } from "./inputs/create-plan.input";

@Resolver("Plan")
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}

  @Authorization()
  @Query(() => [PlanModel], { name: "findMySponsorshipPlans" })
  async findMyPlans(@Authorized() user: User) {
    return this.planService.findMyPlans(user);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "createSponsorshipPlan" })
  async create(@Authorized() user: User, @Args("data") input: CreatePlanInput) {
    return this.planService.create(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeSponsorshipPlan" })
  async remove(@Args("planId") planId: string) {
    return this.planService.remove(planId);
  }
}
