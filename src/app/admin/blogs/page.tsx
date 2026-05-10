import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import { getAdminToken } from "@/lib/auth";

export default async function AdminBlogsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin-token")?.value;
  const ADMIN_TOKEN = getAdminToken();

  if (token !== ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-14 text-white">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Admin · Blogs
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Create and manage blog posts
          </p>
        </header>

        <BlogEditor />
      </div>
    </main>
  );
}
