import {z} from "zod"

export const BaseJamAbsenSchema = z.object({
  id: z.string().min(1),
  divisi: z.string().min(1),
  masuk: z.number().min(1),
  keluar: z.number().min(1),
  keluar_sabtu: z.number().min(1),
})

export const RawJamAbsenTableSchema = BaseJamAbsenSchema.extend({
  id: z.number().min(1),
  divisi: z.number().min(1),
  nama_divisi: z.string().min(1),
})

export const JamAbsenTableSchema = RawJamAbsenTableSchema.extend({
  no: z.number().min(1),
  id: z.string().min(1),
  divisi: z.string().min(1),
  masuk: z.string().min(1),
  keluar: z.string().min(1),
  keluar_sabtu: z.string().min(1),
})

export const JamAbsenFormSchema = BaseJamAbsenSchema.omit({
  divisi: true,
}).extend({
  id: z.string().min(1),
  nama_divisi: z.string().min(1),
  masuk: z.string().min(1),
  keluar: z.string().min(1),
  keluar_sabtu: z.string().min(1),
})

export type RawJamAbsen = z.infer<typeof RawJamAbsenTableSchema>
export type BaseJamAbsen = z.infer<typeof BaseJamAbsenSchema>
export type JamAbsenTable = z.infer<typeof JamAbsenTableSchema>
export type JamAbsenForm = z.infer<typeof JamAbsenFormSchema>
export type JamAbsenFormDB = Pick<JamAbsenForm, "id"> & {
  masuk: Number;
  keluar: Number;
  keluar_sabtu: Number;
}
