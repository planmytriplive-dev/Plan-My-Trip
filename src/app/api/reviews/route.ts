import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { Review } from "@/models/Review";

const reviewInput = z.object({
  name: z.string().trim().min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  destination: z.string().trim().max(80).default(""),
  text: z.string().trim().min(10).max(1200),
});

export async function GET() {
  await connectDB();
  const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 }).limit(100).select("name rating text destination photoUrl createdAt").lean();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Please submit the review form again." }, { status: 400 });
  const parsed = reviewInput.safeParse({
    name: form.get("name"),
    rating: form.get("rating"),
    destination: form.get("destination") ?? "",
    text: form.get("text"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Please check your name, rating and review." }, { status: 400 });

  const photo = form.get("photo");
  let photoUrl = "";
  if (photo !== null && !(photo instanceof File)) {
    return NextResponse.json({ error: "Please choose a valid photo." }, { status: 400 });
  }
  if (photo instanceof File && photo.size > 0 && !["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
    return NextResponse.json({ error: "Choose a JPG, PNG or WebP photo up to 5 MB." }, { status: 400 });
  }
  if (photo instanceof File && photo.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Choose a JPG, PNG or WebP photo up to 5 MB." }, { status: 400 });
  }
  const ip = clientIp(request.headers);
  if (!(await rateLimit(`review:v2:${ip}`, 5, 60 * 60))) {
    return NextResponse.json({ error: "You’ve reached the limit of 5 reviews per hour from this connection. Please try again later." }, { status: 429 });
  }
  if (photo instanceof File && photo.size > 0) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Photo uploads are not available right now." }, { status: 503 });
    }
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    try {
      const buffer = Buffer.from(await photo.arrayBuffer());
      photoUrl = await new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "planmytrip/reviews", resource_type: "image", allowed_formats: ["jpg", "png", "webp"], transformation: [{ width: 1200, height: 900, crop: "limit" }] },
          (error, result) => error || !result ? reject(error ?? new Error("Photo upload failed.")) : resolve(result.secure_url),
        );
        upload.end(buffer);
      });
    } catch {
      return NextResponse.json({ error: "Photo upload failed. Please try another image." }, { status: 502 });
    }
  }
  await connectDB();
  await Review.create({ ...parsed.data, photoUrl, status: "approved" });
  return NextResponse.json({ ok: true, message: "Thanks for sharing your review." }, { status: 201 });
}
