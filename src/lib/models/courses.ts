import mongoose, { Schema, models } from "mongoose";

function slugify(text: string) {
    return (
        text || ""
    )
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

const CourseSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true, unique: true, index: true },
        description: { type: String, required: true, trim: true },
        instructor: { type: String, required: true, trim: true },
        duration: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        thumbnail: { type: String },
        order: { type: Number, default: 0 },
        chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
    },
    { timestamps: true }
);

CourseSchema.pre("validate", function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title);
    }
    next();
});

const ChapterSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, trim: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        order: { type: Number, default: 0 },
        sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
    },
    { timestamps: true }
);

ChapterSchema.pre("validate", function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title);
    }
    next();
});

const SectionSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, trim: true },
        content: { type: String, required: true },
        order: { type: Number, default: 0 },
        chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    },
    { timestamps: true }
);

SectionSchema.pre("validate", function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title);
    }
    next();
});

const Course = models.Course || mongoose.model("Course", CourseSchema);
export default Course;
const Chapter = models.Chapter || mongoose.model("Chapter", ChapterSchema);
export { Chapter };
const Section = models.Section || mongoose.model("Section", SectionSchema);
export { Section };

export function validateCourseData(data: any) {
    const { title, description, instructor, duration, price } = data;
    if (!title || !description || !instructor || duration === undefined || price === undefined) {
        throw new Error("All fields are required");
    }
    if (typeof title !== "string" || typeof description !== "string" || typeof instructor !== "string") {
        throw new Error("Title, description and instructor must be strings");
    }
    if (typeof duration !== "number" || typeof price !== "number") {
        throw new Error("Duration and price must be numbers");
    }
    return true;
}

export function validateChapterData(data: any) {
    if (!data?.title || typeof data.title !== "string") {
        throw new Error("Chapter title is required");
    }
    return true;
}

export function validateSectionData(data: any) {
    if (!data?.title || typeof data.title !== "string") {
        throw new Error("Section title is required");
    }
    if (typeof data.content !== "string") {
        throw new Error("Section content must be a string");
    }
    return true;
}