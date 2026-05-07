import { getCurrentUser } from "@/lib/auth/getUser";
import { getActivePerson } from "@/lib/data/persons";
import { getActiveIntents } from "@/lib/data/intents";
import {
  getMonthlyQuadrantSummary,
  getLastEventAt,
} from "@/lib/data/events";
import {
  remainingWeekendsThisYear,
  daysUntilNextBirthday,
  formatNextBirthday,
} from "@/lib/utils/time";
import { uiPersonFromDb, formatLastThoughtOf } from "@/lib/mappers";
import { redirect } from "next/navigation";
import { PersonHeader, UniversalStats } from "@/components/home";
import { Card, Pill } from "@/components/ui";
import { SplashLanding } from "./SplashLanding";
import { HomeQuickRecord } from "./HomeQuickRecord";
import type { Intent } from "@/lib/types/db";

export default async function HomePage() {
  // 미로그인: 스플래시 랜딩
  const user = await getCurrentUser();
  if (!user) {
    return <SplashLanding />;
  }

  // 로그인했지만 person 없음: 온보딩
  const personDb = await getActivePerson();
  if (!personDb) redirect("/onboarding");

  // 홈 데이터 병렬 조회
  const [intents, summary, lastEventAt] = await Promise.all([
    getActiveIntents(personDb.id),
    getMonthlyQuadrantSummary(personDb.id),
    getLastEventAt(personDb.id),
  ]);

  const person = uiPersonFromDb(personDb, lastEventAt);
  const lastThoughtOfLabel = formatLastThoughtOf(lastEventAt);

  const today = new Date();
  const yearEndLabel = `${today.getFullYear()} 12월 31일까지`;
  const weekendsLeft = remainingWeekendsThisYear(today);
  const birthdayDday = daysUntilNextBirthday(personDb.birthday, today);
  const birthdayLabel = formatNextBirthday(personDb.birthday);

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col px-5 pb-10 pt-6">
      <PersonHeader
        person={person}
        lastThoughtOfLabel={lastThoughtOfLabel}
      />

      <UniversalStats
        data={{
          weekendsLeft,
          weekendsUntilLabel: yearEndLabel,
          birthdayDday,
          birthdayLabel,
        }}
      />

      <IntentsBlock intents={intents} />

      <HomeQuickRecord personId={personDb.id} />

      <ResistedConstellation count={summary.resisted} />
    </main>
  );
}

// ────────────────────────────────────────────────────────────
// IntentsBlock — "오늘 마음에 둔 것"
// ────────────────────────────────────────────────────────────
function IntentsBlock({ intents }: { intents: Intent[] }) {
  return (
    <section className="mb-[18px]" aria-label="오늘 마음에 둔 것">
      <header className="mb-2.5 flex items-baseline justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
          오늘 마음에 둔 것
        </span>
        <Pill tone="muted" size="sm">
          {intents.length}
        </Pill>
      </header>

      <Card padding="md">
        {intents.length === 0 ? (
          <p className="m-0 py-2 text-center text-[13px] leading-[1.55] text-ink-3">
            아직 비어있어요. 떠오르면 적어주세요.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {intents.map((intent, i) => (
              <li
                key={intent.id}
                className={
                  "flex items-start gap-3 py-3" +
                  (i < intents.length - 1
                    ? " border-b border-line"
                    : "")
                }
              >
                <span
                  className={
                    "mt-[7px] block h-2 w-2 flex-shrink-0 rounded-full " +
                    (intent.intent_type === "do"
                      ? "bg-aligned shadow-[0_0_8px_var(--color-aligned-soft)]"
                      : "bg-resisted shadow-[0_0_8px_var(--color-resisted-glow)]")
                  }
                  aria-label={intent.intent_type === "do" ? "할 것" : "피할 것"}
                />
                <div className="flex-1 text-[14px] leading-[1.45] text-ink">
                  {intent.title}
                  {intent.why ? (
                    <span className="mt-[3px] block text-[11.5px] text-ink-3">
                      {intent.why}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// ResistedConstellation — 이번 달 영웅 사분면
// ────────────────────────────────────────────────────────────
function ResistedConstellation({ count }: { count: number }) {
  const stars = Array.from({ length: Math.min(count, 11) });
  return (
    <section
      aria-label="이번 달 참아낸 횟수"
      className="mt-[22px] rounded-[18px] border border-line bg-paper px-4 py-[18px] text-center shadow-soft"
      style={{
        backgroundImage:
          "radial-gradient(120px 80px at 50% 50%, rgba(184, 146, 63, 0.10), transparent 70%)",
      }}
    >
      <div className="mb-2.5 text-[11px] font-medium tracking-[0.16em] text-resisted-deep">
        RESISTED · 이번 달
      </div>

      {count > 0 ? (
        <svg
          width="180"
          height="60"
          viewBox="0 0 180 60"
          className="mx-auto block"
          aria-hidden
        >
          <g fill="#b8923f">
            {stars.map((_, i) => (
              <circle
                key={i}
                cx={14 + (i % 8) * 22}
                cy={i < 8 ? 18 + (i % 3) * 8 : 44}
                r={2.4}
                opacity={0.6 + (i % 5) * 0.08}
              />
            ))}
          </g>
        </svg>
      ) : (
        <div className="mx-auto h-[60px] w-[180px]" />
      )}

      <div className="mt-2 text-[24px] font-medium tracking-[-0.02em] text-ink">
        {count > 0 ? (
          <>
            <em className="not-italic text-resisted-deep">{count}</em>
            번 참아냈어
          </>
        ) : (
          <span className="text-ink-3">아직 없어요</span>
        )}
      </div>
      <div className="mt-1 text-[11.5px] text-ink-3">
        이번 달, 보내려다 멈춘 메시지
      </div>
    </section>
  );
}
