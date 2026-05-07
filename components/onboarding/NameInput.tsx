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
  const [showBirthdayInput, setShowBirthdayInput] = useState(
    Boolean(defaultBirthday),
  );

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

      <h2 className="m-0 mb-3 text-[26px] font-medium leading-[1.4] tracking-[-0.02em] text-ink">
        그 사람을
        <br />
        어떻게 부르시나요?
      </h2>
      <p className="mb-9 text-[13px] leading-[1.6] text-ink-2">
        관계는 묻지 않습니다. 부르는 이름이면 충분합니다.
      </p>

      <div className="border-b-[1.5px] border-ink pb-3 pt-1.5">
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
      </div>

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

      <div className="mt-auto mb-4 rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 text-[11.5px] tracking-[0.08em] text-ink-3">
          생일 (선택)
        </div>
        {showBirthdayInput ? (
          <Input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            aria-label="생일"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowBirthdayInput(true)}
            className="text-left text-[14px] text-ink-2 hover:text-ink"
          >
            <em className="font-light not-italic text-ink-3">
              나중에 추가해도 됩니다 · 올해 남은 통화 횟수, D-day에 사용됩니다
            </em>
          </button>
        )}
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
