import { Err } from "@/lib/err";
import { EventRepository } from "./event.repository";
import {
  AccountId,
  AccountIdSchema,
  EventForm,
  EventFormSchema,
  UpcomingEvent,
} from "./event.schema";
import { ZodError } from "zod";
import pool from "@/lib/db";

const isActive = (start: Date, end: Date) => {
  const now = new Date();
  if (now >= new Date(end) && now >= new Date(start)) {
    return true;
  }
  return now <= new Date(end) && now >= new Date(start);
};

export class EventService {
  constructor(private eventRepository: EventRepository) {}

  async getEventsByAccount(id: AccountId, date: Date) {
    if (!(date instanceof Date)) throw new Err("invalid request data", 400);

    try {
      AccountIdSchema.parse(id);

      const events = await this.eventRepository.getByAccount(id, date);

      return events;
    } catch (error: unknown) {
      console.error("EventService.getEventsByAccount error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("EventService unavailable", 500);
    }
  }

  async getUpcomingEvents(id: AccountId) {
    try {
      AccountIdSchema.parse(id);

      const events = await this.eventRepository.getUpcoming(id);

      let onGoing: UpcomingEvent[] = [],
        upcoming: UpcomingEvent[] = [];
      events.forEach((event) => {
        if (isActive(event.start, event.end)) {
          onGoing.push(event);
        } else {
          upcoming.push(event);
        }
      });

      return { onGoing, upcoming };
    } catch (error: unknown) {
      console.error("EventService.getUpcomingEvents error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("EventService unavailable", 500);
    }
  }

  async createEvent(data: EventForm) {
    let conn;
    try {
      EventFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.eventRepository.create(data, conn);

      await conn.commit();
      return { success: true, status: 201 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EventService.createEvent error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("EventService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async updateEvent(id: AccountId, data: EventForm) {
    let conn;
    try {
      EventFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.eventRepository.update(id, data, conn);

      await conn.commit();
      return { success: true, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EventService.updateEvent error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("EventService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async deleteEvent(id: AccountId) {
    let conn;
    try {
      AccountIdSchema.parse(id);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.eventRepository.delete(id, conn);

      await conn.commit();
      return { success: true, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EventService.deleteEvent error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("EventService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }
}
