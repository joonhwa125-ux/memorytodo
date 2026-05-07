"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NameInput } from "@/components/onboarding";
import { completeOnboarding } from "@/lib/actions/onboarding";
import type { NameInputSubmit } from "@/components/types";

export function OnboardingFlow() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(payload: NameInputSubmit) {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("display_name", payload.displayName);
      if (payload.birthday) fd.set("birthday", payload.birthday);

      const result = await completeOnboarding(fd);
      if (result.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="relative">
      {error ? (
        <div
          role="alert"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border border-relapsed/30 bg-paper px-4 py-2.5 text-[12.5px] text-ink shadow-card"
        >
          {error}
        </div>
      ) : null}

      <NameInput onSubmit={handleSubmit} submitting={pending} />
    </div>
  );
}
