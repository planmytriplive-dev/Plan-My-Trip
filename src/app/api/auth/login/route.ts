import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminCredentials, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const body = z.object({ email: z.string().min(3).max(120), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter email and password." }, { status: 400 });

  if (!checkAdminCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);
  return res;
}
