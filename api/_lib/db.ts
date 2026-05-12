// MongoDB connection with caching for serverless functions.
//
// Vercel functions run as Lambdas. Cold-start invocations need a fresh
// connection; warm invocations reuse the cached one. Mongoose maintains
// the underlying pool internally.

import mongoose from "mongoose";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Globals on Node-process scope persist across warm Lambda invocations.
// In TypeScript we declare on globalThis.
declare global {
  var __mongooseCached: Cached | undefined;
}

const cached: Cached =
  globalThis.__mongooseCached ?? { conn: null, promise: null };

if (!globalThis.__mongooseCached) {
  globalThis.__mongooseCached = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error(
        "MONGO_URI environment variable is required. " +
          "Set it locally in .env.local or in Vercel Project Settings → Environment Variables."
      );
    }
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
