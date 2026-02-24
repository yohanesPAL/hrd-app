"use server";
import { withAuth } from "@/lib/withAuth";
import { createDivisionService } from "@/modules/divisi/division.factory";
import { BaseDivision, DivisionForm } from "@/modules/divisi/division.schema";
import { revalidatePath } from "next/cache";

const divisionServices = createDivisionService();
const PATH = "master/divisi";

export const getDivisionsAction = withAuth(async () => {
  return await divisionServices.getAllDivisions();
});

export const createDivisionAction = withAuth(
  async (session, data: DivisionForm) => {
    await divisionServices.createDivision(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateDivisionAction = withAuth(
  async (session, data: BaseDivision) => {
    await divisionServices.updateDivision(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteDivisionAction = withAuth(
  async (session, id: string) => {
    await divisionServices.deleteDivision(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
