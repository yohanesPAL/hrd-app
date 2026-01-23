import { ServerFetch } from "@/utils/ServerFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await ServerFetch({ uri: `/divisi` })
 
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}