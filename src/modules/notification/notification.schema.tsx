import {z} from "zod";

export const BaseNotificationSchema = z.object({
  id: z.coerce.string().min(1),
  ref: z.string().min(1),
  tipe: z.string().min(1),
  judul: z.string().min(1),
  teks: z.string().min(1),
  level: z.int().min(1).max(3),
})

export const NotificationPopupSchema = BaseNotificationSchema.pick({
  judul: true,
  teks: true,
  level: true,
})

export type BaseNotification = z.infer<typeof BaseNotificationSchema>;
export type NotificationPopup = z.infer<typeof NotificationPopupSchema>;