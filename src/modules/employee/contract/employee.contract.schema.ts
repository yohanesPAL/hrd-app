import {z} from "zod"

export const BaseEmployeeContractSchema = z.object({
  id: z.coerce.string().min(1),
  karyawan_id: z.coerce.string().min(1),
  jenis: z.enum(["kontrak", "tetap"]),
  tgl_kontrak: z.date(),
  tgl_berakhir: z.date().nullable(),
  total_kontrak: z.number().nonnegative(),
})

export const EmployeeContractIdSchema = BaseEmployeeContractSchema.shape.id;

export const EmployeeContractTableSchema = BaseEmployeeContractSchema.omit({
  karyawan_id: true,
}).extend({
  no: z.number().nonnegative(),
  karyawan_nama: z.string().min(1),
})

export const EmployeeContractFormSchema = BaseEmployeeContractSchema.omit({
  id: true,
})

export const EmployeeContractExpirationSchema = BaseEmployeeContractSchema.pick({
  id: true,
}).extend({
  tgl_berakhir: z.date(),
  nama: z.string().min(1),
  days_diff: z.number().min(0).max(7),
  notified_7_day: z.date().nullable(),
  notified_3_day: z.date().nullable(),
  notified_today: z.date().nullable(),
})

export type BaseEmployeeContract = z.infer<typeof BaseEmployeeContractSchema>;
export type EmployeeContractTable = z.infer<typeof EmployeeContractTableSchema>;
export type EmployeeContractForm = z.infer<typeof EmployeeContractFormSchema>;
export type EmployeeContractExpiration = z.infer<typeof EmployeeContractExpirationSchema>;