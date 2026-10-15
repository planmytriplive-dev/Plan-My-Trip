import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { destinations, tripPackages } from "@/lib/travel-content";
import { blogArticles } from "@/lib/blog-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/packages",
    "/packages/customize",
    "/destinations",
    "/services",
    "/about",
    "/reviews",
    "/gallery",
    "/blog",
    "/contact",
    "/trip-saathi",
    "/privacy-policy",
    "/terms",
    ...tripPackages.map((trip) => `/packages/${trip.slug}`),
    ...destinations.map((place) => `/destinations/${place.slug}`),
    ...blogArticles.map((article) => `/blog/${article.slug}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : ["/packages", "/destinations", "/blog"].includes(path)
          ? 0.8
          : 0.6,
  }));
}
