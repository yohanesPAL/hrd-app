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

export type BaseEmployeeContrat = z.infer<typeof BaseEmployeeContractSchema>;
export type EmployeeContractTable = z.infer<typeof EmployeeContractTableSchema>;
export type EmployeeContractForm = z.infer<typeof EmployeeContractFormSchema>;