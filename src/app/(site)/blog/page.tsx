import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { blogArticles } from "@/lib/blog-content";

export const metadata: Metadata = {
  title: "Kashmir, Jammu & Himachal Travel Guides | Plan My Trip",
  description: "Read practical travel guides for Vaishno Devi, Katra, Kashmir and Himachal. Plan routes, choose destinations and prepare for your trip.",
  keywords: ["Kashmir travel blog", "Jammu travel guides", "Himachal travel blog", "Vaishno Devi travel tips", "India mountain travel guides"],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Kashmir, Jammu & Himachal Travel Guides | Plan My Trip",
    description: "Practical destination guides and trip planning ideas for Jammu, Kashmir and Himachal Pradesh.",
    url: "/blog",
  },
};

export default function BlogPage() {
  return <main className="min-h-[65vh] bg-cream">
    <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 md:px-8 md:pb-12 md:pt-20">
      <span className="eyebrow">Plan a little better</span>
      <div className="mt-3 grid gap-5 md:grid-cols-[1.15fr_.85fr] md:items-end">
        <div><h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-navy md:text-6xl">Travel notes for the road ahead.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">Useful guides for planning a Vaishno Devi yatra, exploring Kashmir and finding your pace in Himachal Pradesh.</p></div>
        <p className="flex items-center gap-2 text-sm font-semibold text-navy md:justify-self-end"><BookOpen className="size-5 text-orange-deep" /> {blogArticles.length} practical destination guides</p>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24" aria-label="Travel guides">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogArticles.map((article, index) => <article key={article.slug} className={`group overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_8px_28px_rgba(7,27,61,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(7,27,61,.12)] ${index === 0 ? "sm:col-span-2 sm:grid sm:grid-cols-2 lg:col-span-2" : ""}`}>
          <Link href={`/blog/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-navy/10 sm:aspect-[4/3]">
            <Image src={article.coverImage} alt="" fill sizes={index === 0 ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 66vw" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"} className="object-cover transition duration-500 group-hover:scale-[1.04]" />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-navy/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-white backdrop-blur">{article.category}</span>
          </Link>
          <div className="flex flex-col p-5 md:p-6"><h2 className="font-display text-xl leading-tight text-navy md:text-2xl"><Link href={`/blog/${article.slug}`} className="transition-colors group-hover:text-orange-deep">{article.title}</Link></h2><p className="mt-3 text-sm leading-relaxed text-ink/65">{article.excerpt}</p><Link href={`/blog/${article.slug}`} className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-orange-deep">Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></div>
        </article>)}
      </div>
    </section>
  </main>;
}
