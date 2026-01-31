import { ServerFetch } from "@/utils/ServerFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queries = req.nextUrl.searchParams;
  const tm = queries.get("tm");
  const ta = queries.get("ta");

  const res = await ServerFetch({ uri: `/acara/${id}?tm=${tm}&ta=${ta}` });
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const aid = req.nextUrl.searchParams.get("aid");

  const res = await ServerFetch({
    uri: `/acara/${body}?aid=${aid}`,
    options: { method: "DELETE" },
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: `/acara/${body.id}`,
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
