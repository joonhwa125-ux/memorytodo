# 기억 (Memory) — Plan

> **Summary**: 소중한 사람을 위해 해야 할 일과 하지 말아야 할 일을 적고,
> 실천 여부를 기록하는 todo 앱.
>
> **Project**: 기억 (Memory)
> **Version**: 0.2
> **Author**: joonhwa125@gmail.com
> **Date**: 2026-05-10
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

소중한 사람(부모, 파트너, 친구 등)을 위해 내가 하고 싶은 일과 하지 말아야 할 일을
적고, 실천 여부를 기록하는 todo 앱. 시간의 유한함(올해 남은 주말, 의미있는 날까지의
D-day)을 함께 보여줘 행동을 돕는다.

### 1.2 핵심 명제

"내 마음을 행동으로 표현했는가?"를 사람 단위로 기록한다.

- **해야 할 일을 했는가** (예: 사랑한다고 말하기, 주말에 전화하기)
- **하지 말아야 할 일을 참았는가** (예: 통화 중 짜증내지 않기, 늦은 밤 메시지 보내지 않기)

이 두 축을 4사분면(Akrasia)으로 분류해 한 사람과의 관계를 한 화면에 담는다.

### 1.3 Background

기존 todo 앱은 개인 작업 관리에 최적화되어 있어, "사람을 위한 행동"을 추적하기엔
맥락이 빠져 있다. 또한 사람과의 시간이 유한하다는 감각을 일상에 녹이는 도구가 없다.
"기억"은 한 사람을 중심으로 todo와 시간 인식을 결합한다.

### 1.4 Related Documents

- 디자인 목업: `mockup/index.html`
- DB 스키마: `supabase/migrations/`

---

## 2. 타겟 사용자

- 부모, 파트너, 친구 등 소중하지만 표현이 늦거나 충돌이 반복되는 관계를 가진 사람
- 시간이 유한하다는 감각을 일상에서 받고 싶은 사람
- 거창한 시스템보다 **단순한 기록 습관**을 원하는 사람

---

## 3. 핵심 객체

### 3.1 Person (사람)

- 사용자가 기억하기로 한 한 사람
- 필수: 이름 (부르는 이름 — 관계는 묻지 않음)
- MVP는 1명, 스키마는 N명 대비

### 3.2 ImportantDate (의미있는 날)

- 사람당 0~N개
- 라벨(자유 텍스트, 예: "생일", "결혼기념일", "어버이날", "처음 만난 날")
- 날짜 (양력)
- **매년 반복되는 날로 간주** (D-day 계산은 다음 발생일 기준)
- 사용자가 직접 입력하며, 시스템이 미리 정의한 이벤트 목록은 없음

### 3.3 Intent (할 일)

- 사람당 N개
- type
  - `do`: 해야 할 일 (예: "주말에 안부 전화")
  - `avoid`: 하지 말아야 할 일 (예: "통화 중 짜증내지 않기")
- 제목 (필수)
- 메모 (선택, 왜 이걸 마음에 두었는가)
- 마감일 (선택)
- 보관(archived) 상태

### 3.4 IntentEvent (실행 기록)

- 4사분면 중 하나로 기록
- intent와 연결 (선택, 의도 없는 사건도 기록 가능)
- 기록 시점, 짧은 메모

---

## 4. 4사분면 (Akrasia)

| 의도 유형 | 결과 | 사분면 | 라벨 | 설명 |
|---------|------|-------|------|------|
| do | 했음 | aligned | 해냈어 | 의도한 걸 해냈어요 |
| do | 못 함 | procrastinated | 미뤘어 | 해야 했지만 못 했어요 |
| avoid | 참음 | resisted | 참았어 | 피하려던 걸 참아냈어요 |
| avoid | 실패 | relapsed | 또 했어 | 안 하려던 걸 했어요 |

**핵심 지표**
- `의도-행동 일치율 = (aligned + resisted) / total`
- `Akrasia Index = (procrastinated + relapsed) / total`

---

## 5. Scope

### 5.1 MVP In Scope

- [ ] Supabase 익명 로그인 + 세션 관리
- [ ] 사람 1명 등록 (이름)
- [ ] 의미있는 날 자유 입력 (라벨 + 날짜)
- [ ] Intent CRUD (do/avoid)
- [ ] 홈 화면
  - 사람 헤더 (이름)
  - 시간 stats: 올해 남은 주말 N번 + 가장 가까운 의미있는 날 D-day
  - 오늘 마음에 둔 것 (활성 Intent 목록)
  - Quick Record (4사분면 버튼)
- [ ] 30일 Overview 화면 (4사분면 카운트 + strand grid)
- [ ] Vercel 배포

### 5.2 Out of Scope (MVP)

- 저녁 회고 별도 세션 (Quick Record 하나로 통일)
- Monthly Wrapped 카드
- AI 패턴 분석
- 다인 비교/공유
- 시스템 큐레이션 날짜 (어버이날 자동 인식 등)

### 5.3 향후 로드맵

| 단계 | 기능 |
|-----|------|
| v1.1 | 저녁 회고 옵션, 월간 회고 카드 |
| v1.2 | 모바일 PWA 최적화 |
| v2.0 | 다인 지원, AI 패턴 분석 |

---

## 6. Requirements

### 6.1 Functional Requirements

