import { NotificationTable, NotificationTableSchema } from "./notification.schema";

export class NotificationMapper {
  static toTableRows(dbRows: any[]): NotificationTable[] {
    return NotificationTableSchema.array().parse(
      dbRows.map((item, index) => ({
        ...item,
        no: index + 1,
      }))
    )
  }
}