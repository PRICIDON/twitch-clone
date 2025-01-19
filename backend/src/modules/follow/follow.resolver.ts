import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FollowService } from "./follow.service";
import { User } from "../../../prisma/generated";
import { Authorized } from "../../shared/decocators/authorized.decorator";
import { Authorization } from "../../shared/decocators/auth.decorator";
import { FollowModel } from "./models/follow.model";

@Resolver("Follow")
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Authorization()
  @Query(() => [FollowModel], { name: "findMyFollowers" })
  async findMyFollowers(@Authorized() user: User) {
    return this.followService.findMyFollowers(user);
  }
  @Authorization()
  @Query(() => [FollowModel], { name: "findMyFollowings" })
  async findMyFollowings(@Authorized() user: User) {
    return this.followService.findMyFollowings(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "followChannel" })
  async follow(@Authorized() user: User, @Args("channelId") channelId: string) {
    return this.followService.follow(user, channelId);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "unfollowChannel" })
  async unfollow(
    @Authorized() user: User,
    @Args("channelId") channelId: string,
  ) {
    return this.followService.unfollow(user, channelId);
  }
}
