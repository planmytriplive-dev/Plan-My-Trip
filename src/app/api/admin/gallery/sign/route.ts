import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ error: "Cloudinary upload is not configured on the server." }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000);
  const body = await request.json().catch(() => ({}));
  const folder = body?.purpose === "packages" ? "planmytrip/packages" : "planmytrip/gallery";
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);
  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
