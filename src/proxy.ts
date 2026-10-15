import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "pmt_admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  let ok = false;
  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      ok = true;
    } catch {
      ok = false;
    }
  }
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Only admin pages. Admin API routes/actions re-check with requireAdmin() themselves.
export const config = { matcher: ["/admin/:path*"] };