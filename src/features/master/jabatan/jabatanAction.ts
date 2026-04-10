"use server";
import { withAuth } from "@/lib/withAuth";
import { positionService } from "@/modules/master/jabatan/jabatan.factory";
import { BasePosition, PositionForm } from "@/modules/master/jabatan/jabatan.schema";
import { revalidatePath } from "next/cache";

const PATH = "master/jabatan";

export const getPositionsAction = withAuth(async () => {
  return await positionService.getAllPositions();
});

export const createPositionAction = withAuth(
  async (session, data: PositionForm) => {
    await positionService.createPosition(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updatePositionAction = withAuth(
  async (session, data: BasePosition) => {
    await positionService.updatePosition(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deletePositionAction = withAuth(
  async (session, id: string) => {
    await positionService.deletePosition(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
