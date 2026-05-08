"use client";
import { useState } from "react";
import Editor from "./Editor";

type Props = {
  initialData?: any;
  slug?: string;
};

export default function BlogEditor({ initialData, slug }: Props) {
  const initialContent =
    typeof initialData?.content === "string" ? initialData.content : "";
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [postSlug, setPostSlug] = useState(initialData?.slug || slug || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : ""
  );
  const [published, setPublished] = useState(Boolean(initialData?.published));

  async function handleEditorSave(content: any) {
    setSaving(true);
    try {
      const payload = {
        authorEmail : "gk022135@gmail.com",
        title: title || "Untitled",
        slug:
          postSlug ||
          (title
            ? title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            : ""),
        content,
        coverImage,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        published,
      };

      const res = await fetch(`/api/blogs${slug ? `/${slug}` : ""}`, {
        method: slug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      alert("Saved");
    } catch (e: any) {
      alert(e.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/80">
              Content desk
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Post settings
            </h2>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
            {published ? "Ready to publish" : "Draft mode"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />

          <input
            value={postSlug}
            onChange={(e) => setPostSlug(e.target.value)}
            placeholder="Slug (optional)"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />

          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Cover image URL"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 md:col-span-2"
          />

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />

          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-sm text-white/80">Publish article</span>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-white"
            />
          </label>
        </div>
      </div>

      <Editor onSave={handleEditorSave} initialData={initialContent} />

      {saving && (
        <div className="text-sm text-white/60 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          Saving changes…
        </div>
      )}
    </section>
  );
}
