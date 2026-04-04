import {z} from "zod";
import { BaseNotificationSchema } from "../notification.schema";

export const BaseNotificationRecipientSchema = z.object({
  id: z.coerce.string().min(1),
  id_penerima: z.coerce.string().min(1),
  id_notifikasi: z.coerce.string().min(1),
  is_read: z.number().min(0).max(1).default(0),
})

export const NotificationRecipientIdSchema = BaseNotificationRecipientSchema.shape.id;

export type BaseNotificationRecipient = z.infer<typeof BaseNotificationRecipientSchema>;