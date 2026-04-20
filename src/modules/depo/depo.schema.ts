import {z} from "zod"

export const BaseDepoSchema = z.object({
  id: z.coerce.string().min(1),
  nama: z.string().min(1),
})

export const DepoIdSchema = BaseDepoSchema.shape.id;

export const DepoFormSchema = BaseDepoSchema.omit({
  id: true,
})

export const DepoTableSchema = BaseDepoSchema.extend({
  no: z.number().nonnegative(),
})

export type BaseDepo = z.infer<typeof BaseDepoSchema>;
export type DepoForm = z.infer<typeof DepoFormSchema>;
export type DepoTable = z.infer<typeof DepoTableSchema>;