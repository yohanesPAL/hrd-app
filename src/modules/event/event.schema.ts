import { z } from "zod";

const BaseEventSchema = z.object({
  id: z.string().min(1),
  akun_id: z.string().min(1),
  title: z.string().min(1),
  start: z.date().min(1),
  end: z.date().min(1),
});

export const PatchEventSchema = BaseEventSchema.extend({
  start: z.string().min(1),
  end: z.string().min(1),
});

export const PostEventSchema = PatchEventSchema.omit({
  id: true,
})

export const UpcomingEventSchema = BaseEventSchema.pick({
  title: true,
  start: true,
  end: true,
})

export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type PostEvent = z.infer<typeof PostEventSchema>;
export type PatchEvent = z.infer<typeof PatchEventSchema>;
export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;
export type Event = Omit<BaseEvent, "akun_id">;
