import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import { Package } from "@/models/Package";
import { tripPackages } from "@/lib/travel-content";
import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Reveal } from "@/components/ui/Reveal";
import { PackageEngagement } from "@/components/packages/PackageEngagement";

function combinedTripImage(destinations: readonly string[]) {
  const route = destinations.join(" ").toLowerCase();
  if (route.includes("himachal") || route.includes("shimla") || route.includes("manali")) return "/images/Manali%20to%20Solang.png";
  if (route.includes("jammu") || route.includes("patnitop") || route.includes("katra")) return "/images/Patnitop,%20Nathatop%20%26%20Sanasar.jpeg";
  if (route.includes("pahalgam")) return "/images/pahalgam.png";
  return "/images/srinagar-dal-lake.png";
}

export async function HomePackageCards() {
  await connection();
  await connectDB();
  const packages = await Package.find({ published: true }).sort({ featured: -1, createdAt: -1 }).limit(6).lean();

  if (!packages.length) {
    return <div className="mt-9 grid gap-5 md:grid-cols-3">{tripPackages.map((pkg, i) => <Reveal key={pkg.slug} delay={i * .07}><article className="package-card group">
      <div className={`package-cover ${pkg.style}`}><span className="package-chip">{pkg.tag}</span><span className="photo-placeholder"><Sparkles className="size-3" /> Destination photography</span><span className="cover-place">{pkg.place.split(" · ")[0]}</span></div>
      <div className="p-5 md:p-6"><span className="eyebrow text-orange-deep">{pkg.days}</span><h3 className="mt-2 font-display text-2xl leading-tight text-navy">{pkg.name}</h3><p className="mt-3 text-sm text-ink/60">{pkg.price}</p><PackageEngagement slug={pkg.slug} initialCounts={{ likes: 0, views: 0, shares: 0 }} /><div className="mt-4 flex flex-wrap gap-2">{pkg.details.map((detail) => <span key={detail} className="inline-flex items-center gap-1 rounded-full bg-[#f6f5f1] px-2.5 py-1.5 text-xs text-ink/70"><Check className="size-3 text-orange-deep" />{detail}</span>)}</div><Link href={`/packages/${pkg.slug}`} className="mt-5 flex min-h-11 items-center justify-center rounded-xl border border-navy/10 text-sm font-semibold text-navy">View trip details <ArrowRight className="ml-2 size-4" /></Link><a href={whatsappHref(`Hi Plan My Trip, please share details for the ${pkg.name} package.`)} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white"><WhatsAppIcon className="size-4" /> Enquire on WhatsApp</a></div>
    </article></Reveal>)}</div>;
  }

  return <div className="mt-9 grid gap-5 md:grid-cols-3">{packages.map((pkg, index) => <Reveal key={String(pkg._id)} delay={index * .07}><article className="package-card group">
    <div className="package-cover package-valley">{pkg.images[0] && <Image src={pkg.images[0]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}<span className="package-chip">{pkg.badge || pkg.category}</span><span className="cover-place">{pkg.destinations[0]}</span></div>
    <div className="p-5 md:p-6"><span className="eyebrow text-orange-deep">{pkg.days} Days / {pkg.nights} Nights</span><h3 className="mt-2 font-display text-2xl leading-tight text-navy">{pkg.title}</h3><p className="mt-3 line-clamp-2 text-sm text-ink/60">{pkg.shortDescription}</p><p className="mt-3 text-sm font-semibold text-navy">{pkg.price > 0 ? `${pkg.startingFrom ? "From " : ""}₹${pkg.price.toLocaleString("en-IN")}` : "Price on request"}</p><PackageEngagement slug={pkg.slug} initialCounts={{ likes: 0, views: 0, shares: 0 }} /><div className="mt-4 flex flex-wrap gap-2">{pkg.highlights.slice(0, 3).map((highlight: string) => <span key={highlight} className="inline-flex items-center gap-1 rounded-full bg-[#f6f5f1] px-2.5 py-1.5 text-xs text-ink/70"><Check className="size-3 text-orange-deep" />{highlight}</span>)}</div><Link href={`/packages/${pkg.slug}`} className="mt-5 flex min-h-11 items-center justify-center rounded-xl border border-navy/10 text-sm font-semibold text-navy">View trip details <ArrowRight className="ml-2 size-4" /></Link><a href={whatsappHref(`Hi Plan My Trip, please share details for the ${pkg.title} package.`)} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white"><WhatsAppIcon className="size-4" /> Enquire on WhatsApp</a></div>
  </article></Reveal>)}</div>;
}

export async function HomeCombinedPackageCards() {
  await connection();
  await connectDB();
  const allPackages = await Package.find({ published: true }).sort({ featured: -1, createdAt: -1 }).limit(30).lean();
  const packages = allPackages.filter((pkg) => pkg.destinations.length > 1).slice(0, 6);
  const combined = packages.length ? packages.map((pkg) => ({ slug: pkg.slug, title: pkg.title, destinations: pkg.destinations, days: `${pkg.days} Days / ${pkg.nights} Nights`, description: pkg.shortDescription, image: pkg.images?.[0] || combinedTripImage(pkg.destinations) })) : tripPackages.filter((trip) => trip.destinations.length > 1).map((trip) => ({ slug: trip.slug, title: trip.name, destinations: trip.destinations, days: trip.days, description: trip.intro, image: combinedTripImage(trip.destinations) }));
  return <div className="mt-7 grid gap-4 md:grid-cols-3">{combined.map((trip) => <Link key={trip.slug} href={`/packages/${trip.slug}`} className="combined-card"><Image src={trip.image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className="combined-photo"/><span className="combined-badge">Multi-city</span><span className="eyebrow text-white/75">{trip.destinations.join(" · ")} · {trip.days}</span><h3 className="mt-2 font-display text-2xl text-white">{trip.title}</h3><p className="mt-2 text-sm text-white/75">{trip.description}</p></Link>)}</div>;
}




