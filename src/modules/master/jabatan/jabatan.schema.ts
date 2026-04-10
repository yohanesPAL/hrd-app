import {z} from "zod"

export const BasePositionSchema = z.object({
  id: z.coerce.string().min(1),
  id_divisi: z.coerce.string().min(1),
  nama: z.string().min(1),
  is_active: z.number().min(0).max(1),
}).strict();

export const PositionTableSchema = BasePositionSchema.extend({
  no: z.number().min(1),
  nama_divisi: z.string().min(1),
})

export const PositionFormSchema = BasePositionSchema.extend({
  id: z.coerce.string().optional(),
})

export const ActivePositionSchema = BasePositionSchema.omit({
  is_active: true,
})

export type BasePosition = z.infer<typeof BasePositionSchema>
export type PositionTable = z.infer<typeof PositionTableSchema>
export type PositionForm = z.infer<typeof PositionFormSchema>
export type ActivePosition = z.infer<typeof ActivePositionSchema>