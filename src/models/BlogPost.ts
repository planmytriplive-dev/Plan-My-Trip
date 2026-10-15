import { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "", maxlength: 300 },
    content: { type: String, default: "" }, // sanitized HTML or markdown
    coverImage: { type: String, default: "" },
    published: { type: Boolean, default: false },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);
blogSchema.index({ published: 1, createdAt: -1 });

export const BlogPost = models.BlogPost || model("BlogPost", blogSchema);