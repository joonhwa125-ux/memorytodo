"use client";

import { useState, useTransition } from "react";
import { QuickRecord } from "@/components/home";
import { recordEvent } from "@/lib/actions/events";
import { quadrantFromRecordKind } from "@/lib/mappers";
import type { RecordKind } from "@/components/types";

interface Props {
  personId: string;
}

/**
 * QuickRecord 컴포넌트와 recordEvent Server Action 을 연결.
 * 옵티미스틱 pendingKind 표시 + 완료 후 페이지 revalidate.
 */
export function HomeQuickRecord({ personId }: Props) {
  const [pending, setPending] = useState<RecordKind | null>(null);
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
      }
    });
  }

  return (
    <>
      <QuickRecord onRecord={handleRecord} pendingKind={pending} />
      {error ? (
        <div
          role="alert"
          className="mt-2 rounded-xl border border-relapsed/30 bg-relapsed-soft px-3 py-2 text-[12px] text-ink"
        >
          기록 실패: {error}
        </div>
      ) : null}
    </>
  );
}
