import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TrackerDailyLog } from "@/lib/models/tracker";
import { ensureDailyLogs, startOfDay } from "@/lib/tracker";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const date = startOfDay(searchParams.get("date") || undefined);
  const logs = await ensureDailyLogs(date);
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    await connectDB();
    const date = startOfDay(body.date);
    const logs = await ensureDailyLogs(date);
    return NextResponse.json(logs, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
