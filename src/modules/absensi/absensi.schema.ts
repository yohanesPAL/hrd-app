import { nonnegative, z } from "zod";

export const BaseAbsensiSchema = z
  .object({
    id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
    kode_absen: z.string().min(1),
    nama_absen: z.string().min(1),
    divisi: z.coerce.string().min(1),
    hadir: z.number().nonnegative(),
    absent: z.number().nonnegative(),
    terlambat: z.number().nonnegative(),
    lembur: z.number().nonnegative(),
    jam_kerja: z.number().nonnegative(),
  })
  .strict();

export const AbsensiTableSchema = BaseAbsensiSchema.extend({
  no: z.number().nonnegative(),
});

export type BaseAbsensi = z.infer<typeof BaseAbsensiSchema>;
export type AbsensiTable = z.infer<typeof AbsensiTableSchema>;
