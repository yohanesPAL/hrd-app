"use server";
import { withAuth } from "@/lib/withAuth";
import { notificationService } from "@/modules/notification/notification.factory";
import { BaseNotificationRecipient } from "@/modules/notification/notification.schema";
import { BaseUser } from "@/modules/user/user.schema";
import { contractNotificationUseCase } from "@/use-cases/notificationFactory/notification.contract";

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

export const createContractNearExpirationNotification = withAuth(async () => {
  await contractNotificationUseCase.contractExpiration();
});
