import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    role: string;
    karyawanId: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
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
  }
}