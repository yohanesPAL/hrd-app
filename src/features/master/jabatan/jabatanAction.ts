"use server";
import { withAuth } from "@/lib/withAuth";
import { createPositionService } from "@/modules/master/jabatan/jabatan.factory";
import { BasePosition, PositionForm } from "@/modules/master/jabatan/jabatan.schema";
import { revalidatePath } from "next/cache";

const positionsServices = createPositionService();
const PATH = "master/jabatan";

export const getPositionsAction = withAuth(async () => {
  return await positionsServices.getAllPositions();
});

export const createPositionAction = withAuth(
  async (session, data: PositionForm) => {
    await positionsServices.createPosition(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updatePositionAction = withAuth(
  async (session, data: BasePosition) => {
    await positionsServices.updatePosition(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deletePositionAction = withAuth(
  async (session, id: string) => {
    await positionsServices.deletePosition(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
