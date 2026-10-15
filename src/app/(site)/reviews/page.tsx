import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { ReviewNotice } from "@/components/reviews/ReviewNotice";

export const metadata: Metadata = {
  title: "Traveller Reviews | Plan My Trip",
  description: "Read and share traveller feedback for Plan My Trip.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-12 md:px-8 md:py-20">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="eyebrow">Traveller reviews</span>
          <h1 className="mt-3 font-display text-4xl text-navy md:text-5xl">What travellers say.</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink/65">Read about trips with Plan My Trip, or share your own experience with future travellers.</p>
        </div>
        <div className="self-end sm:self-auto"><ReviewDialog /></div>
      </div>
      <ReviewNotice />
      <Suspense fallback={<div className="mt-8 rounded-2xl bg-cream p-6 text-ink/65">Loading traveller reviews...</div>}>
        <PublishedReviews />
      </Suspense>
    </main>
  );
}

async function PublishedReviews() {
  await connection();
  await connectDB();
  const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 }).limit(100).lean();

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Published traveller reviews">
      {reviews.map((review) => (
        <article key={String(review._id)} className="rounded-xl border border-navy/10 bg-white p-4 shadow-[0_5px_18px_rgba(7,27,61,.045)] md:p-5">
          {review.photoUrl && <Image src={review.photoUrl} alt={`Photo shared by ${review.name}`} width={640} height={480} className="mb-3 aspect-[16/9] max-h-44 w-full rounded-lg object-cover" />}
          <p className="text-sm text-sun" aria-label={`${review.rating} out of 5 stars`}>
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">“{review.text}”</p>
          <p className="mt-4 text-sm font-semibold text-navy">{review.name}</p>
          {review.destination && <p className="mt-0.5 text-xs text-ink/55">{review.destination}</p>}
        </article>
      ))}
      {!reviews.length && (
        <div className="rounded-xl bg-cream p-5 text-sm text-ink/65 md:col-span-2 lg:col-span-3">
          No published reviews yet. Be the first to share your experience using the button above.
        </div>
      )}
    </section>
  );
}
