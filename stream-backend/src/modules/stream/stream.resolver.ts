import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { StreamService } from "./stream.service";
import { StreamModel } from "./models/stream.model";
import { FiltersInput } from "./inputs/filters.input";
import { Authorized } from "../../shared/decocators/authorized.decorator";
import type { User } from "../../../prisma/generated";
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input";
import * as GraphQLUpload from "graphql-upload/GraphQLUpload";
import { FileValidationPipe } from "../../shared/pipes/file-validation.pipe";
import * as Upload from "graphql-upload/Upload";
import { Authorization } from "../../shared/decocators/auth.decorator";

@Resolver("Stream")
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}
  @Query(() => [StreamModel], { name: "findAllStreams" })
  async findAll(@Args("filters") input: FiltersInput) {
    return await this.streamService.findAll(input);
  }
  @Query(() => [StreamModel], { name: "findRandomStreams" })
  async findRandom() {
    return await this.streamService.findRandom();
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "changeStreamInfo" })
  async changeInfo(
    @Authorized() user: User,
    @Args("data") input: ChangeStreamInfoInput,
  ) {
    return this.streamService.changeInfo(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "changeStreamThumbnail" })
  async changeThumbnail(
    @Authorized() user: User,
    @Args("thumbnail", { type: () => GraphQLUpload }, FileValidationPipe)
    thumbnail: Upload,
  ) {
    return this.streamService.changeThumbnail(user, thumbnail);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeStreamThumbnail" })
  async removeThumbnail(@Authorized() user: User) {
    return this.streamService.removeThumbnail(user);
  }
}
