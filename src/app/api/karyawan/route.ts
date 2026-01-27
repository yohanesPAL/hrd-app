import { ServerFetch } from "@/utils/ServerFetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: "/karyawan",
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

export async function DELETE(req: NextRequest) {
  const id = await req.json();

  const res = await ServerFetch({
    uri: `/karyawan/${id}`,
    options: {
      method: "DELETE",
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const res = await ServerFetch({
    uri: `/karyawan/${body.id}`,
    options: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
