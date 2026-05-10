"use client";

import { Avatar } from "@/components/ui";

export interface PersonHeaderProps {
  /**
   * 사람의 부르는 이름. 관계는 묻지 않는다.
   */
  displayName: string;
}

/**
 * 홈 화면 상단의 사람 헤더.
 *
 * MVP 기준: 아바타와 이름만 노출한다.
 * (이전 버전에 있던 "마지막으로 떠올린 날" 부제는 의미가 모호해 제거됨.
 *  필요 시 향후 별도 stats로 재도입 검토.)
 */
export function PersonHeader({ displayName }: PersonHeaderProps) {
  return (
    <header className="mb-2 flex items-center gap-3">
      <Avatar name={displayName} size="md" />
      <div className="leading-[1.3]">
        <div className="text-[17px] font-medium text-ink">{displayName}</div>
      </div>
    </header>
  );
}
