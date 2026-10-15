import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 1200 },
    destination: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true },
);
reviewSchema.index({ status: 1, createdAt: -1 });

export const Review = models.Review || model("Review", reviewSchema);