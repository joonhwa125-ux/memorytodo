/**
 * 프론트엔드 임시 타입 정의.
 *
 * 백엔드 세션과 합칠 때 합의 후
 * `lib/types/` 또는 Supabase generated 타입과 통일할 예정.
 *
 * 디자인 레퍼런스: mockup/index.html
 */

/** 사용자가 "기억할 일"을 남기기로 한 한 사람 */
export interface Person {
  /** 표시 이름 (자유 입력, e.g. "엄마", "민지") */
  displayName: string;
  /** 생일 (선택) — ISO date 문자열 'YYYY-MM-DD' */
  birthday?: string | null;
  /** 마지막으로 기록을 남긴 시각 (선택) */
  lastThoughtOfAt?: string | null;
}

/** 4사분면 — 의도/행동 일치 분류 */
export type RecordKind = "aligned" | "resisted" | "procras" | "relapsed";

/** 홈 상단 보편 스탯 (나이/관계와 무관한 시간 감각) */
export interface UniversalStatsData {
  /** 올해 남은 주말 횟수 */
  weekendsLeft: number;
  /** 비교 기준 — 보통 "12월 31일까지" */
  weekendsUntilLabel: string;
  /** 생일까지 남은 일수 — 미설정 시 null */
  birthdayDday: number | null;
  /** 생일 표시 라벨 — 예: "8월 7일" */
  birthdayLabel?: string | null;
}

/** 온보딩 NameInput 제출 페이로드 */
export interface NameInputSubmit {
  displayName: string;
  birthday: string | null;
}
