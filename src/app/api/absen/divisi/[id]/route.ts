import { ServerFetch } from "@/utils/ServerFetch";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: `/absen-divisi/${body.id}`,
    options: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
