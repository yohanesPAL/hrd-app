import { z } from "zod";

export const BaseDivisionSchema = z.object({
  id: z.string().min(1),
  nama: z.string().min(1),
  is_active: z.boolean().default(true),
});

export const DivisionTableSchema = BaseDivisionSchema.extend({
  no: z.number().min(1),
});

export const DivisionFormSchema = BaseDivisionSchema.omit({
  id: true,
}); 

export type BaseDivision = z.infer<typeof BaseDivisionSchema>;
export type DivisionTable = z.infer<typeof DivisionTableSchema>;
export type DivisionForm = z.infer<typeof DivisionFormSchema>;