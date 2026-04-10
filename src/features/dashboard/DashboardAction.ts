import { withAuth } from "@/lib/withAuth";
import { eventService } from "@/modules/event/event.factory";
import { AccountId } from "@/modules/event/event.schema";

export const getUpcomingEvents = withAuth(async (session, id: AccountId) => {
  return await eventService.getUpcomingEvents(id);
});
