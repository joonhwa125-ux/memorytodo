// localhost:5000 backend 호출을 위한 fetch wrapper
//
// 사용 예시:
//   const intents = await api<Intent[]>('/api/intents');
//   const created = await api<Intent>('/api/intents', { method: 'POST', body: { ... } });

// 프로덕션(Vercel): 프론트와 API가 같은 오리진. 비워두면 상대 경로 사용.
// 로컬 dev (vercel dev): 동일하게 같은 오리진 (3000번).
// VITE_API_BASE_URL을 명시적으로 설정하면 오버라이드 (예: 분리된 백엔드 사용 시).
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

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
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
