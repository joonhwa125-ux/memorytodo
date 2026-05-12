// 공통 핸들러 — DB 연결 + 에러 처리 + 임시 단일 사용자 ID
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./db";

export const DEFAULT_USER_ID = "default-user";

export function withDb(
  inner: (req: VercelRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {
      await connectDB();
      await inner(req, res);
    } catch (err) {
      console.error("[api error]", err);
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  };
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]): void {
  res.setHeader("Allow", allowed.join(", "));
  res.status(405).json({ error: `Method Not Allowed` });
}
