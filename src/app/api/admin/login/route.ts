import { NextResponse } from "next/server";

// import the database connection and models if needed

import { connectDB } from "../../../../lib/db";
import user from "@/lib/models/user";



export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Database connected");
    const body = await req.json();
    console.log("Request body:", body.password);
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Default password if not set
    console.log("Admin token:", ADMIN_TOKEN);
    console.log("Admin password:", ADMIN_PASSWORD);
    if (!ADMIN_TOKEN) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    if (!body?.password || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    // Set httpOnly cookie
    res.headers.set("Set-Cookie", `admin-token=${ADMIN_TOKEN}; Path=/; HttpOnly; SameSite=Strict`);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", `admin-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
  return res;
}
