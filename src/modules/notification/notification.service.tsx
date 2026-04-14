import { Err } from "@/lib/err";
import { BaseUser, UserIdSchema } from "../user/user.schema";
import { INotificationService } from "./notification.interface";
import { BaseNotification, BaseNotificationRecipient, BaseNotificationIdSchema, NotificationForm, NotificationFormSchema, NotificationPopup, NotificationTable } from "./notification.schema";
import { ZodError } from "zod";
import { ServiceRes } from "@/types/ServiceTypes";
import pool from "@/lib/db";
import { NotificationRepository } from "./notification.repository";
import { Connection } from "mysql2/promise";

export class NotificationService implements INotificationService {
  constructor(private notificationRepository: NotificationRepository) { }

  async getAllNotificationByUser(userId: BaseUser["id"]): Promise<ServiceRes<NotificationTable[]>> {
    try {
      const valId = UserIdSchema.parse(userId);

      const res = await this.notificationRepository.getAllByUser(valId);

      return { success: true, status: 200, data: res }
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

      return { success: true, status: 200, data: res };
    } catch (error) {
      console.error("NotificationService.getNotificatiosPopup error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid user id", 400);

      throw new Err("NotificationService unavailable", 500);
    }
  }

  async getNewlyCreatedNotification(notificationType: BaseNotification["tipe"], conn: Connection): Promise<ServiceRes<BaseNotification["id"][]>> {
    if (typeof notificationType !== "string" || !notificationType) throw new Err("invalid request data", 400);
    try {
      const res = await this.notificationRepository.getNewlyCreated(notificationType, conn);

      return { success: true, status: 200, data: res }
    } catch (error) {
      console.error("NotificationService.getNewlyCreatedNotification error:", error);

      if (error instanceof Err) throw error

      throw new Err("internal server error", 500);
    }
  }

  async markedNotificationRead(idList: BaseNotificationRecipient["id"][]): Promise<ServiceRes> {
    try {
      const valIdList = BaseNotificationIdSchema.array().parse(idList);

      await this.notificationRepository.markedIsRead(valIdList);

      return { success: true, status: 200 }
    } catch (error) {
      console.error("NotificationService.markedNotificationRead error:", error);

      if (error instanceof Err) throw error;

      throw new Err("failed to mark notification read")
    }
  }

  async createNotification(notificationForms: NotificationForm[], conn: Connection): Promise<ServiceRes<string[]>> {
    try {
      const validatedNotificationForm = NotificationFormSchema.array().parse(notificationForms);

      const res = await this.notificationRepository.create(validatedNotificationForm, conn);

      return { success: true, status: 201, data: res };
    } catch (error) {
      console.error("NotificationService.createNotification error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("NotificationService.createNotification unavailable", 500);
    }
  }

  async createNotificationRecipient(recipientIds: BaseUser["id"][], notificationIds: BaseNotification["id"][], conn: Connection): Promise<ServiceRes> {
    try {
      const validatedRecipientIds = UserIdSchema.array().parse(recipientIds);
      const validatedNotificationIds = BaseNotificationIdSchema.array().parse(notificationIds);

      await this.notificationRepository.createRecipient(validatedRecipientIds, validatedNotificationIds, conn);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("NotificationService.createNotificationRecipient error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("internal server error", 500);
    }
  }
}