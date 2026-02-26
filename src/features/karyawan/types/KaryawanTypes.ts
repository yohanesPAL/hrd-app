import { getKaryawanFormOptions } from "../KaryawanAction";

export type KaryawanFormOptions = Awaited<
  ReturnType<typeof getKaryawanFormOptions>
>;
export type KaryawanOnEdit = {
  id: string;
  nama: string;
};
