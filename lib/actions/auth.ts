"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * 익명 세션 시작 — 스플래시 "시작하기" 클릭이 호출.
 * Supabase Anonymous Sign-Ins 가 활성화되어 있어야 함.
 *
 * 사용자에게 인증은 보이지 않습니다. RLS 를 작동시키기 위한 내부 UUID 만 만들어주는 역할.
 */
export async function startAnonymousSession(): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw new Error(`익명 세션 생성 실패: ${error.message}`);
    }
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

/**
 * 세션 종료 — 개발 중 상태 리셋용. UI 에는 노출하지 않음.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
