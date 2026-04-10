import { AccountId, BaseEvent, EventForm, UpcomingEvent } from "./event.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IEventRepository {
  getByAccount(id: AccountId, startDate: Date, endDate: Date): Promise<BaseEvent[]>;
  getUpcoming(id: AccountId): Promise<UpcomingEvent[]>;
  create(data: EventForm): Promise<boolean>;
  update(id: AccountId, data: EventForm): Promise<boolean>;
  delete(id: AccountId): Promise<boolean>;
}

export interface IEventService {
  getEventsByAccount(id: AccountId, date: Date): Promise<ServiceRes<BaseEvent[]>>;
  getUpcomingEvents(id: AccountId): Promise<ServiceRes<{onGoing: UpcomingEvent[], upcoming: UpcomingEvent[]}>>;
  createEvent(data: EventForm): Promise<ServiceRes>;
  updateEvent(id: AccountId, data: EventForm): Promise<ServiceRes>;
  deleteEvent(id: AccountId): Promise<ServiceRes>;
}
