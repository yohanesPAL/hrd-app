import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginService } from "./modules/login/login.service";
import { CredentialSchema } from "./modules/login/login.schema";

export const { handlers, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(payload) {
        if (!payload) return null;

        const credential = CredentialSchema.parse(payload);
        try {
          const user = await LoginService.userLogin({
            username: credential.username,
            password: credential.password,
          })
          
          return {
            id: String(user.id),
            role: user.role,
            karyawanId: user.karyawan_id,
            namaKaryawan: user.nama,
          };
        } catch (err) {
          throw new Error("InternalError");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.namaKaryawan = user.namaKaryawan;
        token.role = user.role;
        token.karyawanId = user.karyawanId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.namaKaryawan = token.namaKaryawan as string;
      session.user.role = token.role as string;
      session.user.karyawanId = token.karyawanId as string;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  jwt: {
    maxAge: 12 * 60 * 60,
  },
});
