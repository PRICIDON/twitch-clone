import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../../../../prisma/generated";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "../../../stream/models/stream.model";

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  username: string;
  @Field(() => String)
  displayName: string;
  @Field(() => String, { nullable: true })
  avatar: string;
  @Field(() => String, { nullable: true })
  bio: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => Boolean)
  isEmailVerified: boolean;

  @Field(() => Boolean)
  isDeactivated: boolean;
  @Field(() => Date)
  deactivatedAt: Date;

  @Field(() => [SocialLinkModel])
  socialLinks: SocialLinkModel[];
  @Field(() => StreamModel)
  stream: StreamModel;

  @Field(() => Boolean)
  isTotpEnabled: boolean;
  @Field(() => String, { nullable: true })
  totpSecret: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
