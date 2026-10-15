import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "pmt_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET missing or too short (min 16 chars)");
  return new TextEncoder().encode(s);
}

export async function createSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

/** Constant-time compare so response timing doesn't leak the password. */
export function checkAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPass) return false;
  const eq = (a: string, b: string) => {
    const A = Buffer.from(a);
    const B = Buffer.from(b);
    return A.length === B.length && timingSafeEqual(A, B);
  };
  const okEmail = eq(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const okPass = eq(password, expectedPass);
  return okEmail && okPass;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
};

/** Call in EVERY admin server action / admin API route. Never rely on proxy alone. */
export async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) throw new Error("UNAUTHORIZED");
}