import { Err } from "@/lib/err";
import { EventRepository } from "./event.repository";
import {
  AccountId,
  AccountIdSchema,
  BaseEvent,
  EventForm,
  EventFormSchema,
  UpcomingEvent,
} from "./event.schema";
import { ZodError } from "zod";
import { IEventService } from "./event.interface";
import { ServiceRes } from "@/types/ServiceTypes";

const isActive = (start: Date, end: Date) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now >= endDate && now >= startDate) {
    return true;
  }
  return now <= endDate && now >= startDate;
};

export class EventService implements IEventService {
  constructor(private eventRepository: EventRepository) {}

  async getEventsByAccount(
    id: AccountId,
    date: Date,
  ): Promise<ServiceRes<BaseEvent[]>> {
    if (!(date instanceof Date)) throw new Err("invalid request data", 400);

    try {
      const validatedId = AccountIdSchema.parse(id);

      const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 2, 1);

      const res = await this.eventRepository.getByAccount(validatedId, startDate, endDate);

      return { success: true, status: 200, data: res };
    } catch (error: unknown) {
      console.error("EventService.getEventsByAccount error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("EventService unavailable", 500);
    }
  }

  async getUpcomingEvents(id: AccountId): Promise<ServiceRes<{onGoing: UpcomingEvent[], upcoming: UpcomingEvent[]}>> {
    try {
      const validatedId = AccountIdSchema.parse(id);

      const events = await this.eventRepository.getUpcoming(validatedId);

      let onGoing: UpcomingEvent[] = [],
        upcoming: UpcomingEvent[] = [];
      events.forEach((event) => {
        if (isActive(event.start, event.end)) {
          onGoing.push(event);
        } else {
          upcoming.push(event);
        }
      });

      return { success: true, status: 200, data: { onGoing, upcoming } };
    } catch (error: unknown) {
      console.error("EventService.getUpcomingEvents error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("EventService unavailable", 500);
    }
  }

  async createEvent(data: EventForm): Promise<ServiceRes> {
    try {
      const validated = EventFormSchema.parse(data);

      await this.eventRepository.create(validated);

      return { success: true, status: 201 };
    } catch (error: unknown) {
      console.error("EventService.createEvent error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("EventService unavailable", 500);
    }
  }

  async updateEvent(id: AccountId, data: EventForm): Promise<ServiceRes> {
    try {
      const validated = EventFormSchema.parse(data);

      await this.eventRepository.update(id, validated);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("EventService.updateEvent error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("EventService unavailable", 500);
    }
  }

  async deleteEvent(id: AccountId): Promise<ServiceRes> {
    try {
      const validated = AccountIdSchema.parse(id);

      await this.eventRepository.delete(validated);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("EventService.deleteEvent error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("EventService unavailable", 500);
    }
  }
}
