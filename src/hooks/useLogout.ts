"use client"
import { signOut } from "next-auth/react";
import { useState } from "react"
import { toast } from "react-toastify";

export function useLogout() {
  const [loading, setLoading] = useState<boolean>(false);

  async function onLogout() {
    setLoading(true);

    try {
      await signOut({callbackUrl: "/login"});
    } catch (error: any) {
      toast.error(error)
    }
  }

  return {onLogout, loading}
}