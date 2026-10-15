import { Schema, model, models } from "mongoose";

const interactionSchema = new Schema({
  _id: { type: String, required: true },
  packageId: { type: Schema.Types.ObjectId, required: false, index: true },
  slug: { type: String, required: true, index: true },
  action: { type: String, enum: ["like", "view", "share"], required: true },
  visitorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, expires: 0 },
}, { collection: "package_engagements_v2" });

export const PackageInteraction = models.PackageEngagementV2 || model("PackageEngagementV2", interactionSchema);
