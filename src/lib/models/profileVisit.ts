import mongoose, { Schema, models } from "mongoose";

const ProfileVisitSchema = new Schema(
  {
    visitorKey: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    reason: { type: String, trim: true },
    referrer: { type: String, trim: true },
    firstPath: { type: String, trim: true },
    lastPath: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    visitCount: { type: Number, default: 1 },
    lastVisitDate: { type: String, trim: true, index: true },
    dailyVisitCount: { type: Number, default: 1 },
    firstVisitedAt: { type: Date, default: Date.now },
    lastVisitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.ProfileVisit ||
  mongoose.model("ProfileVisit", ProfileVisitSchema);
