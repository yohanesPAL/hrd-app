import { z } from "zod";

export const BaseDivisionSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number()]).transform(val => val.toString()),
  nama: z.string().min(1),
  is_active: z.number().min(0).max(1).default(1),
}).strict();

export const DivisionIdSchema = BaseDivisionSchema.shape.id;

export const DivisionTableSchema = BaseDivisionSchema.extend({
  no: z.number().min(1),
});

export const DivisionFormSchema = BaseDivisionSchema.omit({
  id: true,
})

export const ActiveDivisionSchema = BaseDivisionSchema.omit({
  is_active: true,
})

export type BaseDivision = z.infer<typeof BaseDivisionSchema>;
export type DivisionTable = z.infer<typeof DivisionTableSchema>;
export type DivisionForm = z.infer<typeof DivisionFormSchema>;
export type ActiveDivision = z.infer<typeof ActiveDivisionSchema>;