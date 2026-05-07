"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const onboardingSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "이름을 적어주세요")
    .max(40, "이름이 너무 깁니다"),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식")
    .optional()
    .or(z.literal("")),
});

export type OnboardingResult =
  | { ok: true; person_id: string }
  | { ok: false; error: string };

/**
 * 첫 등록 — 사용자가 떠올린 한 사람을 생성.
 * 이미 활성 person 이 있으면 갱신.
 */
export async function completeOnboarding(
  formData: FormData
): Promise<OnboardingResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다" };
  }

  const parsed = onboardingSchema.safeParse({
    display_name: formData.get("display_name"),
    birthday: formData.get("birthday") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "입력 오류",
    };
  }

  const supabase = await createClient();
  const birthday =
    parsed.data.birthday && parsed.data.birthday !== ""
      ? parsed.data.birthday
      : null;

  // 기존 활성 person 이 있는지 확인
  const { data: existing } = await supabase
    .from("persons")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("persons")
      .update({ display_name: parsed.data.display_name, birthday })
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true, person_id: existing.id };
  }

  const { data: created, error } = await supabase
    .from("persons")
    .insert({
      user_id: user.id,
      display_name: parsed.data.display_name,
      birthday,
    })
    .select("id")
    .single();

  if (error || !created) {
    return { ok: false, error: error?.message ?? "등록 실패" };
  }

  revalidatePath("/", "layout");
  return { ok: true, person_id: created.id };
}

/**
 * 등록 후 홈으로 이동.
 */
export async function completeOnboardingAndRedirect(formData: FormData) {
  const result = await completeOnboarding(formData);
  if (result.ok) {
    redirect("/");
  }
  return result;
}
