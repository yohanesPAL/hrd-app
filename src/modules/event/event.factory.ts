import { EventRepository } from "./event.repository";
import { EventService } from "./event.service";

export function createEventService() {
  return new EventService(new EventRepository);
}