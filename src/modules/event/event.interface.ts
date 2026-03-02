import { Connection } from "mysql2/promise";
import { AccountId, BaseEvent, EventForm, UpcomingEvent } from "./event.schema";

export interface IEventRepository {
  getByAccount(id: AccountId, date: Date): Promise<BaseEvent[]>;
  getUpcoming(id: AccountId): Promise<UpcomingEvent[]>;
  create(data: EventForm, conn: Connection): Promise<boolean>;
  update(id: AccountId, data: EventForm, conn: Connection): Promise<boolean>;
  delete(id: AccountId, conn: Connection): Promise<boolean>;
}