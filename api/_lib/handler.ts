// 공통 핸들러 — DB 연결 + 에러 처리 + 방문자별 userId 추출.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./db.js";

// 인증 없는 데모: 클라이언트가 localStorage 에 저장한 UUID 를
// X-User-Id 헤더로 보내고, 백엔드는 그 값을 사용자 식별자로 사용한다.
// 헤더가 없으면 "anonymous" 로 fallback (모두 같은 데이터 풀 공유).
function readUserId(req: VercelRequest): string {
  const raw = req.headers["x-user-id"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || typeof value !== "string") return "anonymous";
  const trimmed = value.trim();
  if (!trimmed) return "anonymous";
  // 너무 긴 / 이상한 값 차단
  if (trimmed.length > 100) return "anonymous";
  return trimmed;
}

export type WithDbHandler = (
  req: VercelRequest,
  res: VercelResponse,
  ctx: { userId: string }
) => Promise<void>;

export function withDb(inner: WithDbHandler) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {
      await connectDB();
      const userId = readUserId(req);
      await inner(req, res, { userId });
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
