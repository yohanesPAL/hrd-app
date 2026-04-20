"use server";
import { withAuth } from "@/lib/withAuth";
import { depoService } from "@/modules/depo/depo.factory";
import { BaseDepo, DepoForm } from "@/modules/depo/depo.schema";

export const getAllDepoAction = withAuth(async () => {
  return await depoService.getAllDepo();
});

export const createDepoAction = withAuth(
  async (session, depoForm: DepoForm) => {
    await depoService.createDepo(depoForm);
  },
);

export const updateDepoAction = withAuth(
  async (session, depoForm: DepoForm, depoId: BaseDepo["id"]) => {
    await depoService.updateDepo(depoForm, depoId);
  },
);

export const deleteDepoAction = withAuth(
  async (session, depoId: BaseDepo["id"]) => {
    await depoService.deleteDepo(depoId);
  },
);
