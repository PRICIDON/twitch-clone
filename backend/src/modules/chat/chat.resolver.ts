import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { PubSub } from "graphql-subscriptions";
import { ChatMessageModel } from "./models/chat-message.model";
import { Authorized } from "../../shared/decocators/authorized.decorator";
import type { User } from "../../../prisma/generated";
import { ChangeChatSettingsInput } from "./inputs/change-chat-settings.input";
import { Authorization } from "../../shared/decocators/auth.decorator";
import { SendMessageInput } from "./inputs/send-message.input";

@Resolver("Chat")
export class ChatResolver {
  private readonly pubSub: PubSub;

  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }
  @Query(() => [ChatMessageModel], { name: "findChatMessagesByStream" })
  async findByStream(@Args("streamId") streamId: string) {
    return await this.chatService.findByStream(streamId);
  }

  @Authorization()
  @Mutation(() => ChatMessageModel, { name: "sendChatMessage" })
  async sendMessage(
    @Authorized("id") userId: string,
    @Args("data") input: SendMessageInput,
  ) {
    const message = await this.chatService.sendMessage(userId, input);
    await this.pubSub.publish("CHAT_MESSAGE_ADDED", {
      chatMessageAdded: message,
    });
    return message;
  }

  @Subscription(() => ChatMessageModel, {
    name: "chatMessageAdded",
    filter: (payload, variables) =>
      payload.chatMessageAdded.streamId === variables.streamId,
  })
  chatMessageAdded(@Args("streamId") streamId: string) {
    return this.pubSub.asyncIterableIterator("CHAT_MESSAGE_ADDED");
  }

  @Authorization()
  @Mutation(() => Boolean, { name: "changeChatSettings" })
  async changeSettings(
    @Authorized() user: User,
    @Args("data") input: ChangeChatSettingsInput,
  ) {
    return this.chatService.changeSettings(user, input);
  }
}
