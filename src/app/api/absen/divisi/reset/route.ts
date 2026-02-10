import { ServerFetch } from "@/utils/ServerFetch";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: `/absen-divisi/${body}/reset`,
    options: {
      method: "PATCH"
    },
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
