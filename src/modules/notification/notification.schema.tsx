import { z } from "zod";

export const BaseNotificationSchema = z.object({
  id: z.coerce.string().min(1),
  ref: z.string().min(1),
  ref_table: z.string().min(1),
  tipe: z.string().min(1),
  judul: z.string().min(1),
  teks: z.string().min(1),
  level: z.int().min(1).max(3),
}).strict();

export const BaseNotificationIdSchema = BaseNotificationSchema.shape.id

export const BaseNotificationRecipientSchema = z.object({
  id: z.coerce.string().min(1),
  id_penerima: z.coerce.string().min(1),
  id_notifikasi: z.coerce.string().min(1),
  is_read: z.number().min(0).max(1),
}).strict();

export const NotificationPopupSchema = BaseNotificationSchema.pick({
  judul: true,
  teks: true,
  level: true,
}).extend({
  notif_id: z.coerce.string().min(1),
  created_at: z.date(),
})

export const NotificationTableSchema = NotificationPopupSchema.extend({
  no: z.number().nonnegative(),
  tipe: z.string().min(1),
})

export const NotificationFormSchema = BaseNotificationSchema.omit({
  id: true,
})

export type BaseNotification = z.infer<typeof BaseNotificationSchema>;
export type BaseNotificationRecipient = z.infer<typeof BaseNotificationRecipientSchema>
export type NotificationPopup = z.infer<typeof NotificationPopupSchema>;
export type NotificationTable = z.infer<typeof NotificationTableSchema>;
export type NotificationForm = z.infer<typeof NotificationFormSchema>