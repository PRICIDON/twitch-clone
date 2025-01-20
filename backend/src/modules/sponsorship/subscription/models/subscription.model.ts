import { SponsorshipSubscription } from "prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../../auth/account/models/user.model";
import { PlanModel } from "../../plan/models/plan.model";

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  expiresAt: Date;

  @Field(() => String)
  channelId: string;
  @Field(() => UserModel)
  channel: UserModel;
  @Field(() => String)
  planId: string;
  @Field(() => PlanModel)
  plan: PlanModel;
  @Field(() => String)
  userId: string;
  @Field(() => UserModel)
  user: UserModel;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
