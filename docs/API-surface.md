# Backend API Surface · 프론트엔드 세션 핸드오프

> 이 문서는 **백엔드 라인이 만든 import 가능한 함수들**을 한 페이지로 정리한 명세입니다.
> 프론트엔드 세션이 페이지 작성 시 그대로 호출하면 됩니다.
>
> 현재 시점: npm install 완료, 타입 체크 통과 (`npx tsc --noEmit` ✓).

---

## 1. 인증 (Auth)

### Server Actions — `@/lib/actions/auth`

```ts
import {
  signInWithMagicLink,
  signOut,
  type AuthActionResult,
} from "@/lib/actions/auth";

// 로그인 폼에서 사용 (FormData 기반)
//   <form action={signInWithMagicLink}>
//     <input name="email" type="email" />
//     <button>로그인 링크 받기</button>
//   </form>
// 결과: { ok: true, message } | { ok: false, error }

// 로그아웃 버튼
//   <form action={signOut}>
//     <button>로그아웃</button>
//   </form>
```

### 가드 헬퍼 — `@/lib/auth/requireOnboarded`

```ts
import { requireOnboarded, requireUserOnly } from "@/lib/auth/requireOnboarded";

// 홈처럼 person 등록까지 끝난 사용자만 진입하는 페이지
const { user, person } = await requireOnboarded();

// 온보딩 페이지처럼 로그인은 됐지만 아직 등록 안 된 상태
const { user, hasPerson } = await requireUserOnly();
if (hasPerson) redirect("/");
```

### 단순 사용자 조회 — `@/lib/auth/getUser`

```ts
import { getCurrentUser } from "@/lib/auth/getUser";

const user = await getCurrentUser(); // User | null
```

### 콜백 라우트

이미 `app/auth/callback/route.ts` 에 구현됨. Magic Link 메일의 링크를 클릭하면
이쪽으로 들어와서 세션 교환 후 홈으로 보냅니다. 별도 작업 불필요.

---

## 2. 온보딩 (첫 사람 등록)

### Server Action — `@/lib/actions/onboarding`

```ts
import {
  completeOnboarding,
  completeOnboardingAndRedirect,
  type OnboardingResult,
} from "@/lib/actions/onboarding";

// 폼 전송 패턴 (display_name 필수, birthday 선택)
//   <form action={completeOnboardingAndRedirect}>
//     <input name="display_name" required />
//     <input name="birthday" type="date" />  // 선택
//     <button>시작</button>
//   </form>
//
// 성공 시 자동으로 "/" 로 리다이렉트.
// 실패 시 OnboardingResult 반환.
```

이미 person 이 있는 사용자가 다시 호출하면 **갱신**됩니다 (insert/update 자동 분기).

---

## 3. 데이터 조회 (Server Components 전용)

### `@/lib/data/persons`

```ts
import { getActivePerson } from "@/lib/data/persons";

const person = await getActivePerson(); // Person | null
```

### `@/lib/data/intents`

```ts
import { getActiveIntents } from "@/lib/data/intents";

const intents = await getActiveIntents(person.id); // Intent[] (미아카이브)
```

### `@/lib/data/events`

```ts
import {
  getRecentEvents,
  getMonthlyQuadrantSummary,
  getLastEventAt,
} from "@/lib/data/events";

const events = await getRecentEvents(person.id, 30); // 최근 30일
const summary = await getMonthlyQuadrantSummary(person.id);
//   summary: { aligned, procrastinated, relapsed, resisted, total }
const lastAt = await getLastEventAt(person.id); // ISO string | null
```

---

## 4. 기록 / 변경 (Server Actions)

### `@/lib/actions/events`

```ts
import { recordEvent, deleteEvent } from "@/lib/actions/events";

// "지금 이 순간 기록" 4 버튼이 호출하는 함수
const result = await recordEvent({
  person_id: person.id,
  intent_id: null,            // 자유 기록일 때 null, 의도와 연결 시 intent.id
  quadrant: "resisted",       // "aligned" | "procrastinated" | "relapsed" | "resisted"
  trigger_note: undefined,    // 선택 메모
  session_type: "realtime",   // "realtime" | "daily_review"
});
// result: { ok: true, event_id } | { ok: false, error }

await deleteEvent(eventId); // 잘못 분류 되돌리기
```

### `@/lib/actions/intents`

```ts
import { createIntent, archiveIntent } from "@/lib/actions/intents";

// "오늘 마음에 둔 것" 추가 (Do / Avoid)
await createIntent({
  person_id: person.id,
  intent_type: "do",          // 또는 "avoid"
  title: "저녁 7시쯤 전화 드리기",
  why: "지난주 약속 미이행",  // 선택
  due_date: "2026-05-08",     // 선택
});

await archiveIntent(intentId); // 항목 제거 (soft)
```

