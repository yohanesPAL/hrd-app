"use server";
import { withAuth } from "@/lib/withAuth";
import { notificationService } from "@/modules/notification/notification.factory";
import { BaseNotificationRecipient } from "@/modules/notification/notification.schema";
import { BaseUser } from "@/modules/user/user.schema";

export const getNotificaionsByUser = withAuth(
  async (session, userId: BaseUser["id"]) => {
    return await notificationService.getAllNotificationByUser(userId);
  },
);

export const getNotificationsPopup = withAuth(
  async (session, userId: BaseUser["id"]) => {
    return await notificationService.getNotificationsPopup(userId);
  },
);

export const markedNotificationsRead = withAuth(
  async (session, notifIdList: BaseNotificationRecipient["id"][]) => {
    await notificationService.markedNotificationRead(notifIdList);
  },
);
