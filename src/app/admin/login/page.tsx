"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ password }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      router.push('/admin/blogs');
    } catch (e: any) {
      setError(e.message || 'Error');
    }
  }

  return (
    <main className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={handle} className="space-y-3">
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Admin password" className="w-full border px-3 py-2 rounded" />
        {error && <div className="text-red-600">{error}</div>}
        <button className="px-4 py-2 bg-black text-white rounded border-1 border-amber-500">Sign in</button>
      </form>
    </main>
  );
}
