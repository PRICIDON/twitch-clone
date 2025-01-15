import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Stream } from "../../../../prisma/generated";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;
  @Field(() => String, { nullable: true })
  thumbnailUrl: string;
  @Field(() => String, { nullable: true })
  ingressId: string;
  @Field(() => String, { nullable: true })
  serverUrl: string;
  @Field(() => String, { nullable: true })
  streamKey: string;
  @Field(() => Boolean)
  isLive: boolean;
  @Field(() => String)
  userId: string;
  @Field(() => UserModel)
  user: UserModel;

  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
