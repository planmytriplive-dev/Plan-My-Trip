import { Schema, model, models } from "mongoose";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    destination: { type: String, default: "" },
    travelDate: { type: String, default: "" },
    travelers: { type: Number, default: 1, min: 1, max: 100 },
    message: { type: String, default: "", maxlength: 1500 },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true },
);
enquirySchema.index({ handled: 1, createdAt: -1 });

export const Enquiry = models.Enquiry || model("Enquiry", enquirySchema);