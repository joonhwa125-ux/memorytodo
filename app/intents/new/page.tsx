"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActivePerson } from "@/lib/api/useActivePerson";
import { intentsApi } from "@/lib/api/intents";
import type { IntentType } from "@/lib/api/types";

export default function IntentNewPage() {
  const router = useRouter();
  const { person, loading: personLoading } = useActivePerson();
  const [intentType, setIntentType] = useState<IntentType>("do");
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personLoading && !person) router.replace("/setup");
  }, [personLoading, person, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!person) return;
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    try {
      await intentsApi.create({
        personId: person._id,
        intentType,
        title: trimmed,
        why: why.trim() || null,
        dueDate: dueDate || null,
      });
      router.push("/intents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "추가 실패");
      setSubmitting(false);
    }
  }

  if (personLoading || !person) {
    return <main className="clean"><div className="clean-container" /></main>;
  }

  return (
    <main className="clean">
      <form className="clean-container" onSubmit={handleSubmit}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <h2 className="clean-h2">할 일 추가</h2>
          <Link
            href="/intents"
            aria-label="닫기"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "var(--c-bg-2)",
              color: "var(--c-ink-2)",
              textDecoration: "none",
            }}
          >
            ×
          </Link>
        </header>

        <FieldLabel>종류</FieldLabel>
        <div className="clean-toggle-pair">
          <div
            className={`clean-toggle-opt ${intentType === "do" ? "active" : ""}`}
            onClick={() => setIntentType("do")}
            role="button"
          >
            <div className="clean-toggle-opt-label">할 일</div>
            <div className="clean-toggle-opt-desc">하고 싶은 일</div>
          </div>
          <div
            className={`clean-toggle-opt ${intentType === "avoid" ? "active" : ""}`}
            onClick={() => setIntentType("avoid")}
            role="button"
          >
            <div className="clean-toggle-opt-label">참기</div>
            <div className="clean-toggle-opt-desc">하지 말아야 할 일</div>
          </div>
        </div>

        <FieldLabel>어떤 일인가요?</FieldLabel>
        <input
          className="clean-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 주말마다 안부 전화"
          autoFocus
          maxLength={200}
        />

        <FieldLabel>
          왜 마음에 두었나요? <Optional />
        </FieldLabel>
        <textarea
          className="clean-input clean-textarea"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="간단한 메모"
          maxLength={500}
        />

        <FieldLabel>
          마감일 <Optional />
        </FieldLabel>
        <input
          type="date"
          className="clean-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {error && (
          <div
            role="alert"
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--c-relapsed-soft)",
              color: "var(--c-relapsed)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="clean-btn-primary"
          disabled={!title.trim() || submitting}
          style={{ marginTop: 24 }}
        >
          {submitting ? "..." : "저장"}
        </button>
      </form>
    </main>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="clean-label"
      style={{ marginTop: 18, marginBottom: 8 }}
    >
      {children}
    </div>
  );
}

function Optional() {
  return <span className="clean-tag-muted">(선택)</span>;
}
