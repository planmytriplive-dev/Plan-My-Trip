import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { GalleryImage } from "@/models/GalleryImage";

export const metadata: Metadata = { title: "Travel Gallery", description: "Photos from trips and destinations with Plan My Trip." };

export default function GalleryPage() {
  return <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-16 md:px-8 md:py-24"><span className="eyebrow">Travel gallery</span><h1 className="mt-3 font-display text-5xl text-navy">A look around the region.</h1><p className="mt-4 max-w-2xl text-ink/65">Scenes and memories from the destinations we help travellers explore.</p><Suspense fallback={<div className="mt-9 rounded-2xl bg-cream p-8 text-ink/65">Loading gallery…</div>}><GalleryImages /></Suspense></main>;
}

async function GalleryImages() {
  await connection();
  await connectDB();
  const images = await GalleryImage.find().sort({ createdAt: -1 }).limit(200).lean();
  return images.length ? <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => <figure key={String(image._id)} className="overflow-hidden rounded-2xl bg-mist"><div className="relative aspect-[4/3]"><Image src={image.url} alt={image.caption || image.destination || "Travel destination"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>{(image.caption || image.destination) && <figcaption className="p-4"><p className="font-semibold text-navy">{image.caption || image.destination}</p>{image.caption && image.destination && <p className="mt-1 text-sm text-ink/55">{image.destination}</p>}</figcaption>}</figure>)}</div> : <div className="mt-9 rounded-2xl bg-cream p-8 text-ink/65">Our gallery is getting ready. Please check back soon.</div>;
}
