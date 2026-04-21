import { z } from "zod";

export const CAR_STATUS = ["baik", "rusak", "perbaikan"];

export const BaseCarSchema = z
  .object({
    id: z.number().transform(val => val.toString().trim()),
    nama: z.string().min(1).trim(),
    jenis: z.string().min(1).trim(),
    merk: z.string().min(1).trim(),
    nopol: z.string().min(1).trim(),
    depo: z.string().min(1).trim(),
    tahun: z.coerce.string().min(1).trim(),
    jumlah_roda: z.number().nonnegative(),
    status: z.enum(CAR_STATUS),
  })
  .strict();

export const CarIdSchema = z.string().min(1).trim();

export const CarFormSchema = BaseCarSchema.omit({
  id: true,
});

export const CarTableSchema = BaseCarSchema.extend({
  no: z.number().nonnegative(),
})

export type BaseCar = z.infer<typeof BaseCarSchema>;
export type CarForm = z.infer<typeof CarFormSchema>;
export type CarTable = z.infer<typeof CarTableSchema>;
