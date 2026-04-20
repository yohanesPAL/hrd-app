import { z } from "zod";

export const CAR_STATUS = ["baik", "rusak", "perbaikan"];

export const BaseCarSchema = z
  .object({
    id: z.coerce.string().min(1),
    nama: z.string().min(1),
    jenis: z.string().min(1),
    merk: z.string().min(1),
    nopol: z.string().min(1),
    depo: z.string().min(1),
    tahun: z.coerce.string().min(1),
    jumlah_roda: z.number().nonnegative(),
    status: z.enum(CAR_STATUS),
  })
  .strict();

export const CarIdSchema = BaseCarSchema.shape.id;

export const CarFormSchema = BaseCarSchema.omit({
  id: true,
});

export const CarTableSchema = BaseCarSchema.extend({
  no: z.number().nonnegative(),
})

export type BaseCar = z.infer<typeof BaseCarSchema>;
export type CarForm = z.infer<typeof CarFormSchema>;
export type CarTable = z.infer<typeof CarTableSchema>;
