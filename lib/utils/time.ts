// 시간 유틸 — 보편적 UX (남은 주말, 생일 D-day 등)
import {
  differenceInCalendarDays,
  endOfYear,
  startOfDay,
  isAfter,
  setYear,
  getYear,
} from "date-fns";

/**
 * 올해 남은 주말 (토요일 + 일요일) 횟수
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
 * 다음 생일까지 남은 일수.
 * birthday 가 null 이면 null 반환.
 * 올해 생일이 지났으면 내년 생일 기준.
 */
export function daysUntilNextBirthday(
  birthday: string | null,
  today: Date = new Date()
): number | null {
  if (!birthday) return null;

  const bday = new Date(birthday + "T00:00:00");
  const thisYear = getYear(today);
  let nextBday = setYear(bday, thisYear);

  if (isAfter(today, nextBday)) {
    nextBday = setYear(bday, thisYear + 1);
  }

  return differenceInCalendarDays(nextBday, startOfDay(today));
}

/**
 * 다음 생일 날짜 (M월 D일 표기)
 */
export function formatNextBirthday(birthday: string | null): string | null {
  if (!birthday) return null;
  const bday = new Date(birthday + "T00:00:00");
  return `${bday.getMonth() + 1}월 ${bday.getDate()}일`;
}
