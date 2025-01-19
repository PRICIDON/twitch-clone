import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {NotificationService} from './notification.service';
import type {User} from 'prisma/generated';
import {ChangeNotificationsSettingsInput} from "./inputs/change-settings.input";
import {Authorization} from "../../shared/decocators/auth.decorator";
import {NotificationModel} from "./models/notification.model";
import {ChangeNotificationsSettingsResponse} from "./models/notification-settings.model";
import {Authorized} from "../../shared/decocators/authorized.decorator";


@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {
  }

  @Authorization()
  @Query(() => Number, {name: "findNotificationsUnreadCount"})
  async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user)
  }

  @Authorization()
  @Query(() => [NotificationModel], {name: "findNotificationsByUser"})
  async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user)
  }

  @Authorization()
  @Mutation(() => ChangeNotificationsSettingsResponse, {name: "changeNotificationSettings"})
  async changeSettings(@Authorized() user: User, @Args('data') input: ChangeNotificationsSettingsInput) {
    return this.notificationService.changeSettings(user, input)
  }
}
