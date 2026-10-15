import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";

const updateInput = z.object({ id: z.string().min(1), status: z.enum(["approved", "rejected"]) });

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  await connectDB();
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ reviews });
}

export async function PATCH(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = updateInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
  await connectDB();
  const review = await Review.findByIdAndUpdate(parsed.data.id, { status: parsed.data.status }, { new: true }).lean();
  if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = z.object({ id: z.string().min(1) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  await connectDB();
  const review = await Review.findByIdAndDelete(parsed.data.id);
  if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });
  if (review.photoUrl) {
    const cloudinary = (await import("cloudinary")).v2;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      const match = review.photoUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)$/);
      if (match?.[1]) await cloudinary.uploader.destroy(match[1], { resource_type: "image" });
    }
  }
  return NextResponse.json({ ok: true });
}
