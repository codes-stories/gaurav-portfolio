import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ensureStats } from "@/lib/tracker";

export async function GET() {
  await connectDB();
  const stats = await ensureStats();
  return NextResponse.json(stats);
}
