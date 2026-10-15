import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, MapPin, Mountain, ShieldCheck, Sparkles } from "lucide-react";
import { site, telHref, whatsappHref } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeCombinedPackageCards, HomePackageCards } from "@/components/home/HomePackageCards";

export const metadata: Metadata = {
  title: { absolute: "Travel Agency in Katra | Kashmir, Himachal & Vaishno Devi Trips | Plan My Trip" },
  description: "Plan a Vaishno Devi yatra, Kashmir tour or Himachal holiday with Plan My Trip. Call or WhatsApp 70062 98659 to discuss your dates and plans.",
  alternates: { canonical: "/" },
};

const moodCards = [
  { name: "Katra", note: "The beginning of your yatra", mark: "01", scene: "scene-katra", icon: "Pilgrimage", image: "/images/katra-vaishno-devi-hero.png" },
  { name: "Srinagar", note: "Slow mornings by the lake", mark: "02", scene: "scene-srinagar", icon: "Lakeside", image: "/images/srinagar-dal-lake.png" },
  { name: "Gulmarg", note: "Alpine air and open meadows", mark: "03", scene: "scene-gulmarg", icon: "Mountain", image: "/images/gulmarg-meadows.png" },
  { name: "Pahalgam", note: "A valley made for lingering", mark: "04", scene: "scene-pahalgam", icon: "Valley", image: "/images/pahalgam.png" },
  { name: "Sonamarg", note: "High country, wide horizons", mark: "05", scene: "scene-sonamarg", icon: "High country", image: "/images/sonamarg-glacier.png" },
];

const regionalMoodCards = {
  jammu: [
    { name: "Jammu", note: "Temples and Tawi views", mark: "01", icon: "City", image: "/images/jammu.png", href: "jammu" },
    { name: "Katra & Vaishno Devi", note: "Begin your pilgrimage", mark: "02", icon: "Pilgrimage", image: "/images/katra-vaishno-devi-hero.png", href: "katra-vaishno-devi" },
    { name: "Patnitop & Sanasar", note: "Pine forests and hilltop air", mark: "03", icon: "High country", image: "/images/Patnitop,%20Nathatop%20%26%20Sanasar.jpeg", href: "patnitop-sanasar" },
    { name: "Reasi & Shiv Khori", note: "A sacred cave and river country", mark: "04", icon: "Pilgrimage", image: "/images/Reasi%20%26%20Shiv%20Khori.png", href: "shiv-khori-reasi" },
    { name: "Bhaderwah & Jai Valley", note: "Meadows beneath the mountains", mark: "05", icon: "Valley", image: "/images/Bhaderwah%20%26%20Jai%20Valley.jpg", href: "bhaderwah" },
  ],
  himachal: [
    { name: "Shimla", note: "Heritage streets and cedar hills", mark: "01", icon: "Hill town", image: "/images/himachal_landscape.png", href: "shimla" },
    { name: "Manali & Solang", note: "River valley and mountain days", mark: "02", icon: "Mountain", image: "/images/Manali%20to%20Solang.png", href: "manali" },
    { name: "Dharamshala & McLeod Ganj", note: "Mountain views and Tibetan culture", mark: "03", icon: "Culture", image: "/images/Dharamshala%20%26%20McLeod%20Ganj.png", href: "dharamshala-mcleodganj" },
    { name: "Dalhousie & Khajjiar", note: "Colonial hills and open meadows", mark: "04", icon: "Meadows", image: "/images/Dalhousie%20%26%20Khajjiar.png", href: "dalhousie-khajjiar" },
    { name: "Spiti Valley", note: "High desert and ancient monasteries", mark: "05", icon: "High country", image: "/images/spiti%20valley.png", href: "spiti-valley" },
  ],
};

function MoodSection({ title, eyebrow, description, cards }: { title: string; eyebrow: string; description: string; cards: { name: string; note: string; mark: string; icon: string; image: string; href: string }[] }) {
  return <section className="mood-section"><div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"><Reveal><div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">{title}</h2></div><p className="max-w-sm text-ink/65">{description}</p></div></Reveal>
    <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{cards.map((place, i) => <Reveal key={place.name} delay={i * .045}><Link href={`/destinations/${place.href}`} className="mood-card"><Image src={place.image} alt="" fill sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 20vw" className="mood-photo"/><span className="mood-no">{place.mark}</span><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-white/65">{place.icon}</span><h3 className="mt-1 font-display text-2xl text-white">{place.name}</h3><p className="mt-1 text-xs text-white/75">{place.note}</p></div><ArrowRight className="mood-arrow size-5" /></Link></Reveal>)}</div>
  </div></section>;
}

