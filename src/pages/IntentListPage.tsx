import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useActivePerson } from "@/api/useActivePerson";
import { intentsApi } from "@/api/intents";
import type { ApiIntent } from "@/api/types";

export function IntentListPage() {
  const navigate = useNavigate();
  const { person, loading: personLoading } = useActivePerson();
  const [intents, setIntents] = useState<ApiIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // person 없으면 setup으로
  useEffect(() => {
    if (!personLoading && !person) {
      navigate("/setup", { replace: true });
    }
  }, [personLoading, person, navigate]);

  useEffect(() => {
    if (!person) return;
    const personId = person._id;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await intentsApi.list({ personId });
        if (!cancelled) setIntents(list);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "목록 조회 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [person]);

  async function handleDelete(id: string) {
    if (!person) return;
    if (!confirm("이 할 일을 삭제할까요?")) return;
    setDeletingId(id);
    try {
      await intentsApi.remove(id);
      setIntents((prev) => prev.filter((i) => i._id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    } finally {
      setDeletingId(null);
    }
  }

  if (personLoading || !person) {
    return (
      <main className="clean">
        <div className="clean-container" />
      </main>
    );
  }

  return (
    <main className="clean">
      <div className="clean-container">
        <header style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--c-ink-3)",
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            DEAR. {person.displayName}
          </div>
          <h1 className="clean-h1">오늘의 할 일</h1>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--c-relapsed-soft)",
              color: "var(--c-relapsed)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <section className="clean-card" style={{ marginBottom: 12 }}>
          {loading ? (
            <div
              style={{
                padding: "20px 0",
                color: "var(--c-ink-3)",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              불러오는 중...
            </div>
          ) : intents.length === 0 ? (
            <div style={{ padding: "30px 0", textAlign: "center" }}>
              <p
                style={{
                  color: "var(--c-ink-2)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                아직 마음에 둔 일이 없어요.
              </p>
              <Link to="/intents/new" className="clean-link">
                + 첫 할 일 추가하기
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {intents.map((intent) => (
                <li key={intent._id} className="clean-row">
                  <span
                    className={
                      intent.intentType === "do"
                        ? "clean-tag-do"
                        : "clean-tag-avoid"
                    }
                  >
                    {intent.intentType === "do" ? "할 일" : "참기"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--c-ink)",
                        lineHeight: 1.4,
                      }}
                    >
                      {intent.title}
                    </div>
                    {intent.why && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--c-ink-3)",
                          marginTop: 4,
                          lineHeight: 1.4,
                        }}
                      >
                        {intent.why}
                      </div>
                    )}
                    {intent.dueDate && (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--c-accent)",
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        마감 {intent.dueDate}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <Link
                      to={`/intents/${intent._id}/edit`}
                      style={{
                        fontSize: 12,
                        color: "var(--c-ink-2)",
                        padding: "6px 10px",
                        borderRadius: 8,
                        background: "var(--c-bg-2)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(intent._id)}
                      disabled={deletingId === intent._id}
                      style={{
                        fontSize: 12,
                        color: "var(--c-relapsed)",
                        padding: "6px 10px",
                        borderRadius: 8,
                        background: "var(--c-relapsed-soft)",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link
          to="/intents/new"
          className="clean-btn-soft"
          style={{ width: "100%", textDecoration: "none" }}
        >
          + 할 일 추가
        </Link>
      </div>
    </main>
  );
}
