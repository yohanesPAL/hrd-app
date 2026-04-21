import { z } from "zod";

export const BaseCarMaintenanceSchema = z
  .object({
    id: z.number().transform(val => val.toString().trim()),
    id_kendaraan: z.number().transform(val => val.toString().trim()),
    ket: z.string().trim(),
    tanggal: z.date().min(1),
  })
  .strict();

export const CarMaintenanceIdSchema = z.string().min(1).trim();

export const CarMaintenanceTableSchema = BaseCarMaintenanceSchema.extend({
  no: z.number().nonnegative(),
})

export const CarMaintenanceFormSchema = BaseCarMaintenanceSchema.omit({
  id: true,
}).extend({
  tanggal: z.string().min(1).trim(),
  id_kendaraan: z.string().min(1).trim(),
})

export type BaseCarMaintenance = z.infer<typeof BaseCarMaintenanceSchema>;
export type CarMaintenanceTable = z.infer<typeof CarMaintenanceTableSchema>;
export type CarMaintenanceForm = z.infer<typeof CarMaintenanceFormSchema>;