import { Err } from "@/lib/err";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiErrorHandler(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json({success: false, error: err.issues }, { status: 400 });
  }

  if (err instanceof Err) {
    return NextResponse.json({success: false, error: err.message }, { status: err.status });
  }

  const msg = err instanceof Error ? err.message : "internal server error";
  return NextResponse.json({success: false, error: msg}, {status: 500});
  
}
