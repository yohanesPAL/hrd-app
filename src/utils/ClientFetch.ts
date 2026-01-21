import { NextResponse } from "next/server";

export async function ApiWrapper({
  body,
  uri,
  method,
  headers = {},
}: {
  uri: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
}) {
  try {
    const res = await fetch(uri, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch (error) {
    return NextResponse.json({ error: "service unavailable" }, { status: 502 });
  }
}
