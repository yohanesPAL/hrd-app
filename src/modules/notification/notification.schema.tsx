import { z } from "zod";

export const BaseNotificationSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  ref: z.string().min(1),
  ref_table: z.string().min(1),
  tipe: z.string().min(1),
  judul: z.string().min(1),
  teks: z.string().min(1),
  level: z.int().min(1).max(3),
}).strict();

export const BaseNotificationIdSchema = BaseNotificationSchema.shape.id

export const BaseNotificationRecipientSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  id_penerima: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  id_notifikasi: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  is_read: z.number().min(0).max(1),
}).strict();

export const NotificationPopupSchema = BaseNotificationSchema.pick({
  judul: true,
  teks: true,
  level: true,
}).extend({
  notif_id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
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