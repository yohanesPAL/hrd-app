import { Err } from "@/lib/err";
import { BaseUser, UserIdSchema } from "../user/user.schema";
import { INotificationRepository, INotificationService } from "./notification.interface";
import { NotificationPopup } from "./notification.schema";
import { ZodError } from "zod";

export class NotificationService implements INotificationService {
  constructor(private notificationRepository: INotificationRepository) { }

  async getNotificationsPopup(userId: BaseUser["id"]): Promise<NotificationPopup[]> {
    try {
      const valId = UserIdSchema.parse(userId);
      return await this.getNotificationsPopup(valId);
    } catch (error) {
      console.error("NotificationService.getNotificatiosPopup error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid user id", 400);

      throw new Err("NotificationService unavailable", 500);
    }
  }
}