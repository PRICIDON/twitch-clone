import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import * as Upload from "graphql-upload/Upload.js";
import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import type { User } from "../../../../prisma/generated";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { FileValidationPipe } from "../../../shared/pipes/file-validation.pipe";
import { ChangeProfileInfoInput } from "./inputs/change-info.input";
import {
  SocialLinkInput,
  SocialLinkOrderInput,
} from "./inputs/social-link.input";
import { SocialLinkModel } from "./models/social-link.model";

@Resolver("Profile")
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}
  @Authorization()
  @Mutation(() => Boolean, { name: "changeProfileAvatar" })
  async changeAvatar(
    @Authorized() user: User,
    @Args("avatar", { type: () => GraphQLUpload }, FileValidationPipe)
    avatar: Upload,
  ) {
    return this.profileService.changeAvatar(user, avatar);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeProfileAvatar" })
  async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "changeProfileInfo" })
  async changeInfo(
    @Authorized() user: User,
    @Args("data") input: ChangeProfileInfoInput,
  ) {
    return this.profileService.changeInfo(user, input);
  }

  @Authorization()
  @Query(() => [SocialLinkModel], { name: "findSocialLinks" })
  async findSocialLinks(@Authorized() user: User) {
    return this.profileService.findSocialLinks(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "createSocialLink" })
  async createSocialLink(
    @Authorized() user: User,
    @Args("data") input: SocialLinkInput,
  ) {
    return this.profileService.createSocialLink(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "reorderSocialLink" })
  async reorderSocialLinks(
    @Authorized() user: User,
    @Args("list", { type: () => [SocialLinkOrderInput] })
    list: SocialLinkOrderInput[],
  ) {
    return this.profileService.reorderSocialLinks(list);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "updateSocialLink" })
  async updateSocialLink(
    @Args("id") id: string,
    @Args("data") input: SocialLinkInput,
  ) {
    return this.profileService.updateSocialLink(id, input);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "removeSocialLink" })
  async removeSocialLink(@Args("id") id: string) {
    return this.profileService.removeSocialLink(id);
  }
}
