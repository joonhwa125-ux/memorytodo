"use client";

import { useTransition } from "react";
import { Splash } from "@/components/onboarding";
import { startAnonymousSession } from "@/lib/actions/auth";

/**
 * 미로그인 유저가 / 에 들어왔을 때 보는 스플래시.
 * "시작하기" 클릭 시 익명 세션 생성 후 /onboarding 으로 자동 이동.
 */
export function SplashLanding() {
  const [pending, startTransition] = useTransition();

  function handleStart() {
    if (pending) return;
    startTransition(async () => {
      await startAnonymousSession();
    });
  }

  return (
    <Splash
      onStart={handleStart}
      ctaLabel={pending ? "시작하는 중..." : "시작하기"}
      footnote="이름만 적으면 시작됩니다"
    />
  );
}
