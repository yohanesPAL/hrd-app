"use server";
import { withAuth } from "@/lib/withAuth";
import { createAbsenService } from "@/modules/absensi/absensi.factory";
import { KodeAbsen } from "@/modules/absensi/detail/absensi.detail.schema";

const absenService = createAbsenService();

export const getAllAbsen = withAuth(async () => {
  return await absenService.getAllAbsensi();
});

export const getAbsenDetails = withAuth(
  async (session, kodeAbsen: KodeAbsen) => {
    return await absenService.getAbsensiByKodeAbsen(kodeAbsen);
})

export const importAbsen = withAuth(
  async (session, file: File) => {
    await absenService.importAbsen(file);
  },
  ["hrd"],
);

export const truncateAbsen = withAuth(async () => {
  await absenService.truncateAbsen();
}, ["hrd"]);
