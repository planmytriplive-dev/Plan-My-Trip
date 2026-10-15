import { Schema, model, models } from "mongoose";

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
// Mongo deletes the document automatically once expiresAt passes.
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit = models.RateLimit || model("RateLimit", rateLimitSchema);