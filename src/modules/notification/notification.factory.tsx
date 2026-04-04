import { NotificationRepository } from "./notification.repository";
import { NotificationService } from "./notification.service";

export function createNotificationService() {
  return new NotificationService(new NotificationRepository);
}