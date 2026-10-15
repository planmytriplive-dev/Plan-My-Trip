import { Schema, model, models } from "mongoose";

const galleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, default: "", trim: true, maxlength: 160 },
    destination: { type: String, default: "", trim: true, maxlength: 80 },
    uploadedBy: { type: String, default: "admin" },
  },
  { timestamps: true },
);
galleryImageSchema.index({ createdAt: -1 });

export const GalleryImage = models.GalleryImage || model("GalleryImage", galleryImageSchema);
