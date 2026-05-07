"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Quadrant, SessionType } from "@/lib/types/db";

const recordSchema = z.object({
  person_id: z.string().uuid(),
  intent_id: z.string().uuid().nullable().optional(),
  quadrant: z.enum(["aligned", "procrastinated", "relapsed", "resisted"]),
  trigger_note: z.string().max(500).optional(),
  session_type: z.enum(["realtime", "daily_review"]).default("realtime"),
});

export type RecordEventInput = {
  person_id: string;
  intent_id?: string | null;
  quadrant: Quadrant;
  trigger_note?: string;
  session_type?: SessionType;
};

export type RecordEventResult =
  | { ok: true; event_id: string }
  | { ok: false; error: string };

/**
 * 4사분면 이벤트 기록 — 홈의 "지금 이 순간 기록" 또는 저녁 회고에서 사용.
 */
export async function recordEvent(
  input: RecordEventInput
): Promise<RecordEventResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다" };

  const parsed = recordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "입력 오류",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intent_events")
    .insert({
      user_id: user.id,
      person_id: parsed.data.person_id,
      intent_id: parsed.data.intent_id ?? null,
      quadrant: parsed.data.quadrant,
      trigger_note: parsed.data.trigger_note ?? null,
      session_type: parsed.data.session_type ?? "realtime",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "기록 실패" };
  }

  revalidatePath("/");
  return { ok: true, event_id: data.id };
}

/**
 * 사건 삭제 (회고 중 잘못 분류한 경우 되돌리기용).
 */
export async function deleteEvent(eventId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요합니다" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("intent_events")
    .delete()
    .eq("id", eventId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}
