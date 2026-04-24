"use server";
import { withAuth } from "@/lib/withAuth";
import { absensiService } from "@/modules/absensi/absensi.factory";
import { KodeAbsen } from "@/modules/absensi/detail/absensi.detail.schema";

export const getAllAbsenAction = withAuth(async () => {
  return await absensiService.getAllAbsensi();
});

export const getAbsenDetailsAction = withAuth(
  async (session, kodeAbsen: KodeAbsen) => {
    return await absensiService.getAbsensiByKodeAbsen(kodeAbsen);
})

export const importAbsenAction = withAuth(
  async (session, file: File) => {
    await absensiService.importAbsen(file);
  },
  ["hrd"],
);

export const truncateAbsenAction = withAuth(async () => {
  await absensiService.truncateAbsen();
}, ["hrd"]);
