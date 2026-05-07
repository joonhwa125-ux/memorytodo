"use client";

import { Button } from "@/components/ui";

export interface SplashProps {
  /** "시작하기" 버튼 콜백 */
  onStart?: () => void;
  /** 앱 마크 텍스트 (기본: "기억할 일") */
  brand?: string;
  /** 메인 카피 라인 1 (기본: "한 사람과의 1년을") */
  headlineTop?: string;
  /** 메인 카피 라인 2 (기본: "조용히 기록합니다.") */
  headlineBottom?: string;
  /** 부속 카피 (기본: "당신이 가장 자주 떠올리는 한 사람.") */
  subline?: string;
  /** CTA 라벨 (기본: "시작하기") */
  ctaLabel?: string;
  /** 푸터 안내 (기본: "이름만 적으면 시작됩니다") */
  footnote?: string;
}

export function Splash({
  onStart,
  brand = "기억할 일",
  headlineTop = "한 사람과의 1년을",
  headlineBottom = "조용히 기록합니다.",
  subline = "당신이 가장 자주 떠올리는 한 사람.",
  ctaLabel = "시작하기",
  footnote = "이름만 적으면 시작됩니다",
}: SplashProps) {
  return (
    <section
      className="flex min-h-screen items-center justify-center px-5"
      aria-label={`${brand} — 시작 화면`}
    >
      <div className="flex w-full max-w-[420px] flex-col items-center pt-10 pb-9 text-center">
        {/* Brand mark = 페이지 타이틀 (semantic h1, 시각적 pill) */}
        <h1
          className="bg-mark-gradient m-0 mb-9 grid place-items-center rounded-[22px] px-5"
          style={{
            minWidth: 88,
            height: 64,
            color: "#fff8e6",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            boxShadow: "0 16px 40px rgba(184, 146, 63, 0.32)",
          }}
        >
          {brand}
        </h1>

        <p className="m-0 mb-12 max-w-[280px] text-[16px] leading-[1.65] text-ink">
          {headlineTop}
          <br />
          {headlineBottom}
          {subline ? (
            <em className="mt-2 block text-[14px] not-italic text-ink-2">
              {subline}
            </em>
          ) : null}
        </p>

        <Button variant="primary" size="lg" fullWidth onClick={onStart}>
          {ctaLabel}
        </Button>

        {footnote ? (
          <div className="mt-5 text-[12.5px] tracking-[0.02em] text-ink-2">
            {footnote}
          </div>
        ) : null}
      </div>
    </section>
  );
}
