import { roleList } from "@/lib/roleList";
import { z } from "zod";

export const BaseUserSchema = z
  .object({
    id: z.coerce.string().min(1),
    username: z.string().min(1),
    password: z.string().min(1),
    role: z.enum(roleList),
    karyawan_id: z.coerce.string().min(1),
  })
  .strict();

export const UserTableSchema = BaseUserSchema.omit({
  password: true,
}).extend({
  no: z.number().nonnegative(),
  nama_karyawan: z.string().min(1),
});

export const UserFormSchema = BaseUserSchema.omit({
  id: true,
}).extend({
  username: z.string().min(1).trim(),
  password: z.string().min(1).trim(),
});

export const UserUpdateFormSchema = UserFormSchema.extend({
  password: z.string().optional(),
})

export const UserPersistenceSchema = UserFormSchema.extend({
  username: z.string().min(1),
  password: z.string().length(60),
  isPassChange: z.boolean().default(false),
})

export const UserIdSchema = BaseUserSchema.shape.id;

export type BaseUser = z.infer<typeof BaseUserSchema>;
export type UserId = z.infer<typeof UserIdSchema>;
export type UserTable = z.infer<typeof UserTableSchema>;
export type UserForm = z.infer<typeof UserFormSchema>;
export type UserUpdateForm = z.infer<typeof UserUpdateFormSchema>;
export type UserPersistence = z.infer<typeof UserPersistenceSchema>;
