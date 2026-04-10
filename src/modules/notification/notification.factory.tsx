import { NotificationRepository } from "./notification.repository";
import { NotificationService } from "./notification.service";

export const notificationService = new NotificationService(new NotificationRepository);