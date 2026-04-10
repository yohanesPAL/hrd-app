import { ServiceRes } from "@/types/ServiceTypes";
import { BaseUser } from "../user/user.schema";
import { BaseNotification, BaseNotificationRecipient, NotificationForm, NotificationPopup, NotificationTable } from "./notification.schema";
import { Connection } from "mysql2/promise";

export interface INotificationRepository {
  getAllByUser(userId: BaseUser["id"]): Promise<NotificationTable[]>;
  getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]>;
  markedIsRead(idList: BaseNotificationRecipient["id"][]): Promise<boolean>;
  create(notificationForm: NotificationForm, conn: Connection): Promise<string>;
  createRecipient(recipientId: BaseUser["id"][], notificationId: BaseNotification["id"], conn: Connection): Promise<boolean>;
}

export interface INotificationService {
  getAllNotificationByUser(userId: BaseUser["id"]): Promise<ServiceRes<NotificationTable[]>>;
  getNotificationsPopup(userId: BaseUser["id"]): Promise<ServiceRes<NotificationPopup[]>>;
  markedNotificationRead(idList: BaseNotificationRecipient["id"][]): Promise<ServiceRes>;
  createNotification(notificationForm: NotificationForm, recipientId: BaseUser["id"][]): Promise<ServiceRes>;
}