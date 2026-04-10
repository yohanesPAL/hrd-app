"use server";
import { withAuth } from "@/lib/withAuth";
import { absensiService } from "@/modules/absensi/absensi.factory";
import { KodeAbsen } from "@/modules/absensi/detail/absensi.detail.schema";

export const getAllAbsen = withAuth(async () => {
  return await absensiService.getAllAbsensi();
});

export const getAbsenDetails = withAuth(
  async (session, kodeAbsen: KodeAbsen) => {
    return await absensiService.getAbsensiByKodeAbsen(kodeAbsen);
})

export const importAbsen = withAuth(
  async (session, file: File) => {
    await absensiService.importAbsen(file);
  },
  ["hrd"],
);

export const truncateAbsen = withAuth(async () => {
  await absensiService.truncateAbsen();
}, ["hrd"]);
