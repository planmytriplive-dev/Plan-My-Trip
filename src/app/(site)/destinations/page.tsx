import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { destinations } from "@/lib/travel-content";

export const metadata: Metadata = {
  title: "Mountain Destinations in India | Plan My Trip",
  description:
    "Explore destinations and travel circuits across Jammu, Kashmir, Himachal Pradesh, Uttarakhand and Ladakh.",
};

const regions = ["Kashmir", "Jammu", "Himachal Pradesh", "Uttarakhand", "Ladakh"] as const;
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
};

export default function DestinationsPage() {
  return (
    <main className="min-h-[65vh] bg-white">
      <header className="bg-[#fff8d9] px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow">Plan your route</span>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            Find your place in the mountains.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
            Browse popular places and regional travel circuits across Kashmir,
            Jammu, Himachal Pradesh, Uttarakhand and Ladakh. Select a place to see highlights and
            start planning.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Destination regions" className="mb-10 flex flex-wrap gap-2">
          {regions.map((region) => (
            <a
              key={region}
              href={`#${region.toLowerCase().replaceAll(" ", "-")}`}
              className="rounded-full border border-[#eadb9e] bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-[#fff8d9]"
            >
              {region}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {regions.map((region) => {
            const places = destinations.filter((place) => {
              const placeRegion =
                "region" in place
                  ? place.region
                  : place.slug === "katra-vaishno-devi" || place.slug === "jammu"
                    ? "Jammu"
                    : "Kashmir";
              return placeRegion === region;
            });

            return (
              <section
                key={region}
                id={region.toLowerCase().replaceAll(" ", "-")}
                aria-labelledby={`${region.toLowerCase().replaceAll(" ", "-")}-heading`}
              >
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#eee8d6] pb-4">
                  <div>
                    <span className="eyebrow">Explore the region</span>
                    <h2
                      id={`${region.toLowerCase().replaceAll(" ", "-")}-heading`}
                      className="mt-1 font-display text-3xl font-extrabold text-ink md:text-4xl"
                    >
                      {region}
                    </h2>
                  </div>
                  <span className="text-sm text-ink/55">
                    {places.length} {places.length === 1 ? "area" : "areas"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {places.map((place) => {
                    const image = coverPhotos[place.slug];
                    return (
                      <Link
                        key={place.slug}
                        href={`/destinations/${place.slug}`}
                        className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#d8c69d] via-[#668075] to-[#243f43] p-5 shadow-sm transition-transform hover:-translate-y-1 focus-visible:outline-[#b28a00]"
                      >
                        {image && (
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
                        <span className="relative z-10">
                          <span className="mb-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white backdrop-blur-sm">
                            {region}
                          </span>
                          <span className="flex items-end justify-between gap-3">
                            <span>
                              <span className="block font-display text-2xl font-extrabold leading-tight text-white">
                                {place.name}
                              </span>
                              <span className="mt-1 block text-sm text-white/80">
                                {place.subtitle}
                              </span>
                            </span>
                            <ArrowRight
                              aria-hidden="true"
                              className="mb-1 size-5 shrink-0 text-[#ffdf55] transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
