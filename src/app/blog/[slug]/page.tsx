import CommentSection from "../../../../src/components/CommentSection";
import Footer from "@/components/Footer";
import editorjsHtml from "editorjs-html";
import BlogShare from "../../../components/blogShare";

import './blog.css';

export const dynamic = "force-dynamic";

/* ----------------------------------------------------
   INLINE IMAGE INJECTION LOGIC (PROD SAFE)
---------------------------------------------------- */
function injectInlineImages(html: string) {
  const imageRegex = /\[\[image:(https?:\/\/[^\]]+)\]\]/gi;

  return html.replace(
    imageRegex,
    (_, url) => `
      <figure class="my-14 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <img
          src="${url}"
          alt="Blog image"
          loading="lazy"
          class="w-full object-cover"
        />
      </figure>
    `
  );
}

function injectInlineImages(html: string) {
  const imageRegex = /\[\[image:(https?:\/\/[^\]]+)\]\]/gi;

  return html.replace(
    imageRegex,
    (_, url) => `
      <figure class="my-14 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <img
          src="${url}"
          alt="Blog image"
          loading="lazy"
          class="w-full object-cover"
        />
      </figure>
    `
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("Fetching blog with slug:", slug);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Not found
      </div>
    );
  }

  const blog = await res.json();

  /* ---------------- PARSE + FIX CONTENT ---------------- */
  let html = "";
  try {
    const parser = editorjsHtml();
    const parsed = parser.parse(blog.content);

    // 🔥 CRITICAL FIX
    const htmlString = Array.isArray(parsed)
      ? parsed.join("")
      : String(parsed || "");

    html = injectInlineImages(htmlString);
  } catch {
    html =
      typeof blog.content === "string"
        ? injectInlineImages(blog.content)
        : "";
  }

  const postUrl = `${baseUrl}/blog/${blog.slug}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      <article className="mx-auto max-w-3xl px-4 py-20 text-white">
        {/* Header */}
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5">
            {blog.title}
          </h1>

          <p className="text-sm text-white/60 mb-6">
            By{" "}
            <span className="text-white/80">
              {blog.author?.name || "Unknown"}
            </span>{" "}
            · {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          <BlogShare url={postUrl} title={blog.title} />
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative mb-16 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div
          className="
            prose prose-invert prose-lg max-w-none
            prose-headings:font-semibold
            prose-p:text-white/80
            prose-li:text-white/80
            prose-strong:text-white
            prose-a:text-white underline-offset-4
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Comments */}
        <div className="mt-20">
          <CommentSection blogId={String(blog._id)} />
        </div>
      </article>

      <Footer />
    </main>
  );
}
