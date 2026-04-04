"use server";

import { withAuth } from "@/lib/withAuth";
import { createNotificationService } from "@/modules/notification/notification.factory";
import { BaseNotificationRecipient } from "@/modules/notification/recipients/notificaion.recipient.schema";

const notificationService = createNotificationService();

export const getNotificationsPopup = withAuth(async (session, recipientId: BaseNotificationRecipient["id_penerima"]) => {
  return await notificationService.getNotificationsPopup(recipientId);
})