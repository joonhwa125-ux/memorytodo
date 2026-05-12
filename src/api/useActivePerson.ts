// 단일 사용자 앱 — 첫 활성 person을 자동으로 선택해 반환.
// 없으면 null. 페이지에서 setup 화면으로 redirect할 수 있음.

import { useEffect, useState } from "react";
import { personsApi } from "./persons";
import type { ApiPerson } from "./types";

export interface UseActivePersonResult {
  person: ApiPerson | null;
  loading: boolean;
  error: string | null;
}

export function useActivePerson(): UseActivePersonResult {
  const [person, setPerson] = useState<ApiPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // React 19 StrictMode 에서 effect가 두 번 발화되어도
    // cancelled flag + AbortController로 안전하게 처리.
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const list = await personsApi.list({ signal: controller.signal });
        if (!cancelled) setPerson(list[0] ?? null);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "person 조회 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { person, loading, error };
}
