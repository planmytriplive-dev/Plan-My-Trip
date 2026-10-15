import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { site } from "../src/lib/site";
import { destinations, tripPackages } from "../src/lib/travel-content";
import { blogArticles } from "../src/lib/blog-content";

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
  ...tripPackages.map(({ slug }) => `/packages/${slug}`),
  ...destinations.map(({ slug }) => `/destinations/${slug}`),
  ...blogArticles.map(({ slug }) => `/blog/${slug}`),
];

const urls = [...new Set(paths)].map((path) => `  <url><loc>${new URL(path, site.url).toString()}</loc></url>`);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
const publicDir = resolve(process.cwd(), "public");

async function main() {
  await mkdir(publicDir, { recursive: true });
  await writeFile(resolve(publicDir, "sitemap.xml"), xml, "utf8");
  console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);
}

void main();
