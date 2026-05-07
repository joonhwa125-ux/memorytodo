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
import Link from "next/link";
import { PersonHeader, UniversalStats } from "@/components/home";
import { SplashLanding } from "./SplashLanding";
import { HomeQuickRecord } from "./HomeQuickRecord";
import { IntentList } from "./IntentList";

export default async function HomePage() {
  // 세션 없음: 스플래시 랜딩 ("시작하기" 버튼)
  const user = await getCurrentUser();
  if (!user) {
    return <SplashLanding />;
  }

  // 세션은 있는데 person 없음: 온보딩 (이름 입력)
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

      {/* 오늘 마음에 둔 것 — γ 패턴 (행 탭 → 인라인 outcome 2버튼) */}
      <IntentList intents={intents} personId={personDb.id} />

      {/* 의도 없이 일어난 "지금 이 순간" 기록 — floating moment */}
      <HomeQuickRecord personId={personDb.id} />

      <ResistedConstellation count={summary.resisted} />

      <div className="mt-3 text-center">
        <Link
          href="/overview"
          className="inline-block rounded-lg px-3 py-1.5 text-[13px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          지난 30일 흐름 보기 →
        </Link>
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────
// ResistedConstellation — 이번 달 영웅 사분면
// ────────────────────────────────────────────────────────────
function ResistedConstellation({ count }: { count: number }) {
  const stars = Array.from({ length: Math.min(count, 11) });
  const hasCount = count > 0;

  return (
    <section
      aria-label="이번 달 참아낸 횟수"
      className="mt-[22px] flex min-h-[200px] flex-col rounded-[18px] border border-line bg-paper px-4 py-[18px] text-center shadow-soft"
      style={{
        backgroundImage:
          "radial-gradient(120px 80px at 50% 50%, rgba(184, 146, 63, 0.10), transparent 70%)",
      }}
    >
      <div className="text-[12px] font-semibold tracking-[0.16em] text-resisted-deep">
        RESISTED · 이번 달
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {hasCount && (
          <svg
            width="180"
            height="60"
            viewBox="0 0 180 60"
            className="mb-2 block"
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
        )}

        <div className="text-[24px] font-medium tracking-[-0.02em] text-ink">
          {hasCount ? (
            <>
              <em className="not-italic text-resisted-deep">{count}</em>
              번 참아냈어
            </>
          ) : (
            <span className="text-ink-2">아직 없어요</span>
          )}
        </div>

        <div className="mt-1 text-[12.5px] text-ink-2">
          이번 달, 보내려다 멈춘 메시지
        </div>
      </div>
    </section>
  );
}
