import mongoose, { Schema, models } from "mongoose";

const SubjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    color: {
      type: String,
      required: true,
      default: "#38bdf8",
      match: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    },
  },
  { timestamps: true }
);

const TopicSchema = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "TrackerSubject",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    maxTimeMinutes: { type: Number, required: true, min: 0, default: 60 },
  },
  { timestamps: true }
);

TopicSchema.index({ subjectId: 1, name: 1 }, { unique: true });

const TaskSchema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "TrackerTopic",
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "TrackerSubject",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      default: "medium",
    },
    estimatedMinutes: { type: Number, required: true, min: 1 },
    pointValue: { type: Number, required: true },
    penaltyValue: { type: Number, required: true },
    isDeferred: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const DailyLogSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "TrackerTask",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "completed", "deferred"],
      default: "pending",
      index: true,
    },
    actualMinutes: { type: Number, min: 0 },
    pointsAwarded: { type: Number, default: 0 },
    penaltyApplied: { type: Number, default: 0 },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

DailyLogSchema.index({ taskId: 1, date: 1 }, { unique: true });

const UserStatsSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, default: "default" },
    totalPoints: { type: Number, default: 0 },
    totalPenalties: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TrackerSubject =
  models.TrackerSubject || mongoose.model("TrackerSubject", SubjectSchema);

export const TrackerTopic =
  models.TrackerTopic || mongoose.model("TrackerTopic", TopicSchema);

export const TrackerTask =
  models.TrackerTask || mongoose.model("TrackerTask", TaskSchema);

export const TrackerDailyLog =
  models.TrackerDailyLog || mongoose.model("TrackerDailyLog", DailyLogSchema);

export const TrackerUserStats =
  models.TrackerUserStats ||
  mongoose.model("TrackerUserStats", UserStatsSchema);
