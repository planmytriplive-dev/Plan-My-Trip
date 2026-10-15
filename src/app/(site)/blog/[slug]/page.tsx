import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { blogArticles, getBlogArticle } from "@/lib/blog-content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } };
  const url = `/blog/${article.slug}`;
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: { type: "article", title: article.seoTitle, description: article.seoDescription, url, images: [article.coverImage] },
    twitter: { card: "summary_large_image", title: article.seoTitle, description: article.seoDescription, images: [article.coverImage] },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const bodyText = article.sections.flatMap((section) => section.paragraphs).join(" ");
  const readMinutes = Math.max(3, Math.ceil(bodyText.split(/\s+/).length / 190));
  const url = new URL(`/blog/${article.slug}`, site.url).toString();
  const related = blogArticles.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);
  const relatedArticles = related.length === 3 ? related : [...related, ...blogArticles.filter((item) => item.slug !== article.slug && !related.some((entry) => entry.slug === item.slug))].slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription,
    image: new URL(article.coverImage, site.url).toString(),
    mainEntityOfPage: url,
    url,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    author: { "@type": "Organization", name: site.name },
  };

  return <main className="min-h-screen bg-cream">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <article className="mx-auto max-w-5xl px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
      <Link href="/blog" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-orange-deep"><ArrowLeft className="size-4" /> All travel guides</Link>
      <header className="mx-auto mt-7 max-w-4xl text-center">
        <span className="eyebrow">{article.category}</span>
        <h1 className="mt-3 font-display text-3xl leading-[1.08] text-navy md:text-5xl">{article.title}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-ink/65 md:text-lg">{article.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-ink/50"><Clock3 className="size-4" /> {readMinutes} min read</span>
      </header>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-navy/10 shadow-[0_18px_50px_rgba(7,27,61,.14)] md:mt-10 md:rounded-3xl">
        <Image src={article.coverImage} alt="" fill priority sizes="(max-width: 1023px) 100vw, 960px" className="object-cover" />
      </div>
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="border-l-4 border-sun pl-5 text-lg font-medium leading-relaxed text-navy">{article.excerpt}</p>
        <div className="mt-8 space-y-8">
          {article.sections.map((section) => <section key={section.heading}>
            <h2 className="font-display text-2xl leading-tight text-navy md:text-3xl">{section.heading}</h2>
            <div className="mt-3 space-y-4 text-base leading-[1.85] text-ink/75">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>)}
        </div>
        <aside className="mt-10 rounded-2xl border border-navy/10 bg-white p-5 md:p-7">
          <span className="eyebrow">Plan your next stop</span>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">Explore our destination guides and shape a route that fits your dates, group and travel pace.</p>
          <div className="mt-4 flex flex-wrap gap-3"><Link href="/destinations" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-white">Explore destinations <ArrowRight className="size-4" /></Link><Link href="/contact" className="inline-flex min-h-11 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy">Talk with our team</Link></div>
        </aside>
      </div>
    </article>
    <section className="border-t border-navy/10 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8"><div className="flex items-end justify-between gap-4"><div><span className="eyebrow">Keep exploring</span><h2 className="mt-2 font-display text-3xl text-navy md:text-4xl">More travel guides</h2></div><Link href="/blog" className="hidden items-center gap-2 text-sm font-bold text-orange-deep sm:inline-flex">All guides <ArrowRight className="size-4" /></Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{relatedArticles.map((item) => <Link key={item.slug} href={`/blog/${item.slug}`} className="group flex min-h-36 flex-col justify-between rounded-xl border border-navy/10 bg-cream p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="eyebrow">{item.category}</span><span className="mt-4 flex items-end justify-between gap-4 font-display text-lg leading-tight text-navy group-hover:text-orange-deep">{item.title}<ArrowRight className="mb-0.5 size-4 shrink-0" /></span></Link>)}</div>
      </div>
    </section>
  </main>;
}
