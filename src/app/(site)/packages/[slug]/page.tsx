import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MapPin, Sparkles } from "lucide-react";
import { tripPackages } from "@/lib/travel-content";
import { site, telHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { connectDB } from "@/lib/db";
import { Package } from "@/models/Package";
import { PackageEngagement } from "@/components/packages/PackageEngagement";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return tripPackages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = tripPackages.find((item) => item.slug === slug);
  return trip ? { title: trip.name, description: trip.intro } : { title: "Tour package", description: "Explore a custom travel package from Plan My Trip." };
}

export default function PackageDetail({ params }: Props) {
  return <Suspense fallback={<main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-16 text-ink/60">Loading trip details...</main>}><PackageDetailContent params={params} /></Suspense>;
}

async function PackageDetailContent({ params }: Props) {
  const { slug } = await params;
  await connection();
  await connectDB();
  const managed = await Package.findOne({ slug, published: true }).lean();
  if (managed) return <ManagedPackageDetail trip={managed} />;
  const trip = tripPackages.find((item) => item.slug === slug);
  if (!trip) notFound();
  const stops = [...trip.destinations];
  const itinerary = trip.destinations.map((stop, index) => ({ day: index + 1, stop, text: `Spend time in ${stop}. We’ll confirm your stay, transport, and day plan based on your dates and preferences.` }));
  return <main><div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12"><p className="text-sm text-ink/55"><Link href="/packages" className="hover:text-navy">Packages</Link> / {trip.name}</p><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_21rem]">
    <div><div className={`detail-cover ${trip.style}`}><span className="photo-placeholder"><Sparkles className="size-3"/>Original destination photography needed</span><div><span className="eyebrow text-white/80">{trip.days}</span><h1 className="mt-2 font-display text-4xl text-white md:text-6xl">{trip.name}</h1></div></div>
      <div className="mt-8 grid grid-cols-3 gap-3">{trip.destinations.map((stop, i) => <div key={stop} className={`detail-thumb detail-thumb-${i}`}><Sparkles className="size-4 text-white/75"/><span className="photo-placeholder">{stop}</span></div>)}</div>
      <section className="py-10"><span className="eyebrow">A route to begin with</span><h2 className="mt-2 font-display text-3xl text-navy">{trip.name}, made your way</h2><p className="mt-4 max-w-2xl leading-relaxed text-ink/65">{trip.intro} The outline below is a starting point; the final itinerary and inclusions are confirmed with your quote.</p><div className="mt-5 flex flex-wrap gap-2">{trip.details.map((x) => <span key={x} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-2 text-xs text-navy"><Check className="size-3"/>{x}</span>)}</div></section>
      <section className="border-t border-navy/10 py-9"><span className="eyebrow">Your days, at a glance</span><h2 className="mt-2 font-display text-3xl text-navy">A flexible itinerary</h2><div className="mt-5 divide-y divide-navy/10">{itinerary.map((day) => <details key={day.day} className="faq-row" open={day.day === 1}><summary><span><span className="mr-3 text-xs font-bold uppercase tracking-wider text-orange-deep">Day {day.day}</span>{day.stop}</span><span className="faq-plus"/></summary><p>{day.text}</p></details>)}</div></section>
      <section className="border-t border-navy/10 py-9"><span className="eyebrow">Know what’s covered</span><h2 className="mt-2 font-display text-3xl text-navy">Inclusions & exclusions</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-mist p-5"><h3 className="font-semibold text-navy">To confirm in your quote</h3><ul className="mt-3 space-y-2 text-sm text-ink/70">{[...trip.details, "Exact stays and room category", "Transport type and route"].map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-orange-deep"/>{x}</li>)}</ul></div><div className="rounded-2xl border border-navy/10 p-5"><h3 className="font-semibold text-navy">Usually arranged separately</h3><ul className="mt-3 space-y-2 text-sm text-ink/70">{["Personal expenses", "Meals unless listed in the quote", "Entry tickets and activities unless listed", "Anything not written in your final itinerary"].map((x) => <li key={x} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange"/>{x}</li>)}</ul></div></div></section>
      <section className="route-map"><div className="route-line"/><span className="eyebrow text-white/70">Your route</span><h2 className="mt-2 font-display text-3xl text-white">A journey through {trip.destinations.length} {trip.destinations.length === 1 ? "stop" : "stops"}</h2><div className="relative mt-7 flex flex-wrap gap-3">{stops.map((stop, i) => <div key={stop} className="route-stop"><span className="route-dot">{i + 1}</span><span className="text-sm font-semibold text-white">{stop}</span></div>)}</div><p className="mt-4 text-xs text-white/60">Route and travel times are confirmed with your final plan.</p><MapPin className="absolute right-6 top-7 size-6 text-white/45"/></section>
      <section className="py-10"><span className="eyebrow">You may also like</span><h2 className="mt-2 font-display text-3xl text-navy">More ways to see the region</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{tripPackages.filter((item) => item.slug !== trip.slug).map((item) => <Link key={item.slug} href={`/packages/${item.slug}`} className="rounded-2xl border border-navy/10 p-5 transition-colors hover:bg-mist"><span className="eyebrow">{item.days}</span><h3 className="mt-2 font-display text-xl text-navy">{item.name}</h3><p className="mt-2 text-sm text-ink/60">{item.price}</p><span className="mt-3 inline-flex items-center text-sm font-semibold text-orange-deep">See trip <ArrowRight className="ml-2 size-4"/></span></Link>)}</div></section>
      <section className="border-t border-navy/10 py-8"><h2 className="font-display text-2xl text-navy">A few quick answers</h2>{[["Can this itinerary be changed?","Yes. This is a starting route. Share your dates and preferences and we’ll discuss a tailored plan."],["How much does this trip cost?","The price depends on dates, group size, stay choice and transport. Contact us for a quote."],["How do I book?",`Call or WhatsApp ${site.phoneDisplay} to discuss availability and next steps.`]].map(([q,a])=><details key={q} className="faq-row"><summary>{q}<span className="faq-plus"/></summary><p>{a}</p></details>)}</section>
    </div>
    <aside className="h-fit rounded-3xl border border-navy/10 bg-white p-5 shadow-[0_12px_42px_rgba(7,27,61,.08)] lg:sticky lg:top-28"><span className="eyebrow">Plan this trip</span><p className="mt-3 font-display text-3xl text-navy">{trip.price}</p><PackageEngagement slug={trip.slug} initialCounts={{ likes: 0, views: 0, shares: 0 }} /><p className="mt-1 text-sm text-ink/60">{trip.days} · Tailored to your dates</p><div className="mt-5 space-y-2"><a href={whatsappHref(`Hi Plan My Trip, I would like to plan the ${trip.name} trip. Please share availability and a quote.`)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 font-semibold text-white"><WhatsAppIcon className="size-5"/> Ask on WhatsApp</a><a href={telHref} className="flex min-h-12 items-center justify-center rounded-xl bg-orange px-4 font-semibold text-white">Call {site.phoneDisplay}</a></div><p className="mt-4 text-xs leading-relaxed text-ink/55">No fixed price shown until we know your travel dates, group size and preferred stay.</p></aside>
    </div></div></main>;
}

function ManagedPackageDetail({ trip }: { trip: Awaited<ReturnType<typeof Package.findOne>> & { title: string } }) {
  if (!trip) notFound();
  const price = trip.price > 0 ? `${trip.startingFrom ? "From " : ""}₹${trip.price.toLocaleString("en-IN")}` : "Price on request";
  return <main><div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12"><p className="text-sm text-ink/55"><Link href="/packages" className="hover:text-navy">Packages</Link> / {trip.title}</p><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_21rem]">
    <div><div className="relative flex min-h-[24rem] items-end overflow-hidden rounded-3xl bg-navy p-7 md:p-12">{trip.images[0] && <Image src={trip.images[0]} alt={trip.title} fill priority className="object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"/><div className="relative z-10"><span className="eyebrow text-white/80">{trip.badge || trip.category} · {trip.days} Days / {trip.nights} Nights</span><h1 className="mt-3 max-w-3xl font-display text-4xl text-white md:text-6xl">{trip.title}</h1></div></div>
      {trip.images.length > 1 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{trip.images.slice(1).map((url: string, index: number) => <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={url} alt={`${trip.title} photo ${index + 2}`} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" /></div>)}</div>}
      <section className="py-10"><span className="eyebrow">A route to begin with</span><h2 className="mt-2 font-display text-3xl text-navy">{trip.title}, made your way</h2><p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-ink/65">{trip.description || trip.shortDescription}</p>{trip.highlights.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{trip.highlights.map((item: string) => <span key={item} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-2 text-xs text-navy"><Check className="size-3"/>{item}</span>)}</div>}</section>
      {(trip.inclusions.length > 0 || trip.exclusions.length > 0) && <section className="grid gap-4 border-t border-navy/10 py-8 sm:grid-cols-2">{trip.inclusions.length > 0 && <div><h2 className="font-display text-2xl text-navy">Included</h2><ul className="mt-3 space-y-2 text-sm text-ink/70">{trip.inclusions.map((item: string) => <li key={item}>✓ {item}</li>)}</ul></div>}{trip.exclusions.length > 0 && <div><h2 className="font-display text-2xl text-navy">Not included</h2><ul className="mt-3 space-y-2 text-sm text-ink/70">{trip.exclusions.map((item: string) => <li key={item}>· {item}</li>)}</ul></div>}</section>}
      {trip.itinerary.length > 0 && <section className="border-t border-navy/10 py-8"><h2 className="font-display text-3xl text-navy">Day by day</h2><div className="mt-4 divide-y divide-navy/10">{trip.itinerary.map((day: { day: number; title: string; description: string }) => <div key={day.day} className="py-4"><h3 className="font-semibold text-navy">Day {day.day}: {day.title}</h3><p className="mt-1 text-sm text-ink/65">{day.description}</p></div>)}</div></section>}
      <div className="route-map"><span className="eyebrow text-white/70">Your route</span><h2 className="mt-2 font-display text-3xl text-white">{trip.destinations.join(" · ")}</h2></div>
    </div>
    <aside className="h-fit rounded-3xl border border-navy/10 bg-white p-5 shadow-[0_12px_42px_rgba(7,27,61,.08)] lg:sticky lg:top-28"><span className="eyebrow">Plan this trip</span><p className="mt-3 font-display text-3xl text-navy">{price}</p><PackageEngagement slug={trip.slug} initialCounts={{ likes: 0, views: 0, shares: 0 }} /><p className="mt-1 text-sm text-ink/60">{trip.days} days · Tailored to your dates</p><div className="mt-5 space-y-2"><a href={whatsappHref(`Hi Plan My Trip, I would like to plan the ${trip.title} trip. Please share availability and a quote.`)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 font-semibold text-white"><WhatsAppIcon className="size-5"/> Ask on WhatsApp</a><a href={telHref} className="flex min-h-12 items-center justify-center rounded-xl bg-orange px-4 font-semibold text-white">Call {site.phoneDisplay}</a></div><p className="mt-4 text-xs leading-relaxed text-ink/55">Final price and itinerary are confirmed for your travel dates and group.</p></aside>
  </div></div></main>;
}


