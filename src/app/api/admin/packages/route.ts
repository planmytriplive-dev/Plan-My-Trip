import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Package } from "@/models/Package";

const packageInput = z.object({
  title: z.string().trim().min(3).max(140),
  // The admin form intentionally allows a blank slug; the route generates one from the title.
  slug: z.string().trim().max(160).optional().default(""),
  destinations: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
  collections: z.array(z.string().trim().min(1).max(40)).max(12),
  badge: z.string().trim().max(40).default(""),
  category: z.string().trim().max(60).default("Tour"),
  days: z.coerce.number().int().min(1).max(90),
  nights: z.coerce.number().int().min(0).max(89),
  price: z.coerce.number().min(0).max(100000000),
  startingFrom: z.boolean().default(true),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().max(10000).default(""),
  highlights: z.array(z.string().trim().min(1).max(160)).max(30),
  inclusions: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  exclusions: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  itinerary: z.array(z.object({ day: z.number().int().min(1).max(90), title: z.string().trim().min(1).max(140), description: z.string().trim().max(1000).default("") })).max(90).default([]),
  images: z.array(z.string().url()).max(12).default([]),
  imagePublicIds: z.array(z.string().min(1).max(220)).max(12).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
}).refine((value) => value.images.length === value.imagePublicIds.length, "Each image must have its Cloudinary asset ID.");

const idInput = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });

function invalidPackageResponse(error: z.ZodError) {
  const firstIssue = error.issues[0];
  const field = firstIssue?.path.join(".") || "package details";
  return NextResponse.json({ error: `Please check ${field}: ${firstIssue?.message ?? "invalid value"}` }, { status: 400 });
}

function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured.");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  await connectDB();
  const packages = await Package.find().sort({ updatedAt: -1 }).limit(300).lean();
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const raw = await request.json().catch(() => null);
  const parsed = packageInput.safeParse(raw);
  if (!parsed.success) return invalidPackageResponse(parsed.error);
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (parsed.data.images.some((url) => !cloudName || !url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`)) || parsed.data.imagePublicIds.some((id) => !id.startsWith("planmytrip/packages/"))) {
    return NextResponse.json({ error: "Package images must be uploaded to this site's package folder." }, { status: 400 });
  }
  await connectDB();
  const slug = slugify(parsed.data.slug || parsed.data.title, { lower: true, strict: true, trim: true });
  if (!slug) return NextResponse.json({ error: "Enter a package title that can be used as a URL." }, { status: 400 });
  try {
    const created = await Package.create({ ...parsed.data, slug });
    return NextResponse.json({ ok: true, package: created }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) return NextResponse.json({ error: "That package URL is already in use. Change the title or URL." }, { status: 409 });
    throw error;
  }
}

export async function PUT(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const raw = await request.json().catch(() => null);
  const idParsed = idInput.safeParse(raw);
  const parsed = packageInput.safeParse(raw);
  if (!idParsed.success) return NextResponse.json({ error: "This package could not be identified. Refresh and try again." }, { status: 400 });
  if (!parsed.success) return invalidPackageResponse(parsed.error);
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (parsed.data.images.some((url) => !cloudName || !url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`)) || parsed.data.imagePublicIds.some((id) => !id.startsWith("planmytrip/packages/"))) {
    return NextResponse.json({ error: "Package images must be uploaded to this site's package folder." }, { status: 400 });
  }
  await connectDB();
  const current = await Package.findById(idParsed.data.id);
  if (!current) return NextResponse.json({ error: "Package not found." }, { status: 404 });
  const slug = slugify(parsed.data.slug || parsed.data.title, { lower: true, strict: true, trim: true });
  if (!slug) return NextResponse.json({ error: "Enter a package title that can be used as a URL." }, { status: 400 });
  const removedImageIds = current.imagePublicIds.filter((id: string) => !parsed.data.imagePublicIds.includes(id));
  try {
    const updated = await Package.findByIdAndUpdate(idParsed.data.id, { ...parsed.data, slug }, { new: true, runValidators: true });
    if (removedImageIds.length) {
      const cdn = getCloudinary();
      await Promise.all(removedImageIds.map((publicId: string) => cdn.uploader.destroy(publicId, { resource_type: "image" })));
    }
    return NextResponse.json({ ok: true, package: updated });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) return NextResponse.json({ error: "That package URL is already in use. Change the title or URL." }, { status: 409 });
    throw error;
  }
}

export async function DELETE(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = idInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid package." }, { status: 400 });
  await connectDB();
  const current = await Package.findById(parsed.data.id);
  if (!current) return NextResponse.json({ error: "Package not found." }, { status: 404 });
  if (current.imagePublicIds.length) {
    const cdn = getCloudinary();
    await Promise.all(current.imagePublicIds.map((publicId: string) => cdn.uploader.destroy(publicId, { resource_type: "image" })));
  }
  await current.deleteOne();
  return NextResponse.json({ ok: true });
}
