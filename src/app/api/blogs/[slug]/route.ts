import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Blog from "../../../../lib/models/blogs";
import { requireAdmin } from "../../../../lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await connectDB();
  const blog = await Blog.findOne({ slug, published: true }).populate(
    "author",
    "name"
  );

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    requireAdmin(req);
    const { slug } = params;
    const body = await req.json();
    await connectDB();
    const blog = await Blog.findOneAndUpdate(
      { slug },
      {
        ...body,
        isCourse: Boolean(body.courseId),
      },
      { new: true }
    );
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: e.status || 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    requireAdmin(req);
    const { slug } = params;
    await connectDB();
    const res = await Blog.findOneAndDelete({ slug });
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: e.status || 500 });
  }
}
