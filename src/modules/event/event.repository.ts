import pool from "@/lib/db";
import {
  AccountId,  
  BaseEvent,  
  BaseEventSchema,  
  EventForm,
  UpcomingEvent,
  UpcomingEventSchema,
} from "./event.schema";
import { RowDataPacket } from "mysql2";
import { IEventRepository } from "./event.interface";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";

export class EventRepository implements IEventRepository {
  async getByAccount(id: AccountId, date: Date): Promise<BaseEvent[]> {
    const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 2, 1);

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT CAST(id AS CHAR) AS id, CAST(akun_id AS CHAR) AS akun_id, title, start, end FROM acara
            WHERE akun_id = ? AND start < ? AND end >= ?`,
        [id, endDate, startDate],
      );

      return BaseEventSchema.array().parse(rows);
    } catch (error: unknown) {
      console.error("EventRepository.getByAccount error:", error);

      if (error instanceof ZodError) throw new Err("invalid event data", 400);

      throw new Err("failed to fetch event", 400);
    }
  }

  async getUpcoming(id: AccountId): Promise<UpcomingEvent[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT title, start, end FROM acara 
        WHERE akun_id = ? AND end >= ? 
        ORDER BY end ASC LIMIT 6`,
        [id, new Date()],
      );

      return UpcomingEventSchema.array().parse(rows);
    } catch (error: unknown) {
      console.error("EventRepository.getUpcoming error:", error);

      if (error instanceof ZodError) throw new Err("invalid event data", 400);

      throw new Err("failed to fetch event", 500);
    }
  }

  async create(data: EventForm, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(
        `INSERT INTO acara (akun_id, title, start, end)
            VALUES (?, ?, ?, ?)`,
        [data.akun_id, data.title, data.start, data.end],
      );

      return true;
    } catch (error: unknown) {
      console.error("EventRepository.create error:", error);

      throw new Err("failed to create event", 500);
    }
  }

  async update(
    id: AccountId,
    data: EventForm,
    conn: Connection,
  ): Promise<boolean> {
    try {
      const [res] = await conn.query(
        `UPDATE acara SET title = ?, start = ?, end = ? WHERE id = ?`,
        [data.title, data.start, data.end, id],
      );

      return true;
    } catch (error: unknown) {
      console.error("EventRepository.update error:", error);

      throw new Err("failed to update event", 500);
    }
  }

  async delete(id: AccountId, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query("DELETE FROM acara WHERE id = ?", [id]);

      return true;
    } catch (error: unknown) {
      console.error("EventRepository.delete error:", error);

      throw new Err("failed to delete event", 500);
    }
  }
}
