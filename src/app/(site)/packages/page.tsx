import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, MapPin, Sparkles } from "lucide-react";
import { tripPackages } from "@/lib/travel-content";
import { Package } from "@/models/Package";
import { connectDB } from "@/lib/db";
import { connection } from "next/server";
import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PackageEngagement } from "@/components/packages/PackageEngagement";

export const metadata: Metadata = {
  title: "Curated Jammu, Kashmir & Himachal Packages",
  description: "Explore trips created by our team for Vaishno Devi, Jammu and Kashmir, and Himachal Pradesh. Request a tailored quote for your dates and group.",
  alternates: { canonical: "/packages" },
};

type Search = Promise<{ q?: string; destination?: string; collection?: string; maxPrice?: string }>;
type DisplayTrip = { slug: string; name: string; place?: string; days: string; price: string; tag: string; destinations: readonly string[]; collections: readonly string[]; intro: string; details: readonly string[]; images: readonly string[]; style?: string };

export default function PackagesPage({ searchParams }: { searchParams: Search }) {
  return <main className="min-h-[70vh]">
    <header className="relative isolate overflow-hidden bg-navy text-white">
      <Image src="/images/katra_to_kashmir.png" alt="A mountain road through the Himalayas" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/30" />
      <div className="mx-auto grid min-h-[570px] max-w-7xl items-center gap-10 px-5 py-14 md:min-h-[620px] md:grid-cols-[1.1fr_.9fr] md:px-8 md:py-20">
        <div className="max-w-3xl">

          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">Good trips start<br />with <span className="text-sun">your kind of journey.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">Explore thoughtfully planned routes for Vaishno Devi, Kashmir and Himachal. Choose a starting point, then make the details your own.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#trip-ideas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-sun px-5 font-bold text-ink transition hover:bg-sun-hover">Browse trip ideas <ArrowRight className="size-4" /></Link>
            <Link href="/packages/customize" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/35 bg-white/10 px-5 font-semibold text-white backdrop-blur transition hover:bg-white/20">Build a custom trip</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/75"><span className="inline-flex items-center gap-2"><Check className="size-4 text-sun" /> Flexible dates and pace</span><span className="inline-flex items-center gap-2"><Check className="size-4 text-sun" /> Local planning support</span></div>
        </div>
        <div className="w-full max-w-md justify-self-start md:justify-self-end">
          <div className="rounded-3xl border border-white/40 bg-white/95 p-5 text-navy shadow-[0_28px_80px_rgba(0,0,0,.28)] backdrop-blur-md sm:p-7">
            <div className="flex items-center justify-between gap-4"><span className="eyebrow text-orange-deep">A route for every reason</span><span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun/25"><Compass className="size-5 text-navy" /></span></div>
            <h2 className="mt-3 font-display text-2xl leading-tight md:text-3xl">What would you like<br />your trip to feel like?</h2>
            <div className="mt-6 space-y-3">
              {[["01", "A meaningful yatra", "Katra · Vaishno Devi"], ["02", "A slower valley escape", "Srinagar · Gulmarg · Pahalgam"], ["03", "A mountain adventure", "Shimla · Manali · Himachal"]].map(([number, title, places]) => <div key={number} className="flex items-center gap-3 rounded-xl border border-navy/10 bg-cream p-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">{number}</span><div className="min-w-0 flex-1"><p className="font-display text-lg leading-tight">{title}</p><p className="mt-0.5 text-xs text-ink/60">{places}</p></div><MapPin className="size-4 shrink-0 text-orange-deep" /></div>)}
            </div>
            <p className="mt-5 border-t border-navy/10 pt-4 text-sm leading-relaxed text-ink/65">Every package is a starting point. We can shape the route around your dates and group.</p>
          </div>
        </div>
      </div>
    </header>
    <div id="trip-ideas"><Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-16 text-ink/60">Finding trip ideas...</div>}><PackageResults searchParams={searchParams} /></Suspense></div>
  </main>;
}

async function PackageResults({ searchParams }: { searchParams: Search }) {
  const { q, destination, collection } = await searchParams;
  await connection();
  await connectDB();
  const managedPackages = await Package.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean();
  const trips: DisplayTrip[] = managedPackages.length ? managedPackages.map((pkg) => ({
    slug: pkg.slug, name: pkg.title, days: `${pkg.days} Days / ${pkg.nights} Nights`,
    price: pkg.price > 0 ? `${pkg.startingFrom ? "From " : ""}₹${pkg.price.toLocaleString("en-IN")}` : "Price on request",
    tag: pkg.badge || pkg.category, destinations: pkg.destinations, collections: pkg.collections,
    intro: pkg.shortDescription, details: pkg.highlights as string[], images: pkg.images as string[],
  })) : tripPackages.map((pkg) => ({ ...pkg, images: [] as string[] }));
  const normalizedQuery = q?.trim().toLowerCase();
  const filtered = trips.filter((trip) => {
    const textMatches = !normalizedQuery || `${trip.name} ${trip.place ?? trip.destinations.join(" ")} ${trip.intro}`.toLowerCase().includes(normalizedQuery);
    const destinationMatches = !destination || trip.destinations.some((stop) => stop.toLowerCase().replaceAll(" ", "-") === destination || (destination === "katra-vaishno-devi" && stop === "Katra"));
    const collectionMatches = !collection || trip.collections.some((item) => item === collection);
    return textMatches && destinationMatches && collectionMatches;
  });
  return <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16"><p className="mb-5 text-sm text-ink/60">{filtered.length} trip {filtered.length === 1 ? "idea" : "ideas"} {destination || collection || q ? "match your search" : "to explore"}</p>{filtered.length ? <div className="grid gap-5 md:grid-cols-3">{filtered.map((pkg) => <article key={pkg.slug} className="package-card"><div className={`package-cover ${pkg.style || "package-valley"}`}>{pkg.images[0] && <Image src={pkg.images[0]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}<span className="package-chip">{pkg.tag}</span>{!pkg.images[0] && <span className="photo-placeholder"><Sparkles className="size-3" />Photo to come</span>}<span className="cover-place">{pkg.destinations[0]}</span></div><div className="p-5"><p className="eyebrow">{pkg.days}</p><h2 className="mt-2 font-display text-2xl text-navy">{pkg.name}</h2><p className="mt-3 text-sm leading-relaxed text-ink/65">{pkg.intro}</p><p className="mt-3 text-sm font-semibold text-navy">{pkg.price}</p><PackageEngagement slug={pkg.slug} initialCounts={{ likes: 0, views: 0, shares: 0 }} /><div className="mt-4 flex flex-wrap gap-2">{pkg.details.map((x) => <span key={x} className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1.5 text-xs text-navy"><Check className="size-3" />{x}</span>)}</div><Link href={`/packages/${pkg.slug}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-navy/10 font-semibold text-navy">Explore this trip <ArrowRight className="size-4" /></Link><a href={whatsappHref(`Hi Plan My Trip, please share options for ${pkg.name}.`)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-white"><WhatsAppIcon className="size-4" />Enquire on WhatsApp</a></div></article>)}</div> : <div className="rounded-2xl bg-cream p-8 text-center"><h2 className="font-display text-2xl text-navy">No matching trip ideas yet.</h2><p className="mt-2 text-sm text-ink/65">Tell us what you have in mind and we can help shape a route.</p><Link href="/contact" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-sun px-5 font-semibold text-ink">Talk to our team</Link></div>}</div>;
}




