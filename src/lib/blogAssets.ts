import { lookup } from "dns/promises";
import { Readable } from "stream";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 3;

function isPrivateAddress(address: string, family: number) {
  if (family === 4) {
    const [a, b] = address.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19));
  }

  const normalized = address.toLowerCase();
  return normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

async function assertPublicUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only HTTP(S) image URLs are supported");
  if (url.username || url.password || url.hostname === "localhost") throw new Error("Private image URLs are not allowed");

  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address, family }) => isPrivateAddress(address, family))) {
    throw new Error("Private image URLs are not allowed");
  }
  return url;
}

async function fetchPublicImage(sourceUrl: string) {
  let url = await assertPublicUrl(sourceUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) throw new Error("Image redirect could not be followed");
      url = await assertPublicUrl(new URL(location, url).toString());
      continue;
    }

    if (!response.ok) throw new Error(`Image download failed (${response.status})`);
    const contentType = response.headers.get("content-type")?.split(";")[0].toLowerCase() || "";
    if (!contentType.startsWith("image/")) throw new Error("URL did not return an image");

    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_IMAGE_BYTES) throw new Error("Image is larger than 5 MB");
    if (!response.body) throw new Error("Image response had no body");

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_IMAGE_BYTES) throw new Error("Image is larger than 5 MB");
      chunks.push(value);
    }
    return { bytes: Buffer.concat(chunks), contentType, sourceUrl: url.toString() };
  }

  throw new Error("Image redirect could not be followed");
}

function bucket() {
  if (!mongoose.connection.db) throw new Error("Database connection is not ready");
  return new GridFSBucket(mongoose.connection.db, { bucketName: "blogAssets" });
}

export async function importBlogImage(sourceUrl: string) {
  const image = await fetchPublicImage(sourceUrl);
  const pathname = new URL(image.sourceUrl).pathname;
  const filename = pathname.split("/").pop() || "blog-image";
  const upload = bucket().openUploadStream(filename, {
    metadata: { sourceUrl, contentType: image.contentType, importedAt: new Date() },
  });

  await new Promise<void>((resolve, reject) => {
    upload.once("finish", resolve);
    upload.once("error", reject);
    Readable.from(image.bytes).pipe(upload);
  });

  return `/api/blog-assets/${upload.id.toString()}`;
}

export async function localizeBlogImages(source: string) {
  const replacements = new Map<string, Promise<string>>();
  const localize = async (url: string) => {
    if (!replacements.has(url)) replacements.set(url, importBlogImage(url));
    return replacements.get(url)!;
  };

  const matches = Array.from(source.matchAll(/(?:<img\b[^>]*?\bsrc\s*=\s*["']|url\(\s*["']?)(https?:\/\/[^\s"')>]+)(?:["']?\s*\))?/gi));
  let output = source;
  for (const match of matches) {
    const remoteUrl = match[1];
    const localUrl = await localize(remoteUrl);
    output = output.split(remoteUrl).join(localUrl);
  }
  return output;
}

export async function readBlogAsset(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const assetId = new ObjectId(id);
  const file = await bucket().find({ _id: assetId }).next();
  if (!file) return null;

  const stream = bucket().openDownloadStream(assetId);
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.once("end", resolve);
    stream.once("error", reject);
  });

  return {
    bytes: Buffer.concat(chunks),
    contentType: typeof file.metadata?.contentType === "string" ? file.metadata.contentType : "application/octet-stream",
  };
}
