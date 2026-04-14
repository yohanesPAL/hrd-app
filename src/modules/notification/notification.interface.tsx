import { ServiceRes } from "@/types/ServiceTypes";
import { BaseUser } from "../user/user.schema";
import { BaseNotification, BaseNotificationRecipient, NotificationForm, NotificationPopup, NotificationTable } from "./notification.schema";
import { Connection } from "mysql2/promise";

export interface INotificationRepository {
  getAllByUser(userId: BaseUser["id"]): Promise<NotificationTable[]>;
  getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]>;
  getNewlyCreated(notificationType: BaseNotification["tipe"], conn: Connection): Promise<BaseNotification["id"][]>;
  markedIsRead(idList: BaseNotificationRecipient["id"][]): Promise<boolean>;
  create(notificationForm: NotificationForm[], conn: Connection): Promise<string[]>;
  createRecipient(recipientIds: BaseUser["id"][], notificationIds: BaseNotification["id"][], conn: Connection): Promise<boolean>;
}

export interface INotificationService {
  getAllNotificationByUser(userId: BaseUser["id"]): Promise<ServiceRes<NotificationTable[]>>;
  getNotificationsPopup(userId: BaseUser["id"]): Promise<ServiceRes<NotificationPopup[]>>;
  getNewlyCreatedNotification(notificationType: BaseNotification["tipe"], conn: Connection): Promise<ServiceRes<BaseNotification["id"][]>>
  markedNotificationRead(idList: BaseNotificationRecipient["id"][]): Promise<ServiceRes>;
  createNotification(notificationForms: NotificationForm[], conn: Connection): Promise<ServiceRes<string[]>>;
  createNotificationRecipient(recipientIds: BaseUser["id"][], notificationIds: BaseNotification["id"][], conn: Connection): Promise<ServiceRes>;
}