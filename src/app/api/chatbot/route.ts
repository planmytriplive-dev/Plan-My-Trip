import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { connectDB } from "@/lib/db";
import { Package } from "@/models/Package";
import { tripPackages, destinations } from "@/lib/travel-content";
import { blogArticles } from "@/lib/blog-content";
import { site } from "@/lib/site";

const requestSchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1200) })).min(1).max(12),
});

const systemPrompt = `You are Katra Trip Saathi, Plan My Trip's friendly, personalized travel assistant based in Katra, India. Be warm, concise, practical, and conversational. Help with the website, its packages and destinations, and general travel planning. Use the website reference below for business-specific facts; never invent a package, inclusion, price, policy, booking, business credential, or contact detail. For general questions, use your general knowledge and clearly flag when a detail may have changed. Never claim live access to weather, road status, availability, or booking systems. Direct travellers to current official sources for yatra rules and safety updates. Ask one useful follow-up question if dates, group size, budget, or interests would materially improve the plan. For a quote or reservation, refer them to Plan My Trip at ${site.phoneDisplay}. Keep each answer under 110 words.\n\nWEBSITE REFERENCE (published site content):\n`;

async function getWebsiteContext() {
  let packages: unknown[] = tripPackages.map((item) => ({ title: item.name, destinations: item.destinations, duration: item.days, price: item.price, summary: item.intro, highlights: item.details }));
  try {
    await connectDB();
    const published = await Package.find({ published: true }).select("title destinations collections badge category days nights price startingFrom shortDescription description highlights inclusions exclusions itinerary priceNote").sort({ featured: -1, createdAt: -1 }).limit(40).lean();
    if (published.length) packages = published.map((p) => ({ title: p.title, destinations: p.destinations, collections: p.collections, category: p.category, duration: `${p.days} days / ${p.nights} nights`, price: `${p.startingFrom ? "from " : ""}₹${p.price}${p.priceNote ? ` (${p.priceNote})` : ""}`, summary: p.shortDescription, details: p.description, highlights: p.highlights, inclusions: p.inclusions, exclusions: p.exclusions, itinerary: p.itinerary }));
  } catch { /* Static published trip and destination data remains available if the database is offline. */ }
  const destinationInfo = destinations.map(({ name, subtitle, intro, stops }) => ({ name, subtitle, overview: intro, places: stops }));
  const articleInfo = blogArticles.map(({ title, excerpt, category, keywords }) => ({ title, category, summary: excerpt, topics: keywords }));
  return JSON.stringify({ business: { name: site.name, tagline: site.tagline, base: "Katra, Jammu and Kashmir", phone: site.phoneDisplay, website: site.url }, services: ["Trip and route planning", "Tour package enquiries", "Stay and local transport options as described in a published package", "Vaishno Devi yatra planning support", "Custom trip enquiries"], packages, destinations: destinationInfo, travelGuides: articleInfo }, null, 0).slice(0, 26000);
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please send a short travel question." }, { status: 400 });
  if (!await rateLimit(`trip-saathi:${clientIp(request.headers)}`, 18, 60)) return NextResponse.json({ error: "Please wait a moment before asking another question." }, { status: 429 });

  const apiKey = process.env.CHAT_BOT_API;
  if (!apiKey) return NextResponse.json({ error: "Trip Saathi is not connected right now. Please continue on WhatsApp." }, { status: 503 });

  const context = await getWebsiteContext();
  const model = process.env.CHAT_BOT_MODEL || "openai/gpt-oss-20b";
  const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: `${systemPrompt}${context}` }, ...parsed.data.messages.slice(-10)],
      temperature: 0.45,
      max_tokens: 220,
      stream: true,
    }),
    cache: "no-store",
  }).catch((error: unknown) => {
    console.error("[Katra Trip Saathi] Groq request failed:", error instanceof Error ? error.message : "unknown network error");
    return null;
  });

  if (!upstream?.ok || !upstream.body) {
    if (upstream) {
      const detail = await upstream.text().catch(() => "");
      let providerMessage = detail.slice(0, 500);
      try { providerMessage = JSON.parse(detail)?.error?.message || providerMessage; } catch { /* Keep the short response text. */ }
      console.error(`[Katra Trip Saathi] Groq returned HTTP ${upstream.status} for model ${model}:`, providerMessage);
    }
    const status = upstream?.status === 429 ? 429 : 502;
    return NextResponse.json({ error: status === 429 ? "Trip Saathi is busy for a moment. Please try again shortly." : "I couldn't connect just now. Please try again or message our team on WhatsApp." }, { status });
  }

  return new Response(upstream.body, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
  });
}
