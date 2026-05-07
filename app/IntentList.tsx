"use client";

import {
  useState,
  useTransition,
  useOptimistic,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createIntent, archiveIntent } from "@/lib/actions/intents";
import { recordEvent } from "@/lib/actions/events";
import type { Intent, IntentType, Quadrant } from "@/lib/types/db";
import { Card, Pill, Input, cn } from "@/components/ui";

const SOFT_LIMIT = 5;

type OptimisticAction =
  | { type: "add"; intent: Intent }
  | { type: "archive"; intentId: string };

interface Props {
  intents: Intent[];
  personId: string;
}

interface OutcomeOption {
  quadrant: Quadrant;
  label: string;
  toneClass: string;
}

// Do 의도 → "해냈어" / "미뤘어" (aligned / procrastinated)
const DO_OUTCOMES: OutcomeOption[] = [
  {
    quadrant: "aligned",
    label: "해냈어",
    toneClass: "text-aligned border-aligned/30 bg-aligned-soft",
  },
  {
    quadrant: "procrastinated",
    label: "미뤘어",
    toneClass: "text-procras border-procras/30 bg-procras-soft",
  },
];

// Avoid 의도 → "참았어" / "또 했어" (resisted / relapsed)
const AVOID_OUTCOMES: OutcomeOption[] = [
  {
    quadrant: "resisted",
    label: "참았어",
    toneClass:
      "text-resisted-deep border-resisted/30 bg-resisted-soft",
  },
  {
    quadrant: "relapsed",
    label: "또 했어",
    toneClass: "text-relapsed border-relapsed/30 bg-relapsed-soft",
  },
];

