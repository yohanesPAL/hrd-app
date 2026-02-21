import {z} from "zod"

export const CredentialSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export type Credential = z.infer<typeof CredentialSchema>;

export interface Account extends Credential {
  id: string;
  role: string;
  karyawan_id: string;
  nama: string;
}