import { EventRepository } from "./event.repository";
import { EventService } from "./event.service";

export const eventService = new EventService(new EventRepository);