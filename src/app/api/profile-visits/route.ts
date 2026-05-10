import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import ProfileVisit from "../../../lib/models/profileVisit";

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function getIpAddress(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "";
  return req.headers.get("x-real-ip") || "";
}

export async function GET() {
  try {
    await connectDB();
    const todayKey = new Date().toISOString().slice(0, 10);

    const totalVisitors = await ProfileVisit.countDocuments();
    const todayVisitors = await ProfileVisit.countDocuments({
      lastVisitDate: todayKey,
    });
    const totalVisitsResult = await ProfileVisit.aggregate([
      { $group: { _id: null, total: { $sum: "$visitCount" } } },
    ]);
    const todayVisitsResult = await ProfileVisit.aggregate([
      { $match: { lastVisitDate: todayKey } },
      { $group: { _id: null, total: { $sum: "$dailyVisitCount" } } },
    ]);

    return NextResponse.json({
      totalVisitors,
      todayVisitors,
      totalVisits: totalVisitsResult[0]?.total || 0,
      todayVisits: todayVisitsResult[0]?.total || 0,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unable to load profile visits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const visitorKey = cleanText(body.visitorKey, 120);
    const name = cleanText(body.name, 80) || "Anonymous visitor";
    const email = cleanText(body.email, 120).toLowerCase();

    if (!visitorKey) {
      return NextResponse.json(
        { error: "Visitor key is required" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await connectDB();

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const visit = await ProfileVisit.findOne({ visitorKey });
    const profileUpdate = {
      name,
      email,
      role: cleanText(body.role, 80),
      company: cleanText(body.company, 100),
      reason: cleanText(body.reason, 300),
      referrer: cleanText(body.referrer, 300),
      lastPath: cleanText(body.path, 200),
      ipAddress: getIpAddress(req),
      userAgent: cleanText(req.headers.get("user-agent"), 500),
      lastVisitedAt: now,
      lastVisitDate: todayKey,
    };

    if (visit) {
      const wasVisitedToday = visit.lastVisitDate === todayKey;
      visit.set(profileUpdate);
      visit.visitCount = (visit.visitCount || 0) + 1;
      visit.dailyVisitCount =
        wasVisitedToday ? (visit.dailyVisitCount || 0) + 1 : 1;
      await visit.save();
    } else {
      await ProfileVisit.create({
        ...profileUpdate,
        visitorKey,
        firstPath: cleanText(body.path, 200),
        firstVisitedAt: now,
        visitCount: 1,
        dailyVisitCount: 1,
      });
    }

    const totalVisitors = await ProfileVisit.countDocuments();
    const todayVisitors = await ProfileVisit.countDocuments({
      lastVisitDate: todayKey,
    });
    const totalVisitsResult = await ProfileVisit.aggregate([
      { $group: { _id: null, total: { $sum: "$visitCount" } } },
    ]);
    const todayVisitsResult = await ProfileVisit.aggregate([
      { $match: { lastVisitDate: todayKey } },
      { $group: { _id: null, total: { $sum: "$dailyVisitCount" } } },
    ]);

    return NextResponse.json(
      {
        ok: true,
        totalVisitors,
        todayVisitors,
        totalVisits: totalVisitsResult[0]?.total || 0,
        todayVisits: todayVisitsResult[0]?.total || 0,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unable to save profile visit" },
      { status: 500 }
    );
  }
}
