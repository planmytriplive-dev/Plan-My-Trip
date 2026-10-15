"use client";

import { useState, type FormEvent } from "react";

export function ReviewForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/reviews", { method: "POST", body: new FormData(formElement) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit your review.");
      try { window.sessionStorage.setItem("pmt-review-submitted", "1"); } catch { /* Storage is optional. */ }
      window.location.assign("/reviews");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit your review. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm md:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-semibold text-navy">Your name<input name="name" required minLength={2} maxLength={80} autoComplete="name" className="min-h-11 rounded-lg border border-navy/15 px-3 font-normal" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy">Rating<select name="rating" required defaultValue="5" className="min-h-11 rounded-lg border border-navy/15 px-3 font-normal"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Destination or trip<input name="destination" maxLength={80} placeholder="For example, Katra or Kashmir" className="min-h-11 rounded-lg border border-navy/15 px-3 font-normal" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Your review<textarea name="text" required minLength={10} maxLength={1200} rows={4} className="rounded-lg border border-navy/15 p-3 font-normal" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Add a photo (optional)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="rounded-lg border border-navy/15 p-3 font-normal" /><span className="text-xs font-normal text-ink/55">JPG, PNG or WebP, up to 5 MB.</span></label>
      <div className="md:col-span-2"><button disabled={busy} className="min-h-11 rounded-lg bg-sun px-5 font-semibold text-ink disabled:opacity-60">{busy ? "Sending..." : "Submit review"}</button>{message && <p role="alert" className="mt-3 text-sm text-ink/70">{message}</p>}</div>
    </form>
  );
}