const story = [
  { n: "01", title: "Start with a conversation", text: "Share your travel dates, who is coming and what you want the days to feel like.", icon: Compass },
  { n: "02", title: "Shape the right route", text: "We suggest a practical itinerary with clear inclusions, travel times and stay options.", icon: MapPin },
  { n: "03", title: "Travel with local support", text: "Your Katra-based team stays in touch as your plans take shape and you travel.", icon: ShieldCheck },
];

const homeFaqs = [
  ["Which is the best travel agency in Katra for Vaishno Devi yatra?", "Compare local experience, a clear itinerary, written inclusions and exclusions, and the support available during your trip. Ask us for a plan and decide if it fits your needs."],
  ["How do I contact a travel agent in Katra?", `Call or WhatsApp Plan My Trip at ${site.phoneDisplay} to discuss your dates, group size and route.`],
  ["How much does a Kashmir tour package from Katra cost?", "The cost depends on travel dates, group size, route, stays and transport. Share those details to request a tailored quote."],
  ["Which are the top travel agents in Srinagar?", "We can’t verify a ranking of travel agents in Srinagar. Check current reviews, registration details and written trip terms before choosing an agency."],
  ["What is the best time to visit Kashmir?", "Conditions vary by season and route. Tell us when you plan to travel so we can discuss the places and access relevant to those dates."],
  ["How many days are enough for Kashmir?", "It depends on which places you want to include and how quickly you prefer to travel. Share your route interests and dates for a practical itinerary suggestion."],
] as const;

function ExpertCallout({ tone = "light" }: { tone?: "light" | "dark" }) {
  return <section className={`expert-callout ${tone === "dark" ? "expert-callout-dark" : ""}`}>
    <div><span className="eyebrow">A real person, right here in Katra</span><h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">Good trips begin with<br className="hidden md:block" /> a good conversation.</h2><p className="mt-3 text-sm opacity-75">Talk through your dates, route or yatra plans with our team.</p><p className="mt-3 text-lg font-semibold">{site.phoneDisplay}</p></div>
    <div className="flex flex-col gap-2 sm:flex-row"><a href={telHref} className="action-primary">Call our team</a><a href={whatsappHref("Hi Plan My Trip, I would like to talk through a trip plan.")} target="_blank" rel="noopener noreferrer" className="action-secondary"><WhatsAppIcon className="size-5" /> WhatsApp us</a></div>
  </section>;
}

