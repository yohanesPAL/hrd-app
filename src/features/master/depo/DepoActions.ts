"use server";
import { withAuth } from "@/lib/withAuth";
import { depoService } from "@/modules/depo/depo.factory";
import { BaseDepo, DepoForm } from "@/modules/depo/depo.schema";
import { revalidatePath } from "next/cache";

const PATH = "master/depo"

export const getAllDepoAction = withAuth(async () => {
  return await depoService.getAllDepo();
});

export const createDepoAction = withAuth(
  async (session, depoForm: DepoForm) => {
    await depoService.createDepo(depoForm);
    revalidatePath(`${session.user.role}/${PATH}`)
  },
);

export const updateDepoAction = withAuth(
  async (session, depoForm: DepoForm, depoId: BaseDepo["id"]) => {
    await depoService.updateDepo(depoForm, depoId);
    revalidatePath(`${session.user.role}/${PATH}`)
  },
);

export const deleteDepoAction = withAuth(
  async (session, depoId: BaseDepo["id"]) => {
    await depoService.deleteDepo(depoId);
    revalidatePath(`${session.user.role}/${PATH}`)
  },
);
