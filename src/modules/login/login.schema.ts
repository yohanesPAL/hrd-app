import { roleList } from "@/lib/roleList";
import {z} from "zod"

export const CredentialSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const AccountSchema = CredentialSchema.extend({
  id: z.string().min(1),
  role: z.enum(roleList),
  karyawan_id: z.string().min(1),
  nama: z.string().min(1),
})

export type Credential = z.infer<typeof CredentialSchema>;
export type Account = z.infer<typeof AccountSchema>;