import { NextRequest, NextResponse } from "next/server";
import { ServerFetch } from "@/utils/ServerFetch";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: "/divisi",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: `/divisi/${body.id}`,
    options: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const id = await req.json();

  const res = await ServerFetch({
    uri: `/divisi/${id}`,
    options: {
      method: "DELETE",
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
