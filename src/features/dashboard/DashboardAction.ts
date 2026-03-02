import { withAuth } from "@/lib/withAuth";
import { createEventService } from "@/modules/event/event.factory";
import { AccountId } from "@/modules/event/event.schema";

const eventService = createEventService();

export const getUpcomingEvents = withAuth(async (session, id: AccountId) => {
  return await eventService.getUpcomingEvents(id);
});
