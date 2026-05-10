// 진입점 — backend(localhost:5000) 기반 신규 흐름으로 안내.
// 기존 Supabase 기반 홈 화면은 v0.2 스키마 변경 + backend 이전으로 잠시 꺼둠.

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/intents");
}
