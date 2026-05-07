// 4사분면 (Akrasia) 유틸
import type { IntentEvent, Quadrant, QuadrantSummary } from "@/lib/types/db";

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  aligned: "해냈어",
  procrastinated: "미뤘어",
  relapsed: "또 했어",
  resisted: "참았어",
};

export const QUADRANT_DESCRIPTIONS: Record<Quadrant, string> = {
  aligned: "의도한 걸 해냈어요",
  procrastinated: "해야 했지만 못 했어요",
  relapsed: "안 하려던 걸 했어요",
  resisted: "피하려던 걸 참아냈어요",
};

/**
 * 4사분면 카운트 집계
 */
export function summarizeQuadrants(events: IntentEvent[]): QuadrantSummary {
  const summary: QuadrantSummary = {
    aligned: 0,
    procrastinated: 0,
    relapsed: 0,
    resisted: 0,
    total: 0,
  };

  for (const ev of events) {
    summary[ev.quadrant] += 1;
    summary.total += 1;
  }

  return summary;
}

/**
 * 의도-행동 일치율 (0~1)
 *   = (aligned + resisted) / total
 * "긍정적 자기일치"로 간주되는 두 사분면의 비율.
 */
export function alignmentRate(summary: QuadrantSummary): number {
  if (summary.total === 0) return 0;
  return (summary.aligned + summary.resisted) / summary.total;
}

/**
 * Akrasia Index (0~1, 낮을수록 자기일치)
 *   = (procrastinated + relapsed) / total
 */
export function akrasiaIndex(summary: QuadrantSummary): number {
  if (summary.total === 0) return 0;
  return (summary.procrastinated + summary.relapsed) / summary.total;
}
