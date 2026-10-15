import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminCredentials, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const body = z.object({ email: z.string().min(3).max(120), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const missing = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "AUTH_SECRET"].filter((name) => !process.env[name]);
  if (missing.length || (process.env.AUTH_SECRET?.length ?? 0) < 16) {
    return NextResponse.json(
      { error: "Admin sign-in is not configured on this deployment. Set ADMIN_EMAIL, ADMIN_PASSWORD and an AUTH_SECRET of at least 16 characters in the hosting environment, then redeploy." },
      { status: 503 },
    );
  }

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter email and password." }, { status: 400 });

  if (!checkAdminCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);
  return res;
}
