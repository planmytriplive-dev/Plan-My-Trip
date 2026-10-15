import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { GalleryImage } from "@/models/GalleryImage";

const imageInput = z.object({
  url: z.string().url().refine((url) => url.startsWith("https://res.cloudinary.com/")),
  publicId: z.string().min(1).max(220),
  caption: z.string().trim().max(160).default(""),
  destination: z.string().trim().max(80).default(""),
});

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  await connectDB();
  const images = await GalleryImage.find().sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = imageInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please upload a valid gallery image." }, { status: 400 });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !parsed.data.url.startsWith(`https://res.cloudinary.com/${cloudName}/`)) {
    return NextResponse.json({ error: "Image host does not match this site's Cloudinary account." }, { status: 400 });
  }
  await connectDB();
  await GalleryImage.create(parsed.data);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = z.object({ id: z.string().min(1) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid image." }, { status: 400 });
  await connectDB();
  const image = await GalleryImage.findById(parsed.data.id);
  if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });
  const cloudinary = (await import("cloudinary")).v2;
  await cloudinary.uploader.destroy(image.publicId, { resource_type: "image" });
  await image.deleteOne();
  return NextResponse.json({ ok: true });
}
