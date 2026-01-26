import "server-only";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function ServerFetch({
  uri,
  options = {},
}: {
  uri: string;
  options?: RequestInit;
}) {
  const session = await auth();

  if (!session) redirect("/unauthorized");

  try {
    const res = await fetch(`${process.env.NEXT_GO_API_URL}${uri}`, {
      ...options,
      headers: {
        ...options.headers,
      },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/unauthorized");

    return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
