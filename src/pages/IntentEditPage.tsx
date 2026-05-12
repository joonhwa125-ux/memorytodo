import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { intentsApi } from "@/api/intents";
import type { IntentType } from "@/api/types";

export function IntentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [intentType, setIntentType] = useState<IntentType>("do");
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/intents", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const intent = await intentsApi.get(id);
        if (cancelled) return;
        setIntentType(intent.intentType);
        setTitle(intent.title);
        setWhy(intent.why ?? "");
        setDueDate(intent.dueDate ?? "");
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "조회 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    try {
      await intentsApi.update(id, {
        intentType,
        title: trimmed,
        why: why.trim() || null,
        dueDate: dueDate || null,
      });
      navigate("/intents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="clean">
        <div className="clean-container" />
      </main>
    );
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
          <h2 className="clean-h2">할 일 편집</h2>
          <Link
            to="/intents"
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

        <div className="clean-label" style={{ marginBottom: 8 }}>
          종류
        </div>
        <div className="clean-toggle-pair">
          <button
            type="button"
            className={`clean-toggle-opt ${intentType === "do" ? "active" : ""}`}
            onClick={() => setIntentType("do")}
            aria-pressed={intentType === "do"}
          >
            <div className="clean-toggle-opt-label">할 일</div>
            <div className="clean-toggle-opt-desc">하고 싶은 일</div>
          </button>
          <button
            type="button"
            className={`clean-toggle-opt ${intentType === "avoid" ? "active" : ""}`}
            onClick={() => setIntentType("avoid")}
            aria-pressed={intentType === "avoid"}
          >
            <div className="clean-toggle-opt-label">참기</div>
            <div className="clean-toggle-opt-desc">하지 말아야 할 일</div>
          </button>
        </div>

        <div className="clean-label" style={{ marginTop: 18, marginBottom: 8 }}>
          어떤 일인가요?
        </div>
        <input
          className="clean-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />

        <div className="clean-label" style={{ marginTop: 18, marginBottom: 8 }}>
          왜 마음에 두었나요? <span className="clean-tag-muted">(선택)</span>
        </div>
        <textarea
          className="clean-input clean-textarea"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="간단한 메모"
          maxLength={500}
        />

        <div className="clean-label" style={{ marginTop: 18, marginBottom: 8 }}>
          마감일 <span className="clean-tag-muted">(선택)</span>
        </div>
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
