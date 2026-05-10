// FE 컴포넌트 타입 ↔ DB 타입 변환 레이어
import type {
  Person as DbPerson,
  Quadrant,
} from "@/lib/types/db";
import type {
  Person as UiPerson,
  RecordKind,
} from "@/components/types";

/**
 * FE의 RecordKind ("procras") ↔ DB의 Quadrant ("procrastinated").
 * 나머지 3개는 동일 문자열.
 */
export function quadrantFromRecordKind(kind: RecordKind): Quadrant {
  return kind === "procras" ? "procrastinated" : kind;
}

export function recordKindFromQuadrant(q: Quadrant): RecordKind {
  return q === "procrastinated" ? "procras" : q;
}

/**
 * DB Person → UI Person 변환.
 * lastThoughtOfAt 은 호출자가 별도 조회한 값을 합쳐 전달.
 */
export function uiPersonFromDb(
  db: DbPerson,
  lastThoughtOfAt: string | null = null
): UiPerson {
  return {
    displayName: db.display_name,
    birthday: null, // schema에서 제거됨 (의미있는 날 테이블로 이전)
    lastThoughtOfAt,
  };
}

/**
 * "마지막으로 떠올린 날" 표시용 한국어 라벨.
 * 오늘/어제/N일 전/M월 D일.
 */
export function formatLastThoughtOf(
  iso: string | null,
  now: Date = new Date()
): string | null {
  if (!iso) return null;

  const d = new Date(iso);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfThen = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfThen.getTime()) / 86400000
  );

  if (diffDays <= 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
