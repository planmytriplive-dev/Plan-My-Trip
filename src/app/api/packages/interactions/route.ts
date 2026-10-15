import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { tripPackages } from "@/lib/travel-content";
import { Package } from "@/models/Package";
import { PackageInteraction } from "@/models/PackageInteraction";
import { PackageEngagementStats } from "@/models/PackageEngagementStats";

const visitorSchema = z.string().uuid();
const actionSchema = z.object({ slug: z.string().min(1).max(160), visitorId: visitorSchema, action: z.enum(["like", "view", "share"]) });
const isStaticPackage = (slug: string) => tripPackages.some((trip) => trip.slug === slug);
const eventId = (slug: string, action: string, visitorId: string, period: string) => `${slug}:${action}:${visitorId}:${period}`;

async function readCounts(slug: string) {
  const stats = await PackageEngagementStats.findOneAndUpdate({ slug }, { $setOnInsert: { slug } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  return { likes: stats?.likes ?? 0, views: stats?.views ?? 0, shares: stats?.shares ?? 0 };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || "";
  const parsedVisitor = visitorSchema.safeParse(url.searchParams.get("visitorId"));
  if (!slug || !parsedVisitor.success) return NextResponse.json({ error: "Invalid package." }, { status: 400 });
  await connectDB();
  const pkg = await Package.findOne({ slug, published: true }).select("_id").lean();
  if (!pkg && !isStaticPackage(slug)) return NextResponse.json({ error: "Package not found." }, { status: 404 });
  const liked = !!(await PackageInteraction.exists({ _id: eventId(slug, "like", parsedVisitor.data, "all") }));
  const counts = await readCounts(slug);
  return NextResponse.json({ counts, liked });
}

export async function POST(request: Request) {
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid package action." }, { status: 400 });
  if (!await rateLimit(`package-action:${clientIp(request.headers)}`, 90, 60)) return NextResponse.json({ error: "Please try again shortly." }, { status: 429 });
  await connectDB();
  const pkg = await Package.findOne({ slug: parsed.data.slug, published: true }).select("_id");
  const { slug, action, visitorId } = parsed.data;
  if (!pkg && !isStaticPackage(slug)) return NextResponse.json({ error: "Package not found." }, { status: 404 });
  await PackageEngagementStats.updateOne({ slug }, { $setOnInsert: { slug } }, { upsert: true, setDefaultsOnInsert: true });

  const now = new Date();
  const period = action === "like" ? "all" : action === "view" ? now.toISOString().slice(0, 10) : String(Math.floor(now.getTime() / 3_600_000));
  const id = eventId(slug, action, visitorId, period);
  let liked: boolean | undefined;

  if (action === "like") {
    const existing = await PackageInteraction.findByIdAndDelete(id);
    if (existing) {
      await PackageEngagementStats.updateOne({ slug }, { $inc: { likes: -1 } });
      liked = false;
    } else {
      try {
        await PackageInteraction.create({ _id: id, slug, ...(pkg ? { packageId: pkg._id } : {}), action, visitorId });
        await PackageEngagementStats.updateOne({ slug }, { $inc: { likes: 1 } });
        liked = true;
      } catch (error) {
        if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
        liked = true;
      }
    }
  } else {
    try {
      await PackageInteraction.create({ _id: id, slug, ...(pkg ? { packageId: pkg._id } : {}), action, visitorId, expiresAt: new Date(now.getTime() + 45 * 86_400_000) });
      await PackageEngagementStats.updateOne({ slug }, { $inc: { [action === "view" ? "views" : "shares"]: 1 } });
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
    }
  }

  const counts = await readCounts(slug);
  return NextResponse.json({ counts, liked });
}