| ID | 요구사항 | 우선순위 | 상태 |
|----|---------|---------|------|
| FR-01 | 사용자는 사람 1명을 등록할 수 있다 (이름) | High | Pending |
| FR-02 | 사용자는 사람에 대한 의미있는 날을 라벨+날짜로 자유 추가할 수 있다 | High | Pending |
| FR-03 | 사용자는 사람에 대한 do/avoid Intent를 추가할 수 있다 | High | Pending |
| FR-04 | 사용자는 Quick Record로 4사분면 이벤트를 기록할 수 있다 | High | Pending |
| FR-05 | 홈 화면에 올해 남은 주말 수와 가장 가까운 의미있는 날 D-day가 표시된다 | High | Pending |
| FR-06 | 30일 Overview에서 4사분면 카운트와 strand grid를 볼 수 있다 | High | Pending |
| FR-07 | Supabase 익명 로그인으로 즉시 시작 가능 | High | Pending |

### 6.2 Non-Functional Requirements

| 카테고리 | 기준 |
|---------|------|
| 성능 | 홈 초기 로딩 < 1.5초 |
| 보안 | Supabase RLS로 타 사용자 데이터 접근 차단 |
| 접근성 | 키보드 탐색 가능, 색상 대비 AA |

---

## 7. 화면 흐름

### 7.1 Onboarding (~30초)

1. **Splash** — "기억" 브랜드 + "시작하기" 버튼
2. **이름 입력** — "그 사람을 어떻게 부르시나요?"
3. (선택) **의미있는 날 입력** — 라벨 + 날짜 자유 추가, 건너뛰기 가능
4. **홈** 진입

### 7.2 Home

- 사람 헤더 (이름, 아바타)
- Universal stats
  - 올해 남은 주말 N번
  - 가장 가까운 의미있는 날 D-day (라벨 표시)
- 오늘 마음에 둔 것 (활성 Intent 목록)
- Quick Record (4사분면 버튼 4개)
- 이번 달 RESISTED 별자리 (별도 시각화)

### 7.3 Overview (30일)

- 월간 요약 텍스트 ("마음을 둔 날이 N일이었어")
- 4사분면 카운트 그리드
- 30일 strand grid
- 패턴 카드 (수동 메모 또는 향후 AI)

---

## 8. Wording 결정

| 항목 | 변경 전 | 변경 후 |
|-----|---------|---------|
| 앱 부제 | 한 사람과의 1년 | 소중한 사람을 위한 할 일 기록 |
| 헤더 부제 | 마지막으로 떠올린 날 · 5월 2일 | (제거) |
| Stats 라벨 | 생일까지 D-92 | [의미있는 날 라벨] D-92 |
| 4사분면 라벨 | (유지) | 해냈어 / 참았어 / 미뤘어 / 또 했어 |

---

## 9. Architecture

### 9.1 Project Level

Dynamic 레벨 (1인 개발 SaaS MVP, BaaS 활용)

### 9.2 Stack

| 영역 | 선택 |
|-----|------|
| Framework | Next.js 15 App Router |
| Database/Auth | Supabase (RLS) |
| Styling | Tailwind CSS |
| Deploy | Vercel |

### 9.3 Schema 변경 (v0.1 → v0.2)

- `persons.birthday` 컬럼 제거
- `important_dates` 테이블 신설 (사용자가 자유 입력하는 의미있는 날)

---

## 10. Risks and Mitigation

| 위험 | 영향 | 대응 |
|------|-----|------|
| do/avoid 구분이 사용자에게 직관적이지 않을 수 있음 | High | 온보딩 또는 추가 화면에서 예시 제시 |
| Quick Record 4개 버튼이 어떤 Intent에 응답하는지 모호 | High | 추후 단계에서 Intent 선택 후 결과 기록 플로우로 보완 |
| 1인 등록 제약을 사용자가 답답해할 수 있음 | Medium | "한 사람에 집중"이라는 컨셉을 온보딩에서 분명히 전달 |
| 의미있는 날 미입력 시 D-day 영역 빈 상태 처리 필요 | Medium | "의미있는 날 추가하기" CTA로 노출 |

---

## 11. Success Criteria

### 11.1 Definition of Done (MVP)

- [ ] 익명 로그인 → 사람 등록 → 의미있는 날 추가 → Intent 추가 → Quick Record 기록 → 30일 Overview 조회 전 흐름 동작
- [ ] Vercel 프로덕션 배포 완료
- [ ] 모바일 화면 (375px 너비) 정상 동작

### 11.2 검증 가설

| 가설 | 검증 방법 | 성공 기준 |
|------|---------|---------|
| 사용자는 do/avoid 두 종류를 모두 활용한다 | 등록된 Intent의 type 분포 | avoid 비율 > 20% |
| Quick Record가 실제로 사용된다 | 주간 이벤트 수 | 사용자당 주 3회 이상 |
| 시간 stats가 행동을 유도한다 | 의미있는 날 D-day < 14일 시점의 Intent 추가율 | 평소 대비 1.5배 |

---

## 12. Next Steps

1. [x] plan.md 재작성 (v0.2)
2. [ ] DB migration 0002: `birthday` 제거 + `important_dates` 추가
3. [ ] `lib/types/db.ts` 동기화
4. [ ] `lib/utils/time.ts` 일반화 (생일 → 의미있는 날)
5. [ ] `components/home/PersonHeader.tsx` 정리 ("마지막으로 떠올린 날" 제거)
6. [ ] `mockup/index.html` 워딩 수정

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-07 | Initial draft (Intent Timeline Todo 컨셉) | joonhwa125@gmail.com |
| 0.2 | 2026-05-10 | "기억" 컨셉으로 전면 재작성. 의미있는 날을 자유 입력 구조로 변경 | joonhwa125@gmail.com |
