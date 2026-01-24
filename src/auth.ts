import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (res.status === 422) {
            return null;
          }

          if (!res.ok) {
            throw new Error("INTERNAL_SERVER_ERROR");
          }

          const user = await res.json();

          return {
            id: String(user.id),
            username: user.username,
            role: user.role,
            karyawanId: user.karyawan_id,
          };
        } catch (error) {
          throw new Error("SERVICE_UNAVAILABLE");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.karyawanId = user.karyawanId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.username = token.username as string;
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
