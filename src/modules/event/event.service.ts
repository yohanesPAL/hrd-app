import { Err } from "@/lib/err";
import { EventRepository } from "./event.repository"
import { UpcomingEvent, UpcomingEventSchema } from "./event.schema"

const isActive = (start: Date, end: Date) => {
  const now = new Date();
  if (now >= new Date(end) && now >= new Date(start)) {
    return true;
  };
  return now <= new Date(end) && now >= new Date(start);
}

export const EventService = {
  async upcomingEvent(account_id: string) {
    const res = await EventRepository.getUpcomingEvent(
      account_id,
    );

    const validation = UpcomingEventSchema.array().safeParse(res);
    if (!validation.success) {
      console.error("validasi gagal: ", validation.error);
      throw new Err("internal server error", 500);
    }

    let onGoing: UpcomingEvent[] = [], upcoming: UpcomingEvent[] = []
    const events = validation.data;
    events.forEach(event => {
      if (isActive(event.start, event.end)) {
        onGoing.push(event);
      } else {
        upcoming.push(event);
      }
    })

    return {onGoing, upcoming};
  }
}