"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { personsApi } from "@/lib/api/persons";

const SUGGESTIONS = ["엄마", "아빠", "자기야", "민지", "할머니"];

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 이미 person이 있으면 바로 /intents로
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await personsApi.list();
        if (!cancelled && list.length > 0) {
          router.replace("/intents");
          return;
        }
      } catch {
        // 백엔드 미가동 등 — UI 그대로 노출
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    try {
      await personsApi.create({ displayName: trimmed });
      router.push("/intents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성 실패");
      setSubmitting(false);
    }
  }

  if (checking) {
    return <div className="clean clean-container" />;
  }

  return (
    <main className="clean">
      <form
        onSubmit={handleSubmit}
        className="clean-container"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h2 className="clean-h1" style={{ marginTop: 40, marginBottom: 32 }}>
          누구를 위한
          <br />
          기록인가요?
        </h2>

        <input
          className="clean-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 엄마, 자기야, 민지"
          autoFocus
          maxLength={40}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
            marginBottom: 32,
          }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setName(s)}
              style={{
                fontSize: 13,
                padding: "8px 14px",
                borderRadius: 999,
                background: "var(--c-bg-2)",
                color: "var(--c-ink-2)",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "var(--c-relapsed-soft)",
              color: "var(--c-relapsed)",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button
          className="clean-btn-primary"
          type="submit"
          disabled={!name.trim() || submitting}
        >
          {submitting ? "..." : "다음"}
        </button>
      </form>
    </main>
  );
}
