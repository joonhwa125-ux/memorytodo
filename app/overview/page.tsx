import { requireOnboarded } from "@/lib/auth/requireOnboarded";
import { getRecentEvents } from "@/lib/data/events";
import { summarizeQuadrants } from "@/lib/utils/quadrant";
import Link from "next/link";
import type { IntentEvent, Quadrant } from "@/lib/types/db";

export const metadata = {
  title: "지난 30일 · 기억할 일",
};

const DAYS = 30;

export default async function OverviewPage() {
  const { person } = await requireOnboarded();
  const events = await getRecentEvents(person.id, DAYS);
  const summary = summarizeQuadrants(events);
  const strand = buildStrand(events, DAYS);
  const daysWithIntent = countDaysWithEvents(events);
  const alignmentCount = summary.aligned + summary.resisted;

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col px-5 pb-10 pt-6">
      <header className="mb-6 flex items-center">
        <Link
          href="/"
          className="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14.5px] text-ink transition-colors hover:bg-surface-2"
          aria-label="홈으로"
        >
          <span aria-hidden className="text-[18px] leading-none">‹</span>
          <span>{person.display_name}</span>
        </Link>
      </header>

      <section className="mb-6">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-2">
          지난 30일
        </div>
        <p className="mt-2 text-[16px] leading-[1.55] text-ink">
          마음을 둔 날이{" "}
          <strong className="font-semibold">{daysWithIntent}일</strong>
          이었어.
          {alignmentCount > 0 ? (
            <em className="mt-1 block font-light not-italic text-ink-2">
              그중 {alignmentCount}번을 의도한 대로 보냈어.
            </em>
          ) : null}
        </p>
      </section>

      <section
        className="mb-7 grid grid-cols-2 gap-2"
        aria-label="4사분면 카운트"
      >
        <QuadCell quadrant="resisted" count={summary.resisted} hero />
        <QuadCell quadrant="aligned" count={summary.aligned} />
        <QuadCell quadrant="procrastinated" count={summary.procrastinated} />
        <QuadCell quadrant="relapsed" count={summary.relapsed} />
      </section>

      <StrandSection strand={strand} />

      {summary.total === 0 && (
        <p className="mt-6 text-center text-[12.5px] leading-[1.6] text-ink-2">
          아직 기록이 없어요.
          <br />
          홈에서 의도를 남기거나, 빠른 기록을 눌러보세요.
        </p>
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// 4-Quadrant Cell
// ─────────────────────────────────────────────────────────────
interface QuadMeta {
  upper: string;
  subtitle: string;
  labelClass: string;
  numberClass: string;
}

const QUAD_META: Record<Quadrant, QuadMeta> = {
  resisted: {
    upper: "RESISTED",
    subtitle: "참아냈어",
    labelClass: "text-resisted-deep",
    numberClass: "text-resisted-deep",
  },
  aligned: {
    upper: "ALIGNED",
    subtitle: "해냈어",
    labelClass: "text-aligned",
    numberClass: "text-ink",
  },
  procrastinated: {
    upper: "PROCRASTINATED",
    subtitle: "미뤘어",
    labelClass: "text-procras",
    numberClass: "text-ink",
  },
  relapsed: {
    upper: "RELAPSED",
    subtitle: "또 했어",
    labelClass: "text-relapsed",
    numberClass: "text-ink",
  },
};

function QuadCell({
  quadrant,
  count,
  hero,
}: {
  quadrant: Quadrant;
  count: number;
  hero?: boolean;
}) {
  const m = QUAD_META[quadrant];
  return (
    <div
      className={
        "min-h-[108px] rounded-2xl border border-line bg-paper p-4 shadow-soft" +
        (hero
          ? " ring-1 ring-resisted/30 shadow-[0_0_24px_rgba(184,146,63,0.14)]"
          : "")
      }
    >
      <div
        className={`text-[10.5px] font-semibold tracking-[0.14em] ${m.labelClass}`}
      >
        {m.upper}
      </div>
      <div
        className={`mt-1.5 text-[34px] font-medium leading-none tracking-[-0.04em] ${m.numberClass}`}
      >
        {count}
      </div>
      <div className="mt-2 text-[12.5px] leading-[1.4] text-ink-2">
        {m.subtitle}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 30-day Strand
// ─────────────────────────────────────────────────────────────
function StrandSection({
  strand,
}: {
  strand: { date: string; primary: Quadrant | null }[];
}) {
  return (
    <section aria-label="30일 흐름">
      <div className="mb-2.5 flex justify-between text-[11.5px] tracking-[0.1em] text-ink-2">
        <span>30일 흐름</span>
        <span>오늘 →</span>
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
      >
        {strand.map((cell, i) => (
          <div
            key={i}
            className={cellClass(cell.primary)}
            title={cell.date}
            aria-label={
              cell.primary
                ? `${cell.date} — ${QUAD_META[cell.primary].subtitle}`
                : `${cell.date} — 기록 없음`
            }
          />
        ))}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 text-[11.5px] text-ink-2">
        <Legend swatch="bg-resisted/85" label="참았어" />
        <Legend swatch="bg-aligned/70" label="해냈어" />
        <Legend swatch="bg-procras/55" label="미뤘어" />
        <Legend swatch="bg-relapsed/65" label="또 했어" />
      </div>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i
        aria-hidden
        className={`inline-block h-2.5 w-2.5 rounded-sm ${swatch}`}
      />
      {label}
    </span>
  );
}

function cellClass(q: Quadrant | null): string {
  const base = "aspect-square rounded";
  if (!q) return `${base} bg-surface`;
  switch (q) {
    case "resisted":
      return `${base} bg-resisted/85`;
    case "aligned":
      return `${base} bg-aligned/70`;
    case "procrastinated":
      return `${base} bg-procras/55`;
    case "relapsed":
      return `${base} bg-relapsed/65`;
  }
}

// ─────────────────────────────────────────────────────────────
// Strand 빌드 — 최근 N일을 옛 → 오늘 순으로
// 한 날에 여러 사건이 있으면 우선순위 (resisted 영웅 우선)로 1개 선택
// ─────────────────────────────────────────────────────────────
function buildStrand(
  events: IntentEvent[],
  days: number,
): { date: string; primary: Quadrant | null }[] {
  const byDate = new Map<string, Quadrant[]>();
  for (const ev of events) {
    const date = new Date(ev.recorded_at).toISOString().slice(0, 10);
    const list = byDate.get(date) ?? [];
    list.push(ev.quadrant);
    byDate.set(date, list);
  }

  const strand: { date: string; primary: Quadrant | null }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const list = byDate.get(date) ?? [];
    strand.push({ date, primary: pickPrimary(list) });
  }
  return strand;
}

function pickPrimary(events: Quadrant[]): Quadrant | null {
  if (events.length === 0) return null;
  // 영웅 우선 + 긍정 우선 정렬
  const order: Quadrant[] = [
    "resisted",
    "aligned",
    "procrastinated",
    "relapsed",
  ];
  for (const q of order) {
    if (events.includes(q)) return q;
  }
  return events[0];
}

function countDaysWithEvents(events: IntentEvent[]): number {
  const dates = new Set<string>();
  for (const ev of events) {
    dates.add(new Date(ev.recorded_at).toISOString().slice(0, 10));
  }
  return dates.size;
}
