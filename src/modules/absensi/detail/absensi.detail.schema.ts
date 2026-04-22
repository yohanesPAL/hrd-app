import { z } from "zod";

export const BaseAbsensiDetailSchema = z
  .object({
    id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
    kode_absen: z.string().min(1).trim(),
    nama_absen: z.string().min(1).trim(),
    divisi: z.string().min(1).trim(),
    tanggal: z.string().min(1).trim().nullable(),
    absent: z.coerce.boolean(),
    scan_masuk: z.string().trim().nullable(),
    scan_keluar: z.string().trim().nullable(),
    terlambat: z.number().nonnegative(),
    lembur: z.number().nonnegative(),
    jam_kerja: z.number().nonnegative(),
  })
  .strict();

export const ExcelRowDataSchema = BaseAbsensiDetailSchema.omit({
  id: true,
});

export const AbsensiDetailTableSchema = BaseAbsensiDetailSchema.extend({
  no: z.number().nonnegative(),
})

export const KodeAbsenSchema = BaseAbsensiDetailSchema.shape.kode_absen;

export type BaseAbsensiDetail = z.infer<typeof BaseAbsensiDetailSchema>;
export type KodeAbsen = z.infer<typeof KodeAbsenSchema>;
export type ExcelRowData = z.infer<typeof ExcelRowDataSchema>;
export type AbsensiDetailTable = z.infer<typeof AbsensiDetailTableSchema>;
export type RawExcelRowData = Pick<
  ExcelRowData,
  | "kode_absen"
  | "nama_absen"
  | "tanggal"
  | "absent"
  | "scan_masuk"
  | "scan_keluar"
>;
