import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Intent } from "@/lib/types/db";

/**
 * 특정 사람의 미아카이브 의도 목록 (오늘 마음에 둔 것).
 * 최신 생성 순.
 */
export async function getActiveIntents(personId: string): Promise<Intent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("intents")
    .select("*")
    .eq("person_id", personId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getActiveIntents]", error);
    return [];
  }

  return data ?? [];
}