---

## 5. 시간 유틸 (Universal Stats)

### `@/lib/utils/time`

```ts
import {
  remainingWeekendsThisYear,
  remainingWeekendPairsThisYear,
  daysUntilNextBirthday,
  formatNextBirthday,
} from "@/lib/utils/time";

const weekends = remainingWeekendsThisYear();        // number (토+일 합산)
const callsLeft = remainingWeekendPairsThisYear();   // 주말 1번 통화 가정
const dDay = daysUntilNextBirthday(person.birthday); // number | null
const bday = formatNextBirthday(person.birthday);    // "8월 7일" | null
```

---

## 6. 사분면 유틸

### `@/lib/utils/quadrant`

```ts
import {
  QUADRANT_LABELS,
  QUADRANT_DESCRIPTIONS,
  summarizeQuadrants,
  alignmentRate,
  akrasiaIndex,
} from "@/lib/utils/quadrant";

QUADRANT_LABELS.resisted;        // "참았어"
QUADRANT_DESCRIPTIONS.aligned;   // "의도한 걸 해냈어요"

const summary = summarizeQuadrants(events);
const rate = alignmentRate(summary);   // 0~1, 의도-행동 일치율
const akrasia = akrasiaIndex(summary); // 0~1, 낮을수록 자기일치
```

---

## 7. DB 타입 — `@/lib/types/db`

```ts
import type {
  Profile,
  Person,
  Intent,
  IntentEvent,
  IntentType,        // "do" | "avoid"
  Quadrant,          // "aligned" | "procrastinated" | "relapsed" | "resisted"
  SessionType,       // "realtime" | "daily_review"
  QuadrantSummary,
} from "@/lib/types/db";
```

> ⚠️ 프론트 세션의 `components/types.ts` 에는 `displayName`(camelCase),
> `procras` 같은 다른 네이밍이 있습니다. 합치는 단계에서 매퍼/통합 결정 필요.

---

## 8. 추천 페이지 구조 예시

### `app/page.tsx` (홈)

```tsx
import { requireOnboarded } from "@/lib/auth/requireOnboarded";
import { getActiveIntents } from "@/lib/data/intents";
import { getMonthlyQuadrantSummary } from "@/lib/data/events";
import { remainingWeekendsThisYear, daysUntilNextBirthday, formatNextBirthday } from "@/lib/utils/time";
// + 컴포넌트 import

export default async function HomePage() {
  const { person } = await requireOnboarded();
  const [intents, summary] = await Promise.all([
    getActiveIntents(person.id),
    getMonthlyQuadrantSummary(person.id),
  ]);

  return (
    <main>
      <PersonHeader person={person} />
      <UniversalStats
        weekendsLeft={remainingWeekendsThisYear()}
        weekendsUntilLabel="2026 12월 31일까지"
        birthdayDday={daysUntilNextBirthday(person.birthday)}
        birthdayLabel={formatNextBirthday(person.birthday)}
      />
      <IntentList intents={intents} />
      <QuickRecord personId={person.id} />
      <ResistedConstellation count={summary.resisted} />
    </main>
  );
}
```

### `app/onboarding/page.tsx`

```tsx
import { requireUserOnly } from "@/lib/auth/requireOnboarded";
import { redirect } from "next/navigation";
import { completeOnboardingAndRedirect } from "@/lib/actions/onboarding";

export default async function OnboardingPage() {
  const { hasPerson } = await requireUserOnly();
  if (hasPerson) redirect("/");

  return (
    <NameInput action={completeOnboardingAndRedirect} />
    // 또는 컴포넌트 내부에서 useFormState 사용
  );
}
```

### `app/auth/login/page.tsx`

```tsx
import { signInWithMagicLink } from "@/lib/actions/auth";

// 클라이언트 컴포넌트에서 useFormState 로 메시지 표시 권장
```

---

## 9. 환경 변수 의존

다음이 `.env.local` 에 있어야 모든 함수가 정상 동작:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # 선택, magic link redirect용
```

미설정 시 Server Actions 호출하는 순간 런타임 에러. 사용자가 Supabase 프로젝트
만들고 키 채워야 실제 동작.

---

## 10. 다음 합치는 단계 (To Do)

- [ ] `components/types.ts` 의 `Person` 인터페이스를 `@/lib/types/db` 의 `Person` 으로 통합 (또는 `lib/mappers/` 에 변환 레이어)
- [ ] `RecordKind` ("procras") ↔ `Quadrant` ("procrastinated") 매핑 함수
- [ ] 페이지 파일들 (`app/page.tsx`, `app/onboarding/page.tsx`, `app/auth/login/page.tsx`) 작성
- [ ] 타입 체크 + 빌드 통과 재검증
