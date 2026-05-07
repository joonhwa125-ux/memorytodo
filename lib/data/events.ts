import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { IntentEvent, Quadrant } from "@/lib/types/db";
import { summarizeQuadrants } from "@/lib/utils/quadrant";

/**
 * 특정 사람의 최근 N일 사건 목록 (recorded_at 내림차순).
 */
export async function getRecentEvents(
  personId: string,
  days: number = 30
): Promise<IntentEvent[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("intent_events")
    .select("*")
    .eq("person_id", personId)
    .gte("recorded_at", since.toISOString())
    .order("recorded_at", { ascending: false });

  if (error) {
    console.error("[getRecentEvents]", error);
    return [];
  }

  return data ?? [];
}

/**
 * 특정 사람의 이번 달 사분면 카운트.
 */
export async function getMonthlyQuadrantSummary(personId: string) {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("intent_events")
    .select("quadrant, recorded_at")
    .eq("person_id", personId)
    .gte("recorded_at", monthStart.toISOString());

  if (error) {
    console.error("[getMonthlyQuadrantSummary]", error);
    return summarizeQuadrants([]);
  }

  return summarizeQuadrants(
    (data ?? []).map((row) => ({ quadrant: row.quadrant as Quadrant }) as IntentEvent)
  );
}

/**
 * 특정 사람의 마지막 사건 시각.
 */
export async function getLastEventAt(
  personId: string
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("intent_events")
    .select("recorded_at")
    .eq("person_id", personId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data.recorded_at;
}
