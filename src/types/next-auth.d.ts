import { DefaultSession } from "next-auth";
import { Role } from "./RolseType";

declare module "next-auth" {
  interface User {
    namaKaryawan: string;
    role: Role;
    karyawanId: string;
  }

  interface Session {
    user: {
      id: string;
      namaKaryawan: string;
      role: Role;
      karyawanId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    role: Role;
    karyawanId: string;
    namaKaryawan: string;
  }
}