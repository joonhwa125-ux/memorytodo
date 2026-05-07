"use client";

import { cn } from "@/components/ui";
import type { RecordKind } from "@/components/types";

export interface QuickRecordProps {
  /** 4사분면 중 하나를 눌렀을 때 호출 */
  onRecord?: (kind: RecordKind) => void;
  /** 진행 중 표시할 종류 (옵티미스틱 UI 등에서 사용) */
  pendingKind?: RecordKind | null;
  /** 헤더 라벨 (기본: "지금 이 순간 기록") */
  label?: string;
}

interface QuadDef {
  kind: RecordKind;
  tag: string;
  body: string;
  tagClass: string;
}

const QUADS: QuadDef[] = [
  {
    kind: "aligned",
    tag: "했어요",
    body: "의도한 걸 해냈어요",
    tagClass: "text-aligned",
  },
  {
    kind: "resisted",
    tag: "참았어요",
    body: "피하려던 걸 참아냈어요",
    tagClass: "text-resisted-deep",
  },
  {
    kind: "procras",
    tag: "또 미뤘어요",
    body: "해야 했지만 못 했어요",
    tagClass: "text-procras",
  },
  {
    kind: "relapsed",
    tag: "또 했어요",
    body: "안 하려던 걸 했어요",
    tagClass: "text-relapsed",
  },
];

export function QuickRecord({
  onRecord,
  pendingKind,
  label = "지금 이 순간 기록",
}: QuickRecordProps) {
  return (
    <section
      className={cn(
        "mt-3.5 rounded-[18px] border border-line-strong p-3.5",
        "bg-[linear-gradient(135deg,var(--color-present-soft),var(--color-resisted-soft))]",
      )}
      aria-label="빠른 기록"
    >
      <div className="mb-2.5 text-[11.5px] font-medium tracking-[0.06em] text-present">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {QUADS.map((q) => {
          const pending = pendingKind === q.kind;
          return (
            <button
              key={q.kind}
              type="button"
              disabled={Boolean(pendingKind) && !pending}
              onClick={() => onRecord?.(q.kind)}
              className={cn(
                "rounded-xl border border-line bg-paper px-2.5 py-2.5 text-left",
                "text-[12.5px] leading-[1.3] text-ink shadow-soft",
                "transition-[transform,opacity] duration-150",
                "hover:bg-surface active:scale-[0.99]",
                "disabled:opacity-50",
                pending && "ring-2 ring-present/40",
              )}
            >
              <span
                className={cn(
                  "mb-[3px] block text-[10px] font-medium tracking-[0.08em]",
                  q.tagClass,
                )}
              >
                {q.tag}
              </span>
              {q.body}
            </button>
          );
        })}
      </div>
    </section>
  );
}
