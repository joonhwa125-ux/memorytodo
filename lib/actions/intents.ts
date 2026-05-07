"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { IntentType } from "@/lib/types/db";

const createIntentSchema = z.object({
  person_id: z.string().uuid(),
  intent_type: z.enum(["do", "avoid"]),
  title: z.string().trim().min(1, "내용을 적어주세요").max(200),
  why: z.string().trim().max(500).optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type CreateIntentInput = {
  person_id: string;
  intent_type: IntentType;
  title: string;
  why?: string;
  due_date?: string;
};

export type CreateIntentResult =
  | { ok: true; intent_id: string }
  | { ok: false; error: string };

/**
 * 의도 생성 — 홈의 "오늘 마음에 둔 것" 추가.
 */
export async function createIntent(
  input: CreateIntentInput
): Promise<CreateIntentResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다" };

  const parsed = createIntentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "입력 오류",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intents")
    .insert({
      user_id: user.id,
      person_id: parsed.data.person_id,
      intent_type: parsed.data.intent_type,
      title: parsed.data.title,
      why: parsed.data.why ?? null,
      due_date: parsed.data.due_date ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "생성 실패" };
  }

  revalidatePath("/");
  return { ok: true, intent_id: data.id };
}

/**
 * 의도 아카이브 (목표 재검토 시 "더 작게 쪼개기" 또는 제거).
 */
export async function archiveIntent(intentId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "로그인이 필요합니다" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("intents")
    .update({ is_archived: true })
    .eq("id", intentId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}
