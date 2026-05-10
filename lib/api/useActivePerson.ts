"use client";

// 단일 사용자 앱 — 첫 활성 person을 자동으로 선택해 반환.
// 없으면 null. 페이지에서 setup 화면으로 redirect할 수 있음.

import { useEffect, useState } from "react";
import { personsApi } from "./persons";
import type { ApiPerson } from "./types";

export interface UseActivePersonResult {
  person: ApiPerson | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useActivePerson(): UseActivePersonResult {
  const [person, setPerson] = useState<ApiPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await personsApi.list();
      setPerson(list[0] ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "person 조회 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { person, loading, error, refresh: load };
}
