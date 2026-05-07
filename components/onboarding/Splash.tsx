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
  /** 푸터 안내 (기본: 없음). 첫 화면은 컨셉 전달에 집중하기 위해 비워둠. */
  footnote?: string;
}

export function Splash({
  onStart,
  brand = "기억.할 일",
  headlineTop = "한 사람을 향한",
  headlineBottom = "오늘 할 일을 적습니다.",
  subline = "매일 하나씩, 닿고 싶은 마음.",
  ctaLabel = "시작하기",
  footnote,
}: SplashProps) {
  return (
    <section
      className="flex min-h-screen items-center justify-center px-5"
      aria-label={`${brand} — 시작 화면`}
    >
      <div className="flex w-full max-w-[420px] flex-col items-center pt-10 pb-9 text-center">
        {/* Brand mark */}
        <h1 className="m-0 mb-9 flex flex-col items-center gap-3">
          <span
            style={{
              color: "#b8923f",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.18em",
            }}
          >
            {brand}
          </span>
          <span
            style={{
              display: "block",
              width: 24,
              height: 1,
              background: "rgba(184, 146, 63, 0.45)",
            }}
          />
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
