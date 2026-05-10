import mongoose from "mongoose";

function normalizeDbUri(value?: string) {
  return value?.trim().replace(/^['\"]|['\"]$/g, "");
}

const dbUri = normalizeDbUri(process.env.MONGODB_URI || process.env.DB_URL);

if (!dbUri) {
  throw new Error("Please define MONGODB_URI or DB_URL in the environment");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const connectionString = dbUri as string;

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionString).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
