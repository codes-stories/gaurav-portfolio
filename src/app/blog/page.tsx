import { connectDB } from "../../lib/db";
import Blog from "../../lib/models/blogs";
import BlogCard from "../../components/BlogCard";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  let blogs: any[] = [];
  let databaseUnavailable = false;

  try {
    await connectDB();
    blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .lean();
  } catch (error) {
    databaseUnavailable = true;
    console.error("Unable to load blog posts", error);
  }

  return (
    <main className="min-h-screen rounded-3xl bg-black/55 mt-5">
      <div className="max-w-5xl mx-auto px-4 py-14 text-white">
        <header className="mb-10">
          <h1 className="font-display heading-grad-1 text-4xl font-semibold tracking-tight">
            Blog
          </h1>
          <p className="text-white/60 mt-2">
            Thoughts, tutorials, and insights
          </p>
        </header>

        {databaseUnavailable ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
            Blog posts are temporarily unavailable. Please try again shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((b: any) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
