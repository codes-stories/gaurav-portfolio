import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { readBlogAsset } from "@/lib/blogAssets";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const asset = await readBlogAsset(id);
  if (!asset) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(asset.bytes, {
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
