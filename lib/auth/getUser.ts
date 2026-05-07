import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * 현재 인증된 유저 반환. 로그인 안 됐으면 null.
 * Server Components / Server Actions / Route Handlers 에서만 사용.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * 인증 필수. 미인증 시 null 반환 — 호출자가 redirect 결정.
 */
export async function requireUser(): Promise<User | null> {
  return getCurrentUser();
}
