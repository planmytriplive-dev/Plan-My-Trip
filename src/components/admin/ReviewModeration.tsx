"use client";

import { useEffect, useState } from "react";

type Review = { _id: string; name: string; rating: number; text: string; destination?: string; status: string; createdAt: string };

export function ReviewModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  async function load() {
    const response = await fetch("/api/admin/reviews");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load reviews.");
    setReviews(data.reviews);
  }
  useEffect(() => { load().catch((e) => setError(e.message)); }, []);
  async function setStatus(id: string, status: "approved" | "rejected") {
    setError("");
    const response = await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Could not update review."); return; }
    setReviews((items) => items.map((item) => item._id === id ? { ...item, status } : item));
  }
  async function deleteReview(id: string) {
    const response = await fetch("/api/admin/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Could not delete review."); return; }
    setReviews((items) => items.filter((item) => item._id !== id));
  }
  return <div className="mt-6 grid gap-4">{error && <p role="alert" className="text-red-700">{error}</p>}{reviews.map((review) => <article key={review._id} className="rounded-2xl border border-navy/10 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong className="text-navy">{review.name}</strong><span className="ml-3 text-sun">{"★".repeat(review.rating)}</span><p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{review.status}{review.destination ? ` · ${review.destination}` : ""}</p></div><time className="text-xs text-ink/50">{new Date(review.createdAt).toLocaleDateString()}</time></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">{review.text}</p><div className="mt-4 flex gap-2">{review.status !== "approved" && <button onClick={() => setStatus(review._id, "approved")} className="min-h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white">Publish</button>}{review.status !== "rejected" && <button onClick={() => setStatus(review._id, "rejected")} className="min-h-10 rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy">Remove from public</button>}<button onClick={() => deleteReview(review._id)} className="min-h-10 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700">Delete permanently</button></div></article>)}{!reviews.length && !error && <p className="text-ink/60">No submitted reviews yet.</p>}</div>;
}
