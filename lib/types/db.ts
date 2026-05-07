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
  birthday: string | null;
  is_active: boolean;
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
  last_event_at: string | null;
  resisted_count_this_month: number;
}
