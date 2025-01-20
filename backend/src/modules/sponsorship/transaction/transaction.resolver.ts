import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransactionService } from "./transaction.service";
import { User } from "../../../../prisma/generated";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { Authorized } from "../../../shared/decocators/authorized.decorator";
import { TransactionModel } from "./models/transaction.model";
import { MakePaymentModel } from "./models/make-payment.model";

@Resolver("Transaction")
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Authorization()
  @Query(() => [TransactionModel], { name: "findMyTransactions" })
  async findMyTransactions(@Authorized() user: User) {
    return this.transactionService.findMyTransactions(user);
  }

  @Authorization()
  @Mutation(() => MakePaymentModel, { name: "makePayment" })
  async makePayment(@Authorized() user: User, @Args("planId") planId: string) {
    return this.transactionService.makePayment(user, planId);
  }
}
