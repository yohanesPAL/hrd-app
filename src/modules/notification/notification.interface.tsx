import { BaseUser } from "../user/user.schema";
import { NotificationPopup } from "./notification.schema";

export interface INotificationRepository {
  getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]>;
}

export interface INotificationService {
  getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]>;
}