function makeTempId(): string {
  // crypto.randomUUID 미지원 환경 대비 fallback
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `temp-${crypto.randomUUID()}`;
  }
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function IntentList({ intents, personId }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 낙관적 UI — add/archive 즉시 반영, 서버 응답은 백그라운드
  const [optimisticIntents, applyOptimistic] = useOptimistic<
    Intent[],
    OptimisticAction
  >(intents, (current, action) => {
    switch (action.type) {
      case "add":
        return [action.intent, ...current];
      case "archive":
        return current.filter((i) => i.id !== action.intentId);
    }
  });

  const isEmpty = optimisticIntents.length === 0;
  const overLimit = optimisticIntents.length >= SOFT_LIMIT;

  function handleAdd(payload: {
    intent_type: IntentType;
    title: string;
    why?: string;
  }) {
    // 1) UI 즉시 닫기 (트랜지션 밖)
    setError(null);
    setAdding(false);

    const tempIntent: Intent = {
      id: makeTempId(),
      person_id: personId,
      user_id: "",
      intent_type: payload.intent_type,
      title: payload.title,
      why: payload.why ?? null,
      due_date: null,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 2) 낙관 추가 + 서버 동기화 (트랜지션 안)
    startTransition(async () => {
      applyOptimistic({ type: "add", intent: tempIntent });
      const result = await createIntent({
        person_id: personId,
        intent_type: payload.intent_type,
        title: payload.title,
        why: payload.why,
      });
      if (!result.ok) {
        // 롤백: 폼 다시 열고 에러 표시. optimistic 상태는 transition 종료 시 자연 복귀.
        setError(result.error);
        setAdding(true);
        return;
      }
      router.refresh();
    });
  }

  function handleArchive(intentId: string) {
    setError(null);
    if (expandedId === intentId) setExpandedId(null);

    startTransition(async () => {
      applyOptimistic({ type: "archive", intentId });
      const result = await archiveIntent(intentId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleRecord(intent: Intent, quadrant: Quadrant) {
    // 즉시 접기 (트랜지션 밖)
    setError(null);
    setExpandedId(null);

    startTransition(async () => {
      const result = await recordEvent({
        person_id: personId,
        intent_id: intent.id,
        quadrant,
        session_type: "realtime",
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <section className="mb-[18px]" aria-label="오늘 마음에 둔 것">
      <header className="mb-2.5 flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
          오늘 마음에 둔 것
        </span>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <Pill tone="muted" size="sm">
              {optimisticIntents.length}
            </Pill>
          )}
          {!isEmpty && !adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full",
                "border border-line bg-paper text-ink-2 shadow-soft",
                "transition-colors hover:bg-surface-2",
              )}
              aria-label="추가"
            >
              +
            </button>
          )}
        </div>
      </header>

      <Card padding={isEmpty && !adding ? "lg" : "md"}>
        {isEmpty && !adding ? (
          <EmptyState onAdd={() => setAdding(true)} />
        ) : (
          <>
            {optimisticIntents.length > 0 && (
              <ul className="m-0 list-none p-0">
                {optimisticIntents.map((intent, i) => (
                  <IntentRow
                    key={intent.id}
                    intent={intent}
                    isLast={i === optimisticIntents.length - 1 && !adding}
                    expanded={expandedId === intent.id}
                    onToggle={() => toggleExpand(intent.id)}
                    onArchive={() => handleArchive(intent.id)}
                    onRecord={(q) => handleRecord(intent, q)}
                  />
                ))}
              </ul>
            )}

            {adding && (
              <AddForm
                hasIntentsAbove={optimisticIntents.length > 0}
                onCancel={() => {
                  setAdding(false);
                  setError(null);
                }}
                onSubmit={handleAdd}
              />
            )}
          </>
        )}

        {error && (
          <div
            role="alert"
            className="mt-3 rounded-xl border border-relapsed/30 bg-relapsed-soft px-3 py-2 text-[12px] text-ink"
          >
            {error}
          </div>
        )}

        {overLimit && !adding && (
          <p className="mt-2 text-center text-[11px] italic text-ink-3">
            5개를 넘기면 마음이 흩어져요. 정리해도 좋아요.
          </p>
        )}
      </Card>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full rounded-lg py-6 text-center transition-colors hover:bg-surface-2"
    >
      <p className="m-0 mb-3 text-[15px] leading-[1.6] text-ink-2">
        오늘은 무엇을
        <br />
        마음에 두실래요?
      </p>
      <span className="inline-block rounded-full border border-line bg-paper px-4 py-1.5 text-[12.5px] text-ink-2 shadow-soft">
        + 적어두기
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// IntentRow — 한 줄 + (탭 시) inline outcome 2버튼 (γ 패턴)
// 모든 버튼 항상 클릭 가능. 사용자 escape 동선 막히지 않음.
// ─────────────────────────────────────────────────────────────
interface RowProps {
  intent: Intent;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
  onArchive: () => void;
  onRecord: (q: Quadrant) => void;
}

function IntentRow({
  intent,
  isLast,
  expanded,
  onToggle,
  onArchive,
  onRecord,
}: RowProps) {
  const outcomes = intent.intent_type === "do" ? DO_OUTCOMES : AVOID_OUTCOMES;
  const dotClass =
    intent.intent_type === "do"
      ? "bg-aligned shadow-[0_0_8px_var(--color-aligned-soft)]"
      : "bg-resisted shadow-[0_0_8px_var(--color-resisted-glow)]";

  return (
    <li className={cn("py-3", !isLast && "border-b border-line")}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-[7px] block h-2 w-2 flex-shrink-0 rounded-full",
            dotClass,
          )}
          aria-label={intent.intent_type === "do" ? "할 것" : "피할 것"}
        />
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left"
          aria-expanded={expanded}
        >
          <div className="text-[14px] leading-[1.45] text-ink">
            {intent.title}
          </div>
          {intent.why ? (
            <span className="mt-[3px] block text-[11.5px] text-ink-2">
              {intent.why}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="mt-[2px] grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-[14px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          aria-label="제거"
        >
          ×
        </button>
      </div>

      {expanded && (
        <div className="mt-2.5 ml-5 flex gap-2">
          {outcomes.map((opt) => (
            <button
              key={opt.quadrant}
              type="button"
              onClick={() => onRecord(opt.quadrant)}
              className={cn(
                "flex-1 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium",
                "transition-opacity hover:opacity-80",
                opt.toneClass,
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}

// ─────────────────────────────────────────────────────────────
// AddForm — 인라인 입력
// 취소 버튼은 항상 활성화 (사용자 escape 동선 보장)
// ─────────────────────────────────────────────────────────────
interface AddFormProps {
  hasIntentsAbove: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    intent_type: IntentType;
    title: string;
    why?: string;
  }) => void;
}

function AddForm({ hasIntentsAbove, onCancel, onSubmit }: AddFormProps) {
  const [intentType, setIntentType] = useState<IntentType>("do");
  const [title, setTitle] = useState("");
  const [whyOpen, setWhyOpen] = useState(false);
  const [why, setWhy] = useState("");

  const trimmed = title.trim();
  const canSubmit = trimmed.length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      intent_type: intentType,
      title: trimmed,
      why: why.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(hasIntentsAbove && "mt-3 border-t border-line pt-3")}
    >
      <div className="mb-3 flex gap-2">
        <TypeToggle
          active={intentType === "do"}
          tone="do"
          onClick={() => setIntentType("do")}
        >
          해야할 것
        </TypeToggle>
        <TypeToggle
          active={intentType === "avoid"}
          tone="avoid"
          onClick={() => setIntentType("avoid")}
        >
          피해야할 것
        </TypeToggle>
      </div>

      <Input
        variant="boxed"
        placeholder={
          intentType === "do" ? "무엇을 하고 싶나요?" : "무엇을 멈추고 싶나요?"
        }
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        maxLength={200}
        aria-label="내용"
      />

      {whyOpen ? (
        <div className="mt-2">
          <Input
            variant="boxed"
            placeholder="왜? (선택)"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            maxLength={500}
            aria-label="왜"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setWhyOpen(true)}
          className="mt-2 text-[11.5px] text-ink-2 transition-colors hover:text-ink"
        >
          왜인지 적어볼까요?
        </button>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line bg-paper px-3 py-1.5 text-[12.5px] text-ink-2 hover:bg-surface-2"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "rounded-lg px-4 py-1.5 text-[12.5px] font-medium transition-opacity",
            canSubmit
              ? "bg-ink text-paper hover:opacity-90"
              : "cursor-not-allowed bg-surface-2 text-ink-3",
          )}
        >
          추가
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// TypeToggle — 해야할 것 / 피해야할 것 토글
// ─────────────────────────────────────────────────────────────
function TypeToggle({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: "do" | "avoid";
  onClick: () => void;
  children: ReactNode;
}) {
  const activeClass =
    tone === "do"
      ? "border-aligned bg-aligned-soft text-aligned"
      : "border-resisted bg-resisted-soft text-resisted-deep";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg border py-2 text-[13px] transition-colors",
        active
          ? cn(activeClass, "font-medium")
          : "border-line bg-paper text-ink-2 hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
