import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('login')?.value === 'true';

  if(!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/media/:path*'],
};