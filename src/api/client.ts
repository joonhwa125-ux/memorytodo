// localhost:5000 / Vercel 같은 오리진의 백엔드를 호출하는 fetch wrapper.
//
// 모든 요청에 X-User-Id 헤더를 자동 첨부하여 브라우저별 데이터 격리를 제공한다.

import { getUserId } from "./userId";

// 프로덕션(Vercel 단일화): 프론트와 API가 같은 오리진 → 상대 경로.
// 별도 백엔드를 쓸 경우 VITE_API_BASE_URL 로 오버라이드.
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, signal } = options;

  const headers: Record<string, string> = {
    "X-User-Id": getUserId(),
  };
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (typeof data === "object" && data && "error" in data
        ? String((data as { error: unknown }).error)
        : null) ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  return data as T;
}

export { BASE_URL };
