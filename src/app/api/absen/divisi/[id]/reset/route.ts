import { ServerFetch } from "@/utils/ServerFetch";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  const {id} = await params

  const res = await ServerFetch({
    uri: `/absen-divisi/${id}/reset`,
    options: {
      method: "PATCH"
    }
  });

  const body = await res.json();

  return NextResponse.json(body, {status: res.status});
}