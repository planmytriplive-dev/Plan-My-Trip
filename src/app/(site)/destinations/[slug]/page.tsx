import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { destinations, tripPackages } from "@/lib/travel-content";
import { site, telHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Props = { params: Promise<{ slug: string }> };

const coverPhotos: Record<string, string> = {
  "katra-vaishno-devi": "/images/vaishno-devi-yatra.png",
  srinagar: "/images/srinagar-dal-lake.png",
  gulmarg: "/images/gulmarg-meadows.png",
  sonamarg: "/images/sonamarg.png",
  pahalgam: "/images/pahalgam.png",
  yusmarg: "/images/yusmarg.png",
  doodhpathri: "/images/Doodhpathri.png",
  "gurez-valley": "/images/Gurez%20%26%20Tulail%20Valleys.png",
  "amarnath-yatra": "/images/amarnath.png",
  "sinthan-top": "/images/Sinthan%20Top%20%26%20Kishtwar%20Road.png",
  "wular-manasbal": "/images/Wular%20%26%20Manasbal%20Lakes.png",
  "anantnag-valleys": "/images/Aharbal,%20Kokernag%20%26%20Daksum.png",
  "lolab-bangus": "/images/Lolab%20%26%20Bangus%20Valleys.jpg",
  jammu: "/images/jammu.png",
  "jammu-heritage": "/images/jammu.png",
  "patnitop-sanasar": "/images/Patnitop,%20Nathatop%20%26%20Sanasar.jpeg",
  "shiv-khori-reasi": "/images/Reasi%20%26%20Shiv%20Khori.png",
  bhaderwah: "/images/Bhaderwah%20%26%20Jai%20Valley.jpg",
  kishtwar: "/images/Kishtwar%20to%20Machail.png",
  "mansar-surinsar": "/images/Mansar%20%26%20Surinsar%20Lakes.png",
  "basohli-bani": "/images/Basohli,%20Bani%20%26%20Sarthal.png",
  "rajouri-poonch": "/images/rajouri%20and%20Ponch.png",
  shimla: "/images/himachal_landscape.png",
  manali: "/images/Manali%20to%20Solang.png",
  kullu: "/images/kullu%20valley.png",
  "dharamshala-mcleodganj": "/images/Dharamshala%20%26%20McLeod%20Ganj.png",
  "dalhousie-khajjiar": "/images/Dalhousie%20%26%20Khajjiar.png",
  "kasauli-solan": "/images/Kasauli%20%26%20Solan.png",
  "spiti-valley": "/images/spiti%20valley.png",
  kinnaur: "/images/Kinnaur,%20Kalpa,%20Sangla%20%26%20Chitkul.png",
  "lahaul-valley": "/images/Lahaul%20Valley.png",
  "parvati-valley": "/images/Kasol%20%26%20Parvati%20Valley.png",
  "tirthan-valley": "/images/Tirthan%20Valley%20%26%20Great%20Himalayan%20National%20Park.png",
  "palampur-bir": "/images/kullu%20valley.png",
  chamba: "/images/Kinnaur,%20Kalpa,%20Sangla%20%26%20Chitkul.png",
  "mandi-prashar": "/images/Mandi%20%26%20Prashar%20Lake.png",
  uttarakhand: "/images/himachal_landscape.png",
  "char-dham": "/images/vaishno-devi-yatra.png",
  "leh-ladakh": "/images/spiti%20valley.png",
};

// Use the local photos for individual stops when we have a direct match.
const stopPhotos: Record<string, Record<string, string>> = {
  "katra-vaishno-devi": { "Katra": "/images/katra-travel-expert.png", "Vaishno Devi Bhawan": "/images/vaishno-devi-yatra.png" },
  srinagar: { "Dal Lake": "/images/srinagar-dal-lake.png", "Mughal Gardens": "/images/mughal%20garden.png", "Srinagar Old City": "/images/Srinagar%20Old%20City.png" },
  gulmarg: { "Gulmarg meadow": "/images/gulmarg-meadows.png" },
  pahalgam: { "Lidder river": "/images/pahalgam.png" },
  sonamarg: { "Sonamarg valley": "/images/sonamarg.png", "Meadow viewpoints": "/images/sonamarg-glacier.png" },
  jammu: { "Jammu city": "/images/jammu.png" },
  yusmarg: { "Yusmarg meadow": "/images/yusmarg.png" },
  doodhpathri: { "Doodhpathri meadow": "/images/Doodhpathri.png" },
  "gurez-valley": { Dawar: "/images/Gurez%20%26%20Tulail%20Valleys.png" },
  "lolab-bangus": { "Lolab Valley": "/images/Lolab%20%26%20Bangus%20Valleys.jpg" },
  "anantnag-valleys": { "Aharbal Waterfall": "/images/Aharbal,%20Kokernag%20%26%20Daksum.png" },
  "sinthan-top": { "Sinthan Top": "/images/Sinthan%20Top%20%26%20Kishtwar%20Road.png" },
  "wular-manasbal": { "Wular Lake": "/images/Wular%20%26%20Manasbal%20Lakes.png" },
  "amarnath-yatra": { "Amarnath Cave": "/images/amarnath.png" },
  "patnitop-sanasar": { Patnitop: "/images/Patnitop,%20Nathatop%20%26%20Sanasar.jpeg" },
  "shiv-khori-reasi": { "Shiv Khori": "/images/Reasi%20%26%20Shiv%20Khori.png" },
  bhaderwah: { "Jai Valley": "/images/Bhaderwah%20%26%20Jai%20Valley.jpg" },
  kishtwar: { Kishtwar: "/images/Kishtwar%20to%20Machail.png" },
  "mansar-surinsar": { "Mansar Lake": "/images/Mansar%20%26%20Surinsar%20Lakes.png" },
  "basohli-bani": { "Basohli town": "/images/Basohli,%20Bani%20%26%20Sarthal.png" },
  "rajouri-poonch": { "Mughal Road": "/images/rajouri%20and%20Ponch.png" },
  shimla: { "The Ridge & Mall Road": "/images/himachal_landscape.png" },
  manali: { "Solang Valley": "/images/Manali%20to%20Solang.png" },
  kullu: { Kullu: "/images/kullu%20valley.png" },
  "dharamshala-mcleodganj": { "McLeod Ganj": "/images/Dharamshala%20%26%20McLeod%20Ganj.png" },
  "dalhousie-khajjiar": { Khajjiar: "/images/Dalhousie%20%26%20Khajjiar.png" },
  "kasauli-solan": { Kasauli: "/images/Kasauli%20%26%20Solan.png" },
  "spiti-valley": { Kaza: "/images/spiti%20valley.png" },
  kinnaur: { Kalpa: "/images/Kinnaur,%20Kalpa,%20Sangla%20%26%20Chitkul.png" },
  "lahaul-valley": { Keylong: "/images/Lahaul%20Valley.png" },
  "parvati-valley": { Kasol: "/images/Kasol%20%26%20Parvati%20Valley.png" },
  "tirthan-valley": { Gushaini: "/images/Tirthan%20Valley%20%26%20Great%20Himalayan%20National%20Park.png" },
  "mandi-prashar": { "Prashar Lake": "/images/Mandi%20%26%20Prashar%20Lake.png" },
};

function getRegion(place: (typeof destinations)[number]) {
  if ("region" in place) return place.region;
  return place.slug === "katra-vaishno-devi"
    ? "Jammu and Kashmir"
    : place.slug === "jammu"
      ? "Jammu"
      : "Kashmir";
}

function fitMetaDescription(value: string) {
  if (value.length <= 160) return value;
  return `${value.slice(0, 157).replace(/\s+\S*$/, "").trimEnd()}...`;
}

export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = destinations.find((item) => item.slug === slug);
  if (!place) {
    return { title: "Destination not found", robots: { index: false, follow: false } };
  }

  const region = getRegion(place);
  const description = fitMetaDescription(
    `${place.name}, ${region} travel guide. Explore ${place.stops.slice(0, 3).join(", ")} and plan your route with Plan My Trip.`,
  );
  const regionalKeywords =
    region === "Himachal Pradesh"
      ? ["Himachal Pradesh travel guide", "Himachal tour packages"]
      : ["Jammu and Kashmir travel guide", `${region} tour packages`];
  const titleLocation =
    place.name.length > 36 ? place.name.split(/[,&:]/)[0].trim() : place.name;
  const title = `${titleLocation} Travel Guide`;
  const url = `/destinations/${place.slug}`;
  const image = coverPhotos[place.slug];

  return {
    title,
    description,
    keywords: [
      `${place.name} travel guide`,
      `places to visit in ${place.name}`,
      `things to do in ${place.name}`,
      ...place.stops.map((stop) => `${stop} tourism`),
      ...regionalKeywords,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const place = destinations.find((item) => item.slug === slug);
  if (!place) notFound();

  const region = getRegion(place);
  const image = coverPhotos[place.slug];
  const related = tripPackages.filter((trip) =>
    trip.destinations.some((name) =>
      place.stops.some(
        (stop) =>
          stop.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(stop.toLowerCase()),
      ),
    ),
  );
  const scene = place.slug === "katra-vaishno-devi" ? "scene-katra" : `scene-${place.slug}`;

  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">
        <p className="text-sm text-ink/55">
          <Link href="/destinations" className="hover:text-navy">
            Destinations
          </Link>{" "}
          / {place.name}
        </p>

        <section className={`destination-hero ${scene} mt-5`} aria-labelledby="destination-title">
          {image && <Image src={image} alt={`${place.name} in ${region}`} fill priority sizes="100vw" className="object-cover" />}
          <span className="absolute inset-0 z-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
          {!image && (
            <span className="photo-placeholder">
              <Sparkles className="size-3" /> Destination photo needed
            </span>
          )}
          <div className="relative z-10 max-w-3xl">
            <span className="eyebrow text-white/80">{region} destination guide</span>
            <h1 id="destination-title" className="mt-3 font-display text-5xl text-white md:text-7xl">
              {place.name}
            </h1>
            <p className="mt-4 max-w-xl text-white/80">{place.intro}</p>
          </div>
        </section>

        <div className="grid gap-12 py-12 md:grid-cols-[1fr_21rem] md:py-16">
          <div>
            <section aria-labelledby="highlights-title">
              <span className="eyebrow">Explore {region}</span>
              <h2 id="highlights-title" className="mt-2 font-display text-3xl text-navy">
                Places to visit in {place.name}
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink/65">
                Use this {region} travel guide to plan time around {place.stops.join(", ")}. Check journey times,
                local access and seasonal conditions for your dates before finalizing your route.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {place.stops.map((stop, index) => {
                  const stopImage = stopPhotos[place.slug]?.[stop];
                  return <div key={stop} className={`place-stop place-stop-${index} ${stopImage ? "place-stop-photo" : ""}`}>
                    {stopImage && <Image src={stopImage} alt={`${stop}, ${place.name}`} fill sizes="(max-width: 639px) 100vw, 33vw" className="object-cover" />}
                    <span className="place-stop-shade" aria-hidden="true" />
                    <MapPin className="relative z-10 size-4 text-white" aria-hidden="true" />
                    <span className="relative z-10 font-semibold text-white">{stop}</span>
                  </div>
                })}
              </div>
            </section>

            <section className="mt-12" aria-labelledby="planning-title">
              <span className="eyebrow">Plan your visit</span>
              <h2 id="planning-title" className="mt-2 font-display text-3xl text-navy">
                Plan a {place.name} trip
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink/65">
                Choose the sights that fit your interests and allow enough time for the road connections between
                them. Plan My Trip can help with stays, local transport and a practical {region} itinerary based on
                your dates and group size.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="related-trips-title">
              <span className="eyebrow">Trips that include this area</span>
              <h2 id="related-trips-title" className="mt-2 font-display text-3xl text-navy">
                A route to get you started
              </h2>
              {related.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {related.map((trip) => (
                    <Link
                      key={trip.slug}
                      href={`/packages/${trip.slug}`}
                      className="rounded-2xl border border-navy/10 p-5 hover:bg-mist"
                    >
                      <span className="eyebrow">{trip.days}</span>
                      <h3 className="mt-2 font-display text-xl text-navy">{trip.name}</h3>
                      <p className="mt-2 text-sm text-ink/60">{trip.price}</p>
                      <span className="mt-3 inline-flex items-center text-sm font-semibold text-orange-deep">
                        View trip <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-ink/60">
                  Tell us where you would like to go and we will help shape a route.
                </p>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-3xl bg-mist p-6 md:sticky md:top-28">
            <span className="eyebrow">Talk to a travel expert</span>
            <h2 className="mt-3 font-display text-2xl text-navy">Planning a visit to {place.name}?</h2>
            <p className="mt-3 text-sm text-ink/65">
              Ask about travel times, places to stay and a route that fits your plans.
            </p>
            <p className="mt-3 font-semibold text-navy">{site.phoneDisplay}</p>
            <a
              href={whatsappHref(`Hi Plan My Trip, I am interested in visiting ${place.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="size-5" /> WhatsApp us
            </a>
            <a
              href={telHref}
              className="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-orange text-sm font-semibold text-white"
            >
              Call our team
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