export default function Home() {
  return <main>
    <aside className="home-trip-rail" aria-label="Plan My Trip: Katra travel planning, Vaishno Devi yatra, Kashmir and Himachal journeys"><div className="home-trip-rail-track"><span>PLAN MY TRIP · YOUR KATRA TRAVEL PLANNING TEAM · VAISHNO DEVI YATRA · KASHMIR & HIMACHAL JOURNEYS · THOUGHTFUL ITINERARIES · LOCAL SUPPORT FOR YOUR JOURNEY · </span><span aria-hidden="true">PLAN MY TRIP · YOUR KATRA TRAVEL PLANNING TEAM · VAISHNO DEVI YATRA · KASHMIR & HIMACHAL JOURNEYS · THOUGHTFUL ITINERARIES · LOCAL SUPPORT FOR YOUR JOURNEY · </span></div></aside>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }) }} />
    <HeroSlider />

    <section className="promo-grid" aria-label="Explore Plan My Trip">
      <Link href="/packages" className="promo-tile promo-offer"><Image src="/images/vaishno-devi-yatra.png" alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="promo-photo"/><span>Explore our trips</span><strong>Find a journey<br/>to remember</strong><span className="promo-cta">Browse packages</span></Link>
      <Link href="/destinations/srinagar" className="promo-tile promo-kashmir"><Image src="/images/srinagar-dal-lake.png" alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="promo-photo"/><span>Your next escape</span><strong>Kashmir</strong><span className="promo-cta">Take a look</span></Link>
      <Link href="/destinations/katra-vaishno-devi" className="promo-tile promo-yatra"><Image src="/images/katra-travel-expert.png" alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="promo-photo"/><span>Devotion</span><strong>Vaishno Devi</strong><span className="promo-cta">Plan your yatra</span></Link>
      <Link href="/destinations/gulmarg" className="promo-tile promo-gulmarg"><Image src="/images/gulmarg-meadows.png" alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="promo-photo"/><span>Snow & adventure</span><strong>Gulmarg</strong><span className="promo-cta">Find your trip</span></Link>
      <Link href="/destinations/shimla" className="promo-tile promo-himachal"><Image src="/images/himachal_landscape.png" alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="promo-photo"/><span>Mountain escapes</span><strong>Himachal</strong><span className="promo-cta">Explore Himachal</span></Link>
    </section>

    <section className="answer-first mx-auto max-w-4xl px-5 py-12 text-center md:px-8"><p>Plan My Trip is a travel agency in Katra arranging Vaishno Devi yatra packages, Kashmir tours and Himachal holidays to destinations such as Shimla and Manali. We can help with trip planning, stays and local transport. To discuss your dates and group size, call or WhatsApp {site.phoneDisplay}.</p></section>

    <section aria-label="Travel planning with Plan My Trip" className="trust-strip trust-strip-cream">
      <div><span className="trust-icon"><MapPin className="size-4" /></span><div><strong>Local experts in Katra</strong><small>Talk with a local planner from your first question.</small></div></div>
      <div><span className="trust-icon"><ShieldCheck className="size-4" /></span><div><strong>Clear plans and terms</strong><small>Review itinerary and inclusions before you pay.</small></div></div>
      <div><span className="trust-icon"><Compass className="size-4" /></span><div><strong>Routes shaped around you</strong><small>Choose the places and pace that fit your trip.</small></div></div>
    </section>

    <section id="journeys" className="section-space mx-auto max-w-7xl px-5 md:px-8">
      <Reveal><div className="section-heading"><div><span className="eyebrow">Suggested trips</span><h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-navy md:text-5xl">Wander-must</h2></div><p className="max-w-sm text-ink/65">Start with a route we know well. We’ll help you make it fit the way you want to travel.</p></div></Reveal>
      <nav aria-label="Filter trip ideas" className="mt-6 flex snap-x gap-2 overflow-x-auto pb-2">{[["Pilgrimage","pilgrimage"],["Kashmir circuits","kashmir"],["Himachal trips","himachal"],["Honeymoon","honeymoon"],["Family","family"]].map(([label, slug], i)=><Link key={slug} href={`/packages?collection=${slug}`} aria-current={i === 0 ? "true" : undefined} className={`shrink-0 rounded-lg border px-4 py-2.5 text-sm font-semibold ${i === 0 ? "border-sun bg-sun text-ink" : "border-ink/20 text-ink hover:border-sun"}`}>{label}</Link>)}</nav>
      <Suspense fallback={<div className="mt-9 grid min-h-72 gap-5 md:grid-cols-3"><div className="package-card" /><div className="package-card hidden md:block" /><div className="package-card hidden md:block" /></div>}><HomePackageCards /></Suspense>
      <p className="mt-4 text-xs text-ink/45">Package pricing depends on travel dates, group size and stay choice. Ask us for a tailored quote.</p>
    </section>

    <MoodSection title="Find your kind of Kashmir." eyebrow="Five places, five different feelings" description="Quiet lake mornings, open meadows, mountain air or the start of a yatra. Where would you like to begin?" cards={moodCards.map((place) => ({ ...place, href: place.name.toLowerCase() === "katra" ? "katra-vaishno-devi" : place.name.toLowerCase() }))} />
    <MoodSection title="Find your kind of Jammu." eyebrow="Pilgrimage, lakes and mountain valleys" description="From Vaishno Devi and Shiv Khori to quiet lakes, pine hills and high valleys, explore the places that make Jammu your kind of trip." cards={regionalMoodCards.jammu} />
    <MoodSection title="Find your kind of Himachal." eyebrow="Choose your mountain escape" description="Discover Himachal’s hill towns, river valleys, high deserts, forest trails and lakeside routes, with a photo matched to each destination." cards={regionalMoodCards.himachal} />

    <section className="about-split"><Reveal><div className="story-art"><Image src="/images/about_image.png" alt="A scenic Himalayan landscape representing the trips we help plan" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover"/><div className="story-art-orbit"/><div className="story-art-label"><Mountain className="size-5"/><span>Local knowledge<br />for the long way round</span></div></div></Reveal><Reveal><div className="about-copy"><span className="eyebrow">A thoughtful way to travel</span><h2 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">Planning your trip is personal for us. We’re here to get it right.</h2><p className="mt-5 leading-relaxed text-ink/75">We’re a Katra-based travel team here to make the details feel easier. Tell us what matters to you; we’ll help connect the right stays, drives and days together.</p><ol className="mt-7 space-y-5">{story.map(({ n, title, text, icon: Icon }) => <li key={n} className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-navy"><Icon className="size-4" /></span><div><p className="text-xs font-bold uppercase tracking-[.12em] text-orange-deep">{n}</p><h3 className="mt-1 font-semibold text-navy">{title}</h3><p className="mt-1 text-sm leading-relaxed text-ink/75">{text}</p></div></li>)}</ol><Link href="/about" className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-ink px-5 font-semibold text-white">About us</Link></div></Reveal></section>

    <section className="holiday-section"><div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20"><Reveal><div className="section-heading"><div><span className="eyebrow">Trip types</span><h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">Experience everything, miss nothing.</h2></div><p className="max-w-sm text-ink/65">Choose a way to travel, and we’ll help you find the right places and pace.</p></div></Reveal><div className="holiday-grid mt-8">{[
      { title: "Vaishno Devi Yatra", slug: "pilgrimage", style: "holiday-yatra", href: "/packages?collection=pilgrimage", image: "/images/vaishno-devi-yatra.png" },
      { title: "Family Tours", slug: "family", style: "holiday-family", href: "/packages?collection=family", image: "/images/Manali%20to%20Solang.png" },
      { title: "Honeymoon", slug: "honeymoon", style: "holiday-honeymoon", href: "/packages?collection=honeymoon", image: "/images/pahalgam.png" },
      { title: "Snow & Adventure", slug: "snow", style: "holiday-snow", href: "/packages?collection=snow", image: "/images/gulmarg-meadows.png" },
      { title: "Himachal Hill Stations", slug: "himachal", style: "holiday-himachal", href: "/packages?collection=himachal", image: "/images/himachal_landscape.png" },
      { title: "Houseboats & Lakes", slug: "kashmir", style: "holiday-houseboat", href: "/packages?destination=srinagar", image: "/images/srinagar-dal-lake.png" },
      { title: "Cab and Taxi", slug: "services", style: "holiday-cab", href: "/services", image: "/images/katra_to_kashmir.png" },
    ].map(({ title, slug, style, href, image }) => <Link key={slug} href={href} className={`holiday-card ${style}`}><Image src={image} alt="" fill sizes="(max-width: 767px) 50vw, (max-width: 1199px) 25vw, 22vw" className="holiday-photo"/><span className="eyebrow text-white/75">{slug.replace("-", " ")}</span><h3 className="mt-auto font-display text-2xl text-white">{title}</h3></Link>)}</div></div></section>

    <div className="mx-auto max-w-7xl px-5 pb-8 md:px-8"><ExpertCallout /></div>

    <section className="faq-section"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[.8fr_1.2fr] md:px-8 md:py-24"><Reveal><span className="eyebrow">Before you set off</span><h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">A few useful things to know.</h2><p className="mt-4 max-w-sm text-ink/65">Have a question about your route? Call us and we’ll talk it through.</p><a href={telHref} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-orange-deep">{site.phoneDisplay} <ArrowRight className="ml-2 size-4" /></a></Reveal><div className="divide-y divide-navy/10 border-y border-navy/10">{homeFaqs.map(([question, answer]) => <details key={question} className="faq-row group"><summary>{question}<span className="faq-plus" /></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="combined-section"><div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20"><Reveal><span className="eyebrow">Combined trips</span><h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">Roam, sweet roam.</h2><p className="mt-3 max-w-xl text-ink/65">Bring Katra and Kashmir together. These route ideas can be shaped around your travel dates.</p></Reveal><Suspense fallback={<div className="mt-7 min-h-64" />}><HomeCombinedPackageCards /></Suspense></div></section>

    <section className="review-empty"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8 md:py-20"><div><span className="eyebrow">Traveller reviews</span><h2 className="mt-3 font-display text-4xl text-navy">What travellers say.</h2><p className="mt-3 text-ink/65">Read and share reviews from travellers who have explored with us.</p></div><Link href="/reviews" className="inline-flex min-h-11 items-center rounded-lg border-2 border-ink px-5 font-semibold text-ink">Be the first to review</Link></div></section>

    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8"><ExpertCallout tone="dark" /></div>
  </main>;
}
