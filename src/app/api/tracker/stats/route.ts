import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { refreshStats } from "@/lib/tracker";

export async function GET() {
  await connectDB();
  const stats = await refreshStats();
  return NextResponse.json(stats);
}
