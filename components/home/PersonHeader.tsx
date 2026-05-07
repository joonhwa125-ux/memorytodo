"use client";

import { Avatar } from "@/components/ui";
import type { Person } from "@/components/types";

export interface PersonHeaderProps {
  person: Pick<Person, "displayName" | "lastThoughtOfAt">;
  /**
   * 마지막으로 떠올린 시점에 대한 표시용 라벨.
   * 백엔드에서 포맷된 문자열을 내려주면 그대로 사용한다.
   * 예: "5월 2일", "어제", "방금"
   */
  lastThoughtOfLabel?: string | null;
}

export function PersonHeader({
  person,
  lastThoughtOfLabel,
}: PersonHeaderProps) {
  const subtitle = lastThoughtOfLabel
    ? `마지막으로 떠올린 날 · ${lastThoughtOfLabel}`
    : person.lastThoughtOfAt
      ? `마지막으로 떠올린 날 · ${person.lastThoughtOfAt}`
      : "오늘 처음 만나는 화면";

  return (
    <header className="mb-2 flex items-center gap-3">
      <Avatar name={person.displayName} size="md" />
      <div className="leading-[1.3]">
        <div className="text-[17px] font-medium text-ink">
          {person.displayName}
        </div>
        <div className="mt-0.5 text-[11.5px] text-ink-3">{subtitle}</div>
      </div>
    </header>
  );
}
