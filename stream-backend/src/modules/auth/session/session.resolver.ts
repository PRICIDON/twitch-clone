import { Context, Mutation, Resolver, Args, Query } from "@nestjs/graphql";
import { SessionService } from "./session.service";
import { UserModel } from "../account/models/user.module";
import { GqlContext } from "../../../shared/types/gql-context.types";
import { LoginInput } from "./inputs/login.input";
import { UserAgent } from "../../../shared/decocators/user-agent.decorator";
import { Authorization } from "../../../shared/decocators/auth.decorator";
import { SessionModel } from "./models/session.model";

@Resolver("Session")
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], { name: "findSessionsByUser" })
  async findByUser(@Context() { req }: GqlContext) {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => [SessionModel], { name: "findCurrentSession" })
  async findCurrent(@Context() { req }: GqlContext) {
    return this.sessionService.findCurrentUser(req);
  }

  @Mutation(() => UserModel, { name: "loginUser" })
  async login(
    @Context() { req }: GqlContext,
    @Args("data") input: LoginInput,
    @UserAgent() userAgent: string,
  ) {
    return this.sessionService.login(req, input, userAgent);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: "logoutUser" })
  async logout(@Context() { req }: GqlContext) {
    return this.sessionService.logout(req);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "removeSession" })
  async remove(@Context() { req }: GqlContext, @Args("id") id: string) {
    return this.sessionService.remove(req, id);
  }

  @Mutation(() => Boolean, { name: "clearSessionCookie" })
  async clearSession(@Context() { req }: GqlContext) {
    return this.sessionService.clearSession(req);
  }
}
