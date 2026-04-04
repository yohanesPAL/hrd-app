import pool from "@/lib/db";
import { BaseUser } from "../user/user.schema";
import { INotificationRepository } from "./notification.interface";
import { NotificationPopup, NotificationPopupSchema } from "./notification.schema";
import { Err } from "@/lib/err";

export class NotificationRepository implements INotificationRepository {
  async getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]> {
      try {
        const [rows] = await pool.query(
          `SELECT judul, teks, level FROM notifikasi n
           JOIN penerima_notifikasi pn ON (n.id = pn.id_notifikasi) AND pn.id_penerima = ? AND pn.is_read = 0`,
           [userId]
        )

        return NotificationPopupSchema.array().parse(rows);
      } catch (error) {
        console.error("NotificationRepository.getNotificationsPopup error:", error);

        if(error instanceof Error) throw new Err("invalid notification popup data", 400);

        throw new Err("failed to fetch notification popup", 500);
      }
  }
}