import { TransationStatus, type Transaction } from "prisma/generated";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { UserModel } from "../../../auth/account/models/user.model";

registerEnumType(TransationStatus, {
  name: "TransationStatus",
});

@ObjectType()
export class TransactionModel implements Transaction {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  amount: number;
  @Field(() => String)
  currency: string;
  @Field(() => String)
  stripeSubscriptionId: string;
  @Field(() => TransationStatus)
  status: TransationStatus;
  @Field(() => String)
  userId: string;
  @Field(() => UserModel)
  user: UserModel;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
