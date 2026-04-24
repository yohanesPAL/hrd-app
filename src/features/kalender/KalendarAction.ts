"use server";
import { withAuth } from "@/lib/withAuth";
import { eventService } from "@/modules/event/event.factory";
import { AccountId, EventForm } from "@/modules/event/event.schema";
import { revalidatePath } from "next/cache";

const PATH = "kalender";

export const getEventsByAccountAction = withAuth(
  async (session, id: AccountId, date: Date) => {
    return await eventService.getEventsByAccount(id, date);
  },
);

export const createEventAction = withAuth(
  async (session, data: EventForm) => {
    await eventService.createEvent(data);
    revalidatePath(`${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateEventAction = withAuth(
  async (session, data: EventForm, id: AccountId) => {
    await eventService.updateEvent(id, data);
    revalidatePath(`${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteEventAction = withAuth(
  async (session, id: AccountId) => {
    await eventService.deleteEvent(id);
    revalidatePath(`${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
