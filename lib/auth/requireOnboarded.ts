import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getUser";
import { getActivePerson } from "@/lib/data/persons";
import type { Person } from "@/lib/types/db";
import type { User } from "@supabase/supabase-js";

/**
 * 보호된 페이지용 가드.
 * - 세션 없음: / 으로 리다이렉트 (스플래시 노출)
 * - 세션은 있지만 person 미등록: /onboarding 으로 리다이렉트
 * - 정상: { user, person } 반환
 *
 * 사용자에게 인증은 노출되지 않음 — 익명 세션 기반.
 */
export async function requireOnboarded(): Promise<{
  user: User;
  person: Person;
}> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const person = await getActivePerson();
  if (!person) redirect("/onboarding");

  return { user, person };
}

/**
 * 세션은 필수, person 등록은 묻지 않는 가드.
 * 온보딩 페이지에서 사용 (이미 등록되어 있으면 홈으로 역방향 이동).
 */
export async function requireUserOnly(): Promise<{
  user: User;
  hasPerson: boolean;
}> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const person = await getActivePerson();
  return { user, hasPerson: !!person };
}
