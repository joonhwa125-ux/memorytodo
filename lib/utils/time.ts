// 시간 유틸 — 보편적 UX (남은 주말, 의미있는 날 D-day 등)
import {
  differenceInCalendarDays,
  endOfYear,
  startOfDay,
  isAfter,
  setYear,
  getYear,
} from "date-fns";
import type { ImportantDate, UpcomingImportantDate } from "@/lib/types/db";

/**
 * 올해 남은 주말(토요일 + 일요일) 횟수.
 * 오늘 포함, 12월 31일까지.
 */
export function remainingWeekendsThisYear(today: Date = new Date()): number {
  const start = startOfDay(today);
  const end = endOfYear(today);
  let count = 0;

  for (
    let d = new Date(start);
    !isAfter(d, end);
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.getDay();
    if (day === 0 || day === 6) count += 1;
  }

  return count;
}

/**
 * 올해 남은 주말 쌍(토+일을 한 주말로 계산) 횟수.
 * "주말에 한 번 통화" 같은 표현에 적합.
 */
export function remainingWeekendPairsThisYear(today: Date = new Date()): number {
  return Math.ceil(remainingWeekendsThisYear(today) / 2);
}

/**
 * 다음 발생일까지 남은 일수.
 * 매년 반복되는 날로 간주: 올해 발생일이 지났으면 내년 기준.
 *
 * @param dateValue YYYY-MM-DD 문자열
 */
export function daysUntilNextOccurrence(
  dateValue: string,
  today: Date = new Date()
): number {
  const base = new Date(dateValue + "T00:00:00");
  const todayStart = startOfDay(today);
  const thisYear = getYear(todayStart);
  let next = setYear(base, thisYear);

  if (isAfter(todayStart, next)) {
    next = setYear(base, thisYear + 1);
  }

  return differenceInCalendarDays(next, todayStart);
}

/**
 * 다음 발생일을 YYYY-MM-DD 문자열로 반환.
 */
export function nextOccurrenceDate(
  dateValue: string,
  today: Date = new Date()
): string {
  const base = new Date(dateValue + "T00:00:00");
  const todayStart = startOfDay(today);
  const thisYear = getYear(todayStart);
  let next = setYear(base, thisYear);

  if (isAfter(todayStart, next)) {
    next = setYear(base, thisYear + 1);
  }

  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * "M월 D일" 표기.
 */
export function formatMonthDay(dateValue: string): string {
  const d = new Date(dateValue + "T00:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/**
 * 의미있는 날 목록 중 가장 가까운 다음 발생일을 가진 항목 1개를 반환.
 * 비어 있으면 null.
 *
 * 홈 화면 stats에서 "[라벨] D-day"로 노출하기 위함.
 */
export function findClosestUpcomingDate(
  dates: ImportantDate[],
  today: Date = new Date()
): UpcomingImportantDate | null {
  if (dates.length === 0) return null;

  const enriched = dates.map((d) => ({
    label: d.label,
    date_value: d.date_value,
    days_until: daysUntilNextOccurrence(d.date_value, today),
    next_occurrence: nextOccurrenceDate(d.date_value, today),
  }));

  enriched.sort((a, b) => a.days_until - b.days_until);
  return enriched[0];
}
