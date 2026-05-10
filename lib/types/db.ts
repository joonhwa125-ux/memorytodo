// 기억(Memory) DB 타입
// supabase/migrations/0001_init.sql 과 동기화 유지

export type IntentType = "do" | "avoid";

export type Quadrant =
  | "aligned"          // 했어야 했고 했음
  | "procrastinated"   // 했어야 했는데 못함
  | "relapsed"         // 안 했어야 했는데 함
  | "resisted";        // 안 했어야 했고 안 함

export type SessionType = "realtime" | "daily_review";

export interface Profile {
  id: string;
  created_at: string;
}

export interface Person {
  id: string;
  user_id: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportantDate {
  id: string;
  person_id: string;
  user_id: string;
  label: string;          // 자유 입력 라벨 (예: "생일", "결혼기념일")
  date_value: string;     // YYYY-MM-DD (매년 반복 기준)
  created_at: string;
  updated_at: string;
}

export interface Intent {
  id: string;
  person_id: string;
  user_id: string;
  intent_type: IntentType;
  title: string;
  why: string | null;
  due_date: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntentEvent {
  id: string;
  intent_id: string | null;
  person_id: string;
  user_id: string;
  quadrant: Quadrant;
  recorded_at: string;
  trigger_note: string | null;
  session_type: SessionType;
  created_at: string;
}

// =====================================================
// View-model types (UI 친화)
// =====================================================

export interface QuadrantSummary {
  aligned: number;
  procrastinated: number;
  relapsed: number;
  resisted: number;
  total: number;
}

export interface PersonWithStats extends Person {
  resisted_count_this_month: number;
}

/**
 * 가장 가까운 다음 발생일을 가진 의미있는 날.
 * 홈 stats 영역에서 D-day로 노출하기 위한 view-model.
 */
export interface UpcomingImportantDate {
  label: string;
  date_value: string;     // 원본 날짜 (YYYY-MM-DD)
  days_until: number;     // 다음 발생일까지 남은 일수 (오늘=0)
  next_occurrence: string; // 다음 발생일 (YYYY-MM-DD)
}
