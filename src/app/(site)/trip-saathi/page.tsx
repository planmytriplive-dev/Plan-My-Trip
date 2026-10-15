import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { TripSaathiChat } from "@/components/chat/TripSaathiChat";
import { site, telHref, whatsappHref } from "@/lib/site";

export const metadata: Metadata = { title: "Katra Trip Saathi | Plan My Trip", description: "Plan a Vaishno Devi yatra, Kashmir escape, or Himachal holiday with Katra Trip Saathi." };

export default function TripSaathiPage() {
  return <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pt-12 lg:px-8">
    <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy/70 transition hover:text-navy"><ArrowLeft className="size-4"/>Back to Plan My Trip</Link>
    <div className="mb-7 mt-6 grid gap-6 md:mb-9 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-orange">Your local travel companion</p><h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">Let’s plan a trip that feels like yours.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">Talk to Katra Trip Saathi about our tours, places to visit, and how to shape a comfortable journey through Jammu, Kashmir, and Himachal.</p></div><div className="flex flex-wrap gap-2"><a href={telHref} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 text-sm font-semibold text-navy"><Phone className="size-4"/>Call {site.phoneDisplay}</a><a href={whatsappHref("Hi Plan My Trip, I would like help planning my trip.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white"><MessageCircle className="size-4"/>WhatsApp team</a></div></div>
    <TripSaathiChat />
    <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-ink/50">Trip Saathi can help with general travel planning and details published on this website. It does not confirm bookings or live conditions; verify important travel details before departure.</p>
  </main>;
}
