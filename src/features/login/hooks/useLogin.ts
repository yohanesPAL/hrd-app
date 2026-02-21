"use client";
import useProfile from "@/stores/profile/ProfileStore";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useLogin() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);

  async function onLogin(username: string, password: string) {
    if (!password || !username) throw new Error("username dan password tidak boleh kosong!");
    
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          throw new Error("username atau password salah");
        } else {
          throw new Error("internal server error");
        }
      }

      const session = await getSession();
      if (!session) throw new Error("gagal ambil session");

      setProfile({
        role: session.user.role,
        id: session.user.id,
      });

      router.push(`/${session.user.role}/dashboard`);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("something went wrong");
      }
    }
  }

  return { onLogin, loading };
}
