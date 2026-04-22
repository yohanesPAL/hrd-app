import pool from "@/lib/db";
import { BaseUser } from "../user/user.schema";
import { INotificationRepository } from "./notification.interface";
import { BaseNotification, BaseNotificationIdSchema, BaseNotificationRecipient, NotificationForm, NotificationPopup, NotificationPopupSchema, NotificationTable, NotificationTableSchema } from "./notification.schema";
import { Err } from "@/lib/err";
import { ZodError } from "zod";
import { NotificationMapper } from "./notification.mapper";
import { Connection, ResultSetHeader } from "mysql2/promise";

export class NotificationRepository implements INotificationRepository {
  async getAllByUser(userId: BaseUser["id"]): Promise<NotificationTable[]> {
    try {
      const [rows]: any[] = await pool.query(
        `SELECT pn.id AS notif_id, tipe, judul, teks, level, pn.created_at FROM notifikasi n
           JOIN penerima_notifikasi pn ON (n.id = pn.id_notifikasi) AND pn.id_penerima = ?
           ORDER BY pn.id DESC`,
        [userId]
      );

      return NotificationMapper.toTableRows(rows);
    } catch (error) {
      console.error("NotificationRepository.getAllByUser error", error);

      if (error instanceof ZodError) throw new Err("invalid notifications data", 400);

      throw new Err("failed to fetch notification", 500);
    }
  }
  async getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]> {
    try {
      const [rows] = await pool.query(
        `SELECT pn.id AS notif_id, judul, teks, level, pn.created_at FROM notifikasi n
           JOIN penerima_notifikasi pn ON (n.id = pn.id_notifikasi) AND pn.id_penerima = ? AND pn.is_read = 0`,
        [userId]
      )

      return NotificationPopupSchema.array().parse(rows);
    } catch (error) {
      console.error("NotificationRepository.getNotificationsPopup error:", error);

      if (error instanceof ZodError) throw new Err("invalid notification popup data", 400);

      throw new Err("failed to fetch notification popup", 500);
    }
  }

  async markedIsRead(idList: BaseNotificationRecipient["id"][]): Promise<boolean> {
    try {
      const placeholder = idList.map(item => '?').join(",")

      const query = `UPDATE penerima_notifikasi SET is_read = 1 WHERE id IN (${placeholder})`
      await pool.query(query, idList)

      return true;
    } catch (error) {
      console.error("NotificationRepository.markedIsRead error:", error);

      throw new Err("failed to marked is read", 500)
    }
  }

  async create(notificationForm: NotificationForm[], conn: Connection): Promise<string[]> {
    try {
      const args = notificationForm.map(item => {
        return [
          item.ref,
          item.ref_table,
          item.tipe,
          item.judul,
          item.teks,
          item.level,
        ]
      })

      const [res] = await conn.query<ResultSetHeader>(`INSERT INTO notifikasi (ref, ref_table, tipe, judul, teks, level) VALUES ?`, [args]);

      const firstId = res.insertId;
      const count = res.affectedRows;

      const ids = Array.from({ length: count }, (_, i) => String(firstId + i));

      return ids;
    } catch (error) {
      console.error("NotificationRepository.create error:", error);

      throw new Err("failed to create notification", 500);
    }
  }

  async createRecipient(recipientIds: BaseUser["id"][], notificationIds: BaseNotification["id"][], conn: Connection): Promise<boolean> {
    try {
      let notificationPlaceholder: string[] = [], recipientPlaceholder: string[] = [], args: any[] = [];
      notificationIds.forEach(id => {
        notificationPlaceholder.push("?");
        args.push(id);
      })

      recipientIds.forEach(id => {
        recipientPlaceholder.push("?");
        args.push(id);
      })

      const sql = `
      INSERT INTO penerima_notifikasi (id_penerima, id_notifikasi) 
        SELECT u.id, n.id FROM akun u
        JOIN notifikasi n ON n.id IN (${notificationPlaceholder.join(",")})
        WHERE u.id IN (${recipientPlaceholder.join(",")})`
      await conn.query(sql, args);

      return true;
    } catch (error) {
      console.error("NotificationRepository.createRecipient error:", error);

      throw new Err("failed to create notification recipient", 500)
    }
  }
}