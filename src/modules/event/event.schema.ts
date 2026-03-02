import { z } from "zod";

export const BaseEventSchema = z.object({
  id: z.string().min(1),
  akun_id: z.string().min(1),
  title: z.string().min(1),
  start: z.date().min(1),
  end: z.date().min(1),
});

export const AccountIdSchema = BaseEventSchema.shape.akun_id;

export const EventFormSchema = BaseEventSchema.omit({
  id: true,
}).extend({
  akun_id: z.string().optional(),
});

export const UpcomingEventSchema = BaseEventSchema.pick({
  title: true,
  start: true,
  end: true,
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type EventForm = z.infer<typeof EventFormSchema>;
export type AccountId = z.infer<typeof AccountIdSchema>;
export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;
