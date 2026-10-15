import { connectDB } from "@/lib/db";
import { RateLimit } from "@/models/RateLimit";

/** Mongo-backed limiter (memory isn't shared on Vercel). Returns true if allowed. */
export async function rateLimit(key: string, max: number, windowSec: number) {
  await connectDB();
  const now = new Date();
  const fresh = new Date(now.getTime() + windowSec * 1000);
  const live = { $gt: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] };
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    [
      {
        $set: {
          count: { $cond: [live, { $add: [{ $ifNull: ["$count", 0] }, 1] }, 1] },
          expiresAt: { $cond: [live, "$expiresAt", fresh] },
        },
      },
    ],
    { upsert: true, returnDocument: "after", updatePipeline: true },
  );
  return doc.count <= max;
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
