"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuickRecord } from "@/components/home";
import { recordEvent } from "@/lib/actions/events";
import { quadrantFromRecordKind } from "@/lib/mappers";
import { cn } from "@/components/ui";
import type { RecordKind } from "@/components/types";

interface Props {
  personId: string;
}

const TOAST_LABELS: Record<RecordKind, string> = {
  aligned: "해냈어",
  resisted: "참았어",
  procras: "미뤘어",
  relapsed: "또 했어",
};

const TOAST_TONES: Record<RecordKind, string> = {
  aligned: "border-aligned/40 bg-aligned-soft text-aligned",
  resisted: "border-resisted/40 bg-resisted-soft text-resisted-deep",
  procras: "border-procras/40 bg-procras-soft text-procras",
  relapsed: "border-relapsed/40 bg-relapsed-soft text-relapsed",
};

/**
 * QuickRecord ↔ recordEvent 연결.
 * - pending: 클릭 시 해당 버튼에 ring 표시 (~200ms)
 * - 성공 시: 화면 하단에 카테고리 색조의 토스트 1.6초 노출
 * - intent_id 없음 (의도와 무관한 "지금 이 순간" 기록)
 */
export function HomeQuickRecord({ personId }: Props) {
  const [pending, setPending] = useState<RecordKind | null>(null);
  const [toast, setToast] = useState<{ kind: RecordKind; id: number } | null>(
    null,
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRecord(kind: RecordKind) {
    setPending(kind);
    setError(null);

    startTransition(async () => {
      const result = await recordEvent({
        person_id: personId,
        quadrant: quadrantFromRecordKind(kind),
        session_type: "realtime",
      });
      setPending(null);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const id = Date.now();
      setToast({ kind, id });
      // 1.6초 후 사라짐 — 같은 카테고리 연속 클릭 시 새 토스트로 갱신
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 1600);
    });
  }

  return (
    <>
      <QuickRecord onRecord={handleRecord} pendingKind={pending} />

      {error && (
        <div
          role="alert"
          className="mt-2 rounded-xl border border-relapsed/40 bg-relapsed-soft px-3 py-2 text-[12px] text-ink"
        >
          기록 실패: {error}
        </div>
      )}

      {/* Toast — 화면 하단 가운데 고정 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              role="status"
              aria-live="polite"
              className={cn(
                "rounded-full border px-4 py-2 text-[12.5px] font-medium shadow-card",
                TOAST_TONES[toast.kind],
              )}
            >
              {TOAST_LABELS[toast.kind]} · 기록됐어요
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
