import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Blog from "../../../lib/models/blogs";
import User from "../../../lib/models/user";
import { requireAdmin } from "../../../lib/auth";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find({ published: true })
    .sort({ createdAt: -1 })
    .select("title slug coverImage tags author likesCount commentsCount published courseId chapterId sectionId isHtmlPost createdAt updatedAt")
    .populate("author", "name");

  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const body = await req.json();
    await connectDB();
    console.log("Database connected", body);

    // ensure author exists or create admin author
    let author = null;
    if (body.authorEmail) {
      author = await User.findOne({ email: body.authorEmail });
      if (!author) {
        author = await User.create({ name: body.authorName || "Admin", email: body.authorEmail, role: "admin" });
      }
    }

    const blog = await Blog.create({
      title: body.title,
      slug: body.slug,
      content: body.content,
      coverImage: body.coverImage,
      tags: body.tags || [],
      author: author?._id,
      published: !!body.published,
      courseId: body.courseId || undefined,
      chapterId: body.chapterId || undefined,
      sectionId: body.sectionId || undefined,
      isCourse: Boolean(body.courseId),
      isHtmlPost: Boolean(body.isHtmlPost),
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: e.status || 500 });
  }
}
