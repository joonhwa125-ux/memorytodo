"use client";

import type { ReactNode } from "react";
import type { UniversalStatsData } from "@/components/types";

export interface UniversalStatsProps {
  data: UniversalStatsData;
}

interface StatBoxProps {
  label: string;
  value: ReactNode;
  sub?: string;
}

function StatBox({ label, value, sub }: StatBoxProps) {
  return (
    <div className="flex-1 rounded-xl border border-line bg-surface px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.08em] text-ink-3">
        {label}
      </div>
      <div className="mt-1 text-[15px] font-medium tracking-[-0.01em] text-ink">
        {value}
      </div>
      {sub ? <div className="mt-0.5 text-[10.5px] text-ink-3">{sub}</div> : null}
    </div>
  );
}

export function UniversalStats({ data }: UniversalStatsProps) {
  const { weekendsLeft, weekendsUntilLabel, birthdayDday, birthdayLabel } =
    data;

  return (
    <section
      className="mb-[22px] mt-3.5 flex gap-2"
      aria-label="시간 감각"
    >
      <StatBox
        label="올해 남은 주말"
        value={
          <>
            <em className="not-italic text-[18px] font-semibold text-resisted-deep">
              {weekendsLeft}
            </em>
            번
          </>
        }
        sub={weekendsUntilLabel}
      />
      <StatBox
        label="생일까지"
        value={
          birthdayDday === null ? (
            <span className="text-ink-3">미설정</span>
          ) : (
            <em className="not-italic text-[18px] font-semibold text-resisted-deep">
              D{birthdayDday > 0 ? `-${birthdayDday}` : birthdayDday === 0 ? "-day" : `+${Math.abs(birthdayDday)}`}
            </em>
          )
        }
        sub={birthdayLabel ?? undefined}
      />
    </section>
  );
}
