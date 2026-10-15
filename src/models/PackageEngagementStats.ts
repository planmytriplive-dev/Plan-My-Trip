import { Schema, model, models } from "mongoose";

const statsSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0, min: 0 },
  views: { type: Number, default: 0, min: 0 },
  shares: { type: Number, default: 0, min: 0 },
}, { timestamps: true, collection: "package_engagement_stats" });

export const PackageEngagementStats = models.PackageEngagementStats || model("PackageEngagementStats", statsSchema);
