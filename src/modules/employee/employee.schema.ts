import { z } from "zod";

export const BaseEmployeeSchema = z
  .object({
    id: z.coerce.string().min(1),
    nik: z.string().min(1).regex(/^\d+$/, "nik tidak valid").max(16),
    nama: z.string().min(1),
    jk: z.enum(["Pria", "Wanita"]),
    alamat: z.string().min(1),
    hp: z.string().refine((val) => val === "" || /^\+?\d+$/.test(val), {
      message: "hp tidak valid",
    }),
    divisi: z.coerce.string().min(1),
    jabatan: z.coerce.string().min(1),
    sp: z.number().nonnegative().max(3),
    cuti_terakhir: z.number().nonnegative(),
    cuti_sekarang: z.number().nonnegative(),
    tgl_masuk: z.date().nullable(),
    tgl_keluar: z.date().nullable(),
    kode_absensi: z.string().nullable(),
    is_active: z.number().transform((val) => val === 1),
  })
  .strict();

export const EmployeeIdSchema = BaseEmployeeSchema.shape.id;

export const EmployeeAbsentDivSchema = BaseEmployeeSchema.pick({
  kode_absensi: true,
  divisi: true,
});

export const EmployeeTableSchema = BaseEmployeeSchema.omit({
  cuti_terakhir: true,
  cuti_sekarang: true,
  tgl_masuk: true,
  tgl_keluar: true,
}).extend({
  no: z.number().nonnegative(),
  jenis_kontrak: z.string().nullable(),
  tgl_berakhir: z.date().nullable(),
});

export const EmployeeFormSchema = BaseEmployeeSchema.omit({
  id: true,
  sp: true,
  tgl_keluar: true,
}).extend({
  tgl_masuk: z.string().min(1),
  is_active: z.number(),
});

export const EmployeeUpdateSchema = BaseEmployeeSchema.omit({
  id: true,
  sp: true,
  kode_absensi: true,
}).extend({
  tgl_masuk: z.string().min(1),
  tgl_keluar: z.string().nullable(),
});

export const EmployeeSpFormSchema = BaseEmployeeSchema.pick({ sp: true });

export const EmployeeKodeAbsenFormSchema = BaseEmployeeSchema.pick({
  kode_absensi: true,
});

export const OpenEmployeeSchema = BaseEmployeeSchema.pick({
  id: true,
  nik: true,
  nama: true,
}).extend({
  jabatan: z.string().min(1),
});

export type BaseEmployee = z.infer<typeof BaseEmployeeSchema>;
export type EmployeeTable = z.infer<typeof EmployeeTableSchema>;
export type EmployeeForm = z.infer<typeof EmployeeFormSchema>;
export type EmployeeSpForm = z.infer<typeof EmployeeSpFormSchema>;
export type EmployeeKodeAbsenForm = z.infer<typeof EmployeeKodeAbsenFormSchema>;
export type EmployeeUpdate = Partial<z.infer<typeof EmployeeUpdateSchema>> &
  Partial<EmployeeSpForm> &
  Partial<EmployeeKodeAbsenForm>;
export type EmployeeAbsentDiv = z.infer<typeof EmployeeAbsentDivSchema>;
export type OpenEmployee = z.infer<typeof OpenEmployeeSchema>;
