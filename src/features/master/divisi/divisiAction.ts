"use server";
import { withAuth } from "@/lib/withAuth";
import { divisionService } from "@/modules/master/divisi/division.factory";
import { BaseDivision, DivisionForm } from "@/modules/master/divisi/division.schema";
import { revalidatePath } from "next/cache";

const PATH = "master/divisi";

export const getDivisionsAction = withAuth(async () => {
  return await divisionService.getAllDivisions();
});

export const createDivisionAction = withAuth(
  async (session, data: DivisionForm) => {
    await divisionService.createDivision(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateDivisionAction = withAuth(
  async (session, data: DivisionForm, id: BaseDivision["id"]) => {
    await divisionService.updateDivision(data, id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteDivisionAction = withAuth(
  async (session, id: BaseDivision["id"]) => {
    await divisionService.deleteDivision(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
