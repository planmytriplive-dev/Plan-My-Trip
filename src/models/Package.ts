import { Schema, model, models, type InferSchemaType } from "mongoose";

const itineraryDay = new Schema(
  { day: { type: Number, required: true }, title: { type: String, required: true }, description: { type: String, default: "" } },
  { _id: false },
);

const packageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    destinations: { type: [String], default: [] }, // e.g. ["katra-vaishno-devi","srinagar"]
    collections: { type: [String], default: [] }, // pilgrimage, kashmir, honeymoon, family, snow, multi-city
    badge: { type: String, default: "", trim: true, maxlength: 40 },
    category: { type: String, default: "Tour" },
    days: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    startingFrom: { type: Boolean, default: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: { type: [itineraryDay], default: [] },
    images: { type: [String], default: [] }, // Cloudinary URLs, first = cover
    imagePublicIds: { type: [String], default: [] }, // Cloudinary assets owned by this package
    featured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    offerText: { type: String, default: "", trim: true, maxlength: 120 },
    priceNote: { type: String, default: "", trim: true, maxlength: 120 },
    published: { type: Boolean, default: false },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

packageSchema.index({ published: 1, createdAt: -1 });
packageSchema.index({ published: 1, featured: 1 });
packageSchema.index({ destinations: 1, published: 1 });

export type PackageDoc = InferSchemaType<typeof packageSchema>;
export const Package = models.Package || model("Package", packageSchema);
