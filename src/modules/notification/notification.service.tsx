import { Err } from "@/lib/err";
import { BaseUser, UserIdSchema } from "../user/user.schema";
import { INotificationService } from "./notification.interface";
import { BaseNotificationRecipient, BaseNotificationRecipientIdSchema, NotificationForm, NotificationFormSchmea, NotificationPopup, NotificationTable } from "./notification.schema";
import { ZodError } from "zod";
import { ServiceRes } from "@/types/ServiceTypes";
import pool from "@/lib/db";
import { NotificationRepository } from "./notification.repository";

export class NotificationService implements INotificationService {
  constructor(private notificationRepository: NotificationRepository) { }

  async getAllNotificationByUser(userId: BaseUser["id"]): Promise<ServiceRes<NotificationTable[]>> {
    try {
      const valId = UserIdSchema.parse(userId);

      const res = await this.notificationRepository.getAllByUser(valId);

      return {success: true, status: 200, data: res}
    } catch (error) {
      console.error("NotificationService.getAllNotificationByUser error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("NotificationService unavailable", 500);
    }
  }

  async getNotificationsPopup(userId: BaseUser["id"]): Promise<ServiceRes<NotificationPopup[]>> {
    try {
      const valId = UserIdSchema.parse(userId);

      const res = await this.notificationRepository.getNotificationsPopup(valId)

      return {success: true, status: 200, data: res};
    } catch (error) {
      console.error("NotificationService.getNotificatiosPopup error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid user id", 400);

      throw new Err("NotificationService unavailable", 500);
    }
  }

  async markedNotificationRead(idList: BaseNotificationRecipient["id"][]): Promise<ServiceRes> {
    try {
      const valIdList = BaseNotificationRecipientIdSchema.array().parse(idList);

      await this.notificationRepository.markedIsRead(valIdList);

      return { success: true, status: 200 }
    } catch (error) {
      console.error("NotificationService.markedNotificationRead error:", error);

      if (error instanceof Err) throw error;

      throw new Err("failed to mark notification read")
    }
  }

  async createNotification(notificationForm: NotificationForm, recipientId: BaseUser["id"][]): Promise<ServiceRes> {
    let conn;
    try {
      const validatedNotificationForm = NotificationFormSchmea.parse(notificationForm);
      const validatedRecipientId = UserIdSchema.array().parse(recipientId);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const notifId = await this.notificationRepository.create(validatedNotificationForm, conn);
      await this.notificationRepository.createRecipient(validatedRecipientId, notifId, conn);

      return {success: true, status: 201};
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("NotificationService.createNotification error:", error);

      if(error instanceof Err) throw error;
      if(error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("NotificationService.createNotification unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }
}