import {z} from "zod"

export const BasePositionSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  id_divisi: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  nama: z.string().min(1),
  is_active: z.number().min(0).max(1),
}).strict();

export const PositionIdSchema = BasePositionSchema.shape.id;

export const PositionTableSchema = BasePositionSchema.extend({
  no: z.number().min(1),
  nama_divisi: z.string().min(1),
})

export const PositionFormSchema = BasePositionSchema.omit({
  id: true,
})

export const ActivePositionSchema = BasePositionSchema.omit({
  is_active: true,
})

export type BasePosition = z.infer<typeof BasePositionSchema>
export type PositionTable = z.infer<typeof PositionTableSchema>
export type PositionForm = z.infer<typeof PositionFormSchema>
export type ActivePosition = z.infer<typeof ActivePositionSchema>