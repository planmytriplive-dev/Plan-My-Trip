import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Services in Katra, Kashmir & Himachal",
  description: "Explore trip planning, stays and local transport support for Vaishno Devi yatra, Kashmir tours and Himachal holidays.",
  alternates: { canonical: "/services" },
};

const services = [
  ["Vaishno Devi yatra planning", "Plan a Katra stay, local transfers and yatra-day arrangements around your travel dates."],
  ["Kashmir tour planning", "Connect Srinagar, Gulmarg, Pahalgam and Sonamarg at a pace that suits your group."],
  ["Himachal holiday planning", "Plan a hill-station route through Shimla, Manali, Dharamshala or other Himachal destinations."],
  ["Hotel and stay options", "Discuss stay styles and locations for your route and budget."],
  ["Cab and local transport", "Ask about local transfers and travel between the places on your itinerary."],
  ["Multi-region trips", "Bring a Vaishno Devi yatra, Kashmir tour or Himachal holiday together in one considered route."],
];

export default function ServicesPage() {
  return <main>
    <header className="relative isolate overflow-hidden bg-navy text-white">
      <Image src="/images/katra_to_kashmir.png" alt="A mountain road connecting Himalayan destinations" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/35" />
      <div className="mx-auto grid min-h-[610px] max-w-7xl items-center gap-12 px-5 py-14 md:min-h-[660px] md:grid-cols-[1.1fr_.9fr] md:px-8 md:py-20">
        <div className="max-w-3xl">

          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">More than a route.<br /><span className="text-sun">A trip that fits you.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">From a Vaishno Devi yatra to Kashmir valleys and Himachal hills, one local team can help bring the details together.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-sun px-5 font-bold text-ink transition hover:bg-sun-hover">Tell us what you have in mind <ArrowRight className="size-4" /></Link>
            <Link href="/packages" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/35 bg-white/10 px-5 font-semibold text-white backdrop-blur transition hover:bg-white/20">Explore trip ideas</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/75">
            <span className="inline-flex items-center gap-2"><Check className="size-4 text-sun" /> A plan shaped around your dates</span>
            <span className="inline-flex items-center gap-2"><Check className="size-4 text-sun" /> Local help from Katra</span>
          </div>
        </div>
        <div className="w-full max-w-md justify-self-start md:justify-self-end">
          <div className="rounded-3xl border border-white/40 bg-white/95 p-5 text-navy shadow-[0_28px_80px_rgba(0,0,0,.28)] backdrop-blur-md sm:p-7">
            <div className="flex items-center justify-between gap-4"><span className="eyebrow text-orange-deep">Your journey, thoughtfully planned</span><span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun/25"><Compass className="size-5 text-navy" /></span></div>
            <h2 className="mt-3 font-display text-2xl leading-tight md:text-3xl">Three regions.<br />One connected plan.</h2>
            <div className="mt-6 space-y-3">
              {[["01", "Jammu", "Yatra days and local stays"], ["02", "Kashmir", "Lake towns and open valleys"], ["03", "Himachal", "Hill towns and mountain routes"]].map(([number, region, detail]) => <div key={number} className="flex items-center gap-3 rounded-xl border border-navy/10 bg-cream p-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">{number}</span><div className="min-w-0 flex-1"><p className="font-display text-lg leading-tight">{region}</p><p className="mt-0.5 text-xs text-ink/60">{detail}</p></div><MapPin className="size-4 shrink-0 text-orange-deep" /></div>)}
            </div>
            <p className="mt-5 border-t border-navy/10 pt-4 text-sm leading-relaxed text-ink/65">Start with the places you care about. We’ll help you work through the route, stays and transfers.</p>
          </div>
        </div>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      {services.map(([title, text]) => <article key={title} className="grid gap-2 border-b border-navy/10 py-6 md:grid-cols-[18rem_1fr] md:gap-8"><h2 className="font-display text-xl text-navy">{title}</h2><p className="text-ink/70">{text}</p></article>)}
      <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-sun px-5 font-semibold text-ink">Ask about your trip <ArrowRight className="size-4" /></Link>
    </div>
  </main>;
}
