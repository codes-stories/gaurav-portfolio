// lib/models/Blog.ts
import mongoose, { Schema, models } from "mongoose";
// Ensure User model is registered before Blog (so populate('author') works)
import "./user";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Store Editor.js JSON or HTML/Markdown. Use Mixed to support object data.
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    coverImage: String,

    tags: [String],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
    //add the course id optional field
    isCourse: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: false,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: false,
    },
  },
  { timestamps: true }
);

export default models.Blog || mongoose.model("Blog", BlogSchema);
