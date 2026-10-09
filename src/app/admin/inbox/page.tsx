import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InboxList from "@/components/InboxList";
import { getAdminToken } from "@/lib/auth";

export default async function AdminInboxPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin-token")?.value;
  const ADMIN_TOKEN = getAdminToken();

  if (token !== ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen rounded-3xl bg-black/55">
      <div className="max-w-4xl mx-auto px-4 py-14 text-white">
        <h1 className="font-tech heading-grad-4 text-3xl font-semibold tracking-tight mb-8">
          Inbox
        </h1>
        <InboxList />
      </div>
    </main>
  );
}
