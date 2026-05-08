import { connectDB } from "../../lib/db";
import Blog from "../../lib/models/blogs";
import BlogCard from "../../components/BlogCard";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  await connectDB();
  const blogs = await Blog.find({ published: true })
    .sort({ createdAt: -1 })
    .populate("author", "name")
    .lean();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 mt-5">
      <div className="max-w-5xl mx-auto px-4 py-14 text-white">
        <header className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">
            Blog
          </h1>
          <p className="text-white/60 mt-2">
            Thoughts, tutorials, and insights
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((b: any) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
