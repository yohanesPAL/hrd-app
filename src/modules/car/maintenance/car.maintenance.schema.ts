import { z } from "zod";

export const BaseCarMaintenanceSchema = z
  .object({
    id: z.coerce.string().min(1),
    id_mobil: z.coerce.string().min(1),
    ket: z.string(),
    tanggal: z.date(),
  })
  .strict();

export const CarMaintenanceIdSchema = BaseCarMaintenanceSchema.shape.id;

export const CarMaintenanceTableSchema = BaseCarMaintenanceSchema.extend({
  no: z.number().nonnegative(),
})

export const CarMaintenanceFormSchema = BaseCarMaintenanceSchema.omit({
  id: true,
})

export type BaseCarMaintenance = z.infer<typeof BaseCarMaintenanceSchema>;
export type CarMaintenanceTable = z.infer<typeof CarMaintenanceTableSchema>;
export type CarMaintenanceForm = z.infer<typeof CarMaintenanceFormSchema>;