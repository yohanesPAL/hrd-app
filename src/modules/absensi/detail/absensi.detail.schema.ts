import { z } from "zod";

export const BaseAbsensiDetailSchema = z
  .object({
    id: z.coerce.string().min(1),
    kode_absen: z.string().min(1),
    nama_absen: z.string().min(1),
    divisi: z.string().min(1),
    tanggal: z.string().min(1).nullable(),
    absent: z.coerce.boolean(),
    scan_masuk: z.string().nullable(),
    scan_keluar: z.string().nullable(),
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
