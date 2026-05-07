"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Pill } from "@/components/ui";
import type { NameInputSubmit } from "@/components/types";

export interface NameInputProps {
  /** 이름 칸 초깃값 */
  defaultName?: string;
  /** 생일 초깃값 — 'YYYY-MM-DD' */
  defaultBirthday?: string | null;
  /** 입력 힌트 칩 */
  suggestions?: string[];
  /** 다음 단계로 진행 */
  onSubmit?: (payload: NameInputSubmit) => void;
  /** 건너뛰기 (이름이 없으면 호출되지 않게 부모에서 막을 것) */
  onSkip?: () => void;
  /** 진행 중 (네트워크 호출) 표시 */
  submitting?: boolean;
}

const DEFAULT_SUGGESTIONS = ["엄마", "자기야", "민지", "형", "할머니"];

export function NameInput({
  defaultName = "",
  defaultBirthday = null,
  suggestions = DEFAULT_SUGGESTIONS,
  onSubmit,
  onSkip,
  submitting,
}: NameInputProps) {
  const [name, setName] = useState(defaultName);
  const [birthday, setBirthday] = useState<string>(defaultBirthday ?? "");

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && !submitting;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit?.({
      displayName: trimmed,
      birthday: birthday ? birthday : null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-screen flex-col px-7 pt-16 pb-8"
      aria-label="기억할 일 — 이름 입력"
    >
      <div className="mb-6 text-[11px] tracking-[0.2em] text-ink-3">
        STEP 1 / 1
      </div>

      <h2 className="m-0 mb-9 text-[26px] font-medium leading-[1.4] tracking-[-0.02em] text-ink">
        그 사람을
        <br />
        어떻게 부르시나요?
      </h2>

      {/* underline 변형은 Input 자체가 밑줄을 그린다.
          wrapper 에 또 border 를 두면 줄이 두 개로 보이므로 두지 않는다. */}
      <Input
        variant="underline"
        display
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
        autoFocus
        maxLength={40}
        aria-label="이름"
      />

      <div className="mb-9 flex flex-wrap gap-2" style={{ marginTop: 18 }}>
        {suggestions.map((s) => (
          <Pill
            key={s}
            tone="muted"
            size="sm"
            interactive
            role="button"
            tabIndex={0}
            onClick={() => setName(s)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setName(s);
              }
            }}
          >
            {s}
          </Pill>
        ))}
      </div>

      {/* 이름과 같은 underline 패턴.
          업계 표준: 선택 필드는 노출 + (선택) 라벨 + 빈 값 = 선택 안 함.
          비가역 disclosure 패턴은 사용하지 않는다. */}
      <div className="mt-auto mb-4">
        <div className="mb-2 text-[11.5px] tracking-[0.08em] text-ink-2">
          생일 (선택)
        </div>
        <Input
          variant="underline"
          display
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          aria-label="생일"
        />
        <div className="mt-2 text-[12px] text-ink-2">
          D-day와 올해 남은 통화 횟수 계산에 쓰여요
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onSkip}
          disabled={submitting}
          className="flex-1"
        >
          건너뛰기
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!canSubmit}
          className="flex-[2]"
        >
          {submitting ? "..." : "시작"}
        </Button>
      </div>
    </form>
  );
}
