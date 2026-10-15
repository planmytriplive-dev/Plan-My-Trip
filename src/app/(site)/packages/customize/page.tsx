import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { CustomTripForm } from "@/components/packages/CustomTripForm";

export const metadata: Metadata = {
  title: "Plan a Custom Trip",
  description:
    "Build a Jammu, Kashmir or Himachal trip around your dates, group and interests, then send your request to our team on WhatsApp.",
};

export default function CustomizePackagePage() {
  return (
    <main className="min-h-[70vh] bg-white">
      <section className="bg-[#fff8d9] px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/packages"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink/65 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All packages
          </Link>
          <span className="eyebrow mt-5">Your trip, your way</span>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            Build a trip around you.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
            Share your destination, travel dates and priorities. Our team will
            help shape a trip around your group.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-[1fr_17rem] md:px-8 md:py-14">
        <CustomTripForm />
        <aside className="h-fit rounded-2xl bg-[#fffdf5] p-5 sm:p-6">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-2 font-display text-xl font-extrabold text-ink">
            A few details are enough to get started.
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/70">
            {[
              "Tell us your preferred destination and dates.",
              "Add your group size, budget and interests.",
              "Review your message in WhatsApp and send it to our team.",
            ].map((step) => (
              <li key={step} className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-[#9a7800]" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
