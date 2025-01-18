import { Args, Query, Resolver } from "@nestjs/graphql";
import { ChannelService } from "./channel.service";
import { UserModel } from "../auth/account/models/user.model";

@Resolver("Channel")
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [UserModel], { name: "findRecommendedChannel" })
  async findRecommendedChannel() {
    return this.channelService.findRecommendedChannel();
  }

  @Query(() => UserModel, { name: "findByUsername" })
  async findByUsername(@Args("username") username: string) {
    return this.channelService.findByUsername(username);
  }

  @Query(() => Number, { name: "findFollowersCountByChannel" })
  async findFollowersCountByChannel(@Args("channelId") channelId: string) {
    return this.channelService.findFollowersCountByChannel(channelId);
  }
}
