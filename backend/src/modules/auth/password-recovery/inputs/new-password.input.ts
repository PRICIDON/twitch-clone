import { Field, InputType } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  Validate,
} from "class-validator";
import { IsPasswordMatchingConstraintDecorator } from "../../../../shared/decocators/is-password-matching-constraint.decorator";

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Validate(IsPasswordMatchingConstraintDecorator)
  passwordRepeat: string;

  @Field(() => String)
  @IsUUID("4")
  @IsNotEmpty()
  token: string;
}
