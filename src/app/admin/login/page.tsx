"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sign in failed. Try again.");
    } catch {
      setError("Could not reach the sign in service. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page flex min-h-dvh items-center justify-center px-5 py-10">
      <section className="admin-login-card w-full max-w-md overflow-hidden rounded-3xl bg-white">
        <div className="admin-login-banner px-7 py-7 sm:px-9"><Image src="/logo/logo.png" alt="Plan My Trip logo" width={120} height={114} priority className="h-14 w-14 rounded-xl bg-white p-1 object-contain shadow-sm" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[.2em] text-amber-800">Plan My Trip · Jammu &amp; Kashmir</p><h1 className="mt-2 font-display text-3xl text-slate-950">Admin sign in</h1><p className="mt-1 text-sm text-slate-700">Sign in to manage your travel website.</p></div>
        <form onSubmit={onSubmit} className="space-y-4 px-7 py-7 sm:px-9">
          <label className="block text-sm font-semibold text-navy">Email<input name="email" type="email" required autoComplete="username" placeholder="you@example.com" className="mt-1.5 min-h-12 w-full rounded-xl border border-navy/15 bg-[#fcfcfb] px-3.5 text-base font-normal text-ink outline-none transition focus:border-sky" /></label>
          <label className="block text-sm font-semibold text-navy">Password<input name="password" type="password" required autoComplete="current-password" className="mt-1.5 min-h-12 w-full rounded-xl border border-navy/15 bg-[#fcfcfb] px-3.5 text-base font-normal text-ink outline-none transition focus:border-sky" /></label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="min-h-12 w-full rounded-xl bg-navy px-4 font-bold text-white transition hover:bg-navy-deep disabled:opacity-60">{busy ? "Signing in…" : "Sign in to dashboard"}</button>
          <p className="pt-1 text-center text-xs text-ink/45">Your account is for authorised site administrators only.</p>
        </form>
      </section>
    </main>
  );
}
