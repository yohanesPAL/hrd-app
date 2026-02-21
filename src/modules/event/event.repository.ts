import pool from "@/lib/db";
import { UpcomingEvent, UpcomingEventSchema } from "./event.schema";
import { RowDataPacket } from "mysql2";

export const EventRepository = {
  async getUpcomingEvent(accountId: string): Promise<UpcomingEvent[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT title, start, end FROM acara 
        WHERE akun_id = ? AND end >= ? 
        ORDER BY end ASC LIMIT 6`,
      [accountId, new Date()]
    )

    return rows as UpcomingEvent[];
  }
}