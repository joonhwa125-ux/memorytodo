import { redirect } from "next/navigation";
import { requireUserOnly } from "@/lib/auth/requireOnboarded";
import { OnboardingFlow } from "./OnboardingFlow";

export const metadata = {
  title: "시작 · 기억",
};

export default async function OnboardingPage() {
  const { hasPerson } = await requireUserOnly();
  if (hasPerson) redirect("/");

  return <OnboardingFlow />;
}
