import { getKaryawanFormOptionsAction } from "../KaryawanAction";

export type KaryawanFormOptions = Awaited<
  ReturnType<typeof getKaryawanFormOptionsAction>
>;
export type KaryawanOnEdit = {
  id: string;
  nama: string;
};
