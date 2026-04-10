import { roleList } from "@/lib/roleList";
import {z} from "zod"

export const CredentialSchema = z.object({
  username: z.coerce.string().min(1),
  password: z.string().min(1),
});

export const AccountSchema = CredentialSchema.extend({
  id: z.coerce.string().min(1),
  role: z.enum(roleList),
  karyawan_id: z.coerce.string().min(1),
  nama: z.string().min(1),
});

export const ClientAccountSchema = AccountSchema.omit({
  password: true,
});

export type Credential = z.infer<typeof CredentialSchema>;
export type Account = z.infer<typeof AccountSchema>;