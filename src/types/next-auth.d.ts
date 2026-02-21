import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    namaKaryawan: string;
    role: string;
    karyawanId: string;
  }

  interface Session {
    user: {
      id: string;
      namaKaryawan: string;
      role: string;
      karyawanId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    role: string;
    karyawanId: string;
    namaKaryawan: string;
  }
}