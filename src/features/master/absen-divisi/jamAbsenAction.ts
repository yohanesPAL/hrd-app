"use server";
import { withAuth } from "@/lib/withAuth";
import { jamAbsenService } from "@/modules/master/jamAbsen/jamAbsen.factory";
import { JamAbsenForm } from "@/modules/master/jamAbsen/jamAbsen.schema";
import { revalidatePath } from "next/cache";

const PATH = "master/absen-divisi";

export const getJamAbsenAction = withAuth(async () => {
  return await jamAbsenService.getAllJamAbsen();
});

export const updateJamAbsenAction = withAuth(
  async (session, data: JamAbsenForm) => {
    await jamAbsenService.updateJamAbsen(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const resetJamAbsenAction = withAuth(
  async (session, id: string) => {
    await jamAbsenService.resetJamAbsen(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
