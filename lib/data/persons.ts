import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Person } from "@/lib/types/db";

/**
 * 현재 사용자의 활성 person 1명을 반환. (MVP: 1명만 등록)
 * 미등록 상태면 null.
 */
export async function getActivePerson(): Promise<Person | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getActivePerson]", error);
    return null;
  }

  return data;
}
