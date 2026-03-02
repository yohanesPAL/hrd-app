import { Account } from "@/modules/login/login.schema";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    namaKaryawan: string;
    role: Account["role"];
    karyawanId: string;
  }

  interface Session {
    user: {
      id: string;
      namaKaryawan: string;
      role: Account["role"];
      karyawanId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    role: Account["role"];
    karyawanId: string;
    namaKaryawan: string;
  }
}