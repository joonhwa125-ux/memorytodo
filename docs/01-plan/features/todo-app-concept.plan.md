# Todo App Concept Planning Document

> **Summary**: "과거-현재-미래 자기인식" 중심의 차별화된 Todo 앱 제품 기획 초안
>
> **Project**: 할일앱 (Self-Awareness Todo)
> **Version**: 0.1
> **Author**: joonhwa125@gmail.com
> **Date**: 2026-05-07
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

단순 체크리스트를 넘어, 사용자가 "내가 무엇을 원했고(과거), 원하고(현재), 원할지(미래)"를 시각화하고
자기인식(self-awareness)을 얻을 수 있는 Todo 앱을 기획한다.
1인 개발자 수준 MVP를 Supabase + Vercel로 빠르게 출시하고, AI 통합으로 고도화한다.

### 1.2 Background

기존 Todo 앱(Todoist, TickTick, Linear 등)은 "지금 해야 할 것"에만 집중한다.
반면 사용자는 자신이 시간을 어디에 쏟았는지, 어떤 패턴이 있는지, 앞으로 어디로 나아가야 할지를
알고 싶어 한다. 2025~2026년 트렌드인 "퍼스널 데이터 + AI 자기계발"과 정확히 교차하는 지점이다.

### 1.3 Related Documents

- References: Sunsama, Motion, Reclaim, TickTick, Todoist, Linear, Akiflow, Reflect, Amie

---

## 2. 차별화 컨셉 후보

---

### Concept A — "Intent Timeline" (의도 타임라인)

**핵심 가치 제안**: 내가 원했던 것들의 흐름을 시간축 위에 그려, 삶의 의도 변화를 직접 목격한다.

**타겟 페르소나**
- 30대 지식 노동자, 자기계발에 관심 많은 1인 창업자/프리랜서
- "왜 나는 항상 같은 패턴을 반복하지?"를 고민하는 사람

**핵심 기능 (MoSCoW)**

| 기능 | 우선순위 |
|------|---------|
| 할 일 등록 시 "의도(Why)" 필드 필수 입력 | Must |
| 타임라인 뷰: 완료/취소/연기된 Todo를 과거→현재→미래로 시각화 | Must |
| 주간 의도 리포트 (어떤 카테고리에 시간을 썼나) | Must |
| AI 패턴 분석: "이번 달 당신이 계속 미룬 것은 X입니다" | Should |
| 미래 계획 보드 (버킷리스트 레이어와 연동) | Could |

**시각화 요소**
- 강 흐름(river flow) 형태의 수평 타임라인
- 완료=진한 색, 미룸=흐린 색, 취소=취소선 스타일로 의도의 밀도를 표현
- 주간/월간 히트맵 (완료율 vs 의도 변화율)

**기존 제품과 차이**
- Todoist/TickTick: 타임라인 없음, 완료 후 데이터 소멸
- Reflect: 메모 중심, 할 일 구조화 약함
- Sunsama: 일일 계획 최적화이지만 과거 패턴 분석 없음
- **차별점**: 완료된 Todo가 "삭제"가 아니라 "기억"으로 남아 자기서사를 형성

---

### Concept B — "Desire Map" (욕망 지도)

**핵심 가치 제안**: 내 모든 할 일을 욕구 레이어(생존/성장/연결/의미)로 분류해 삶의 균형을 지도로 본다.

**타겟 페르소나**
- 번아웃을 경험한 직장인/프리랜서
- Notion이나 코칭 툴을 쓰지만 "한눈에 보이지 않는다"고 느끼는 사람

**핵심 기능 (MoSCoW)**

| 기능 | 우선순위 |
|------|---------|
| 할 일 등록 시 욕구 레이어 태깅 (생존/성장/연결/의미) | Must |
| 레이더 차트: 4개 영역의 완료 비율 실시간 시각화 | Must |
| 월별 욕구 균형 변화 추이 그래프 | Must |
| AI 권고: "이번 주 '연결' 영역이 0입니다. 사람을 만나보세요" | Should |
| 친구/파트너와 욕망 지도 비교 공유 | Could |

**시각화 요소**
- 레이더(Spider) 차트로 4개 욕구 영역 균형 표현
- 타임랩스 슬라이더로 과거 특정 시점의 지도 재현
- 각 영역별 완료 Todo를 클릭하면 드릴다운

**기존 제품과 차이**
- Motion/Reclaim: 시간 최적화 중심, 삶의 균형 개념 없음
- Akiflow: 통합 캘린더지만 욕구 분류 없음
- Amie: 소셜/캘린더 통합이지만 자기인식 레이어 없음
- **차별점**: Maslow 욕구 이론을 UI 레이어로 구현한 최초 Todo

---

### Concept C — "Echo Journal" (에코 저널)

**핵심 가치 제안**: 할 일과 감정 기록을 함께 남겨, AI가 나의 동기 패턴을 거울처럼 돌려준다.

**타겟 페르소나**
- 저널링/다이어리 습관이 있는 20~30대
- "생산성 앱은 너무 차갑다"고 느끼는 감성 지향 사용자

**핵심 기능 (MoSCoW)**

| 기능 | 우선순위 |
|------|---------|
| 할 일 완료 시 1문장 감정 스냅샷 기록 | Must |
| "오늘의 에너지 레벨" 슬라이더 (1~5) | Must |
| 감정 태그 캘린더 히트맵 (완료일+감정색) | Must |
| AI 월간 에코: "당신이 가장 활기찼던 날의 공통점은 X입니다" | Should |
| 과거 같은 날짜의 기록 플래시백 ("1년 전 오늘, 당신은...") | Could |

**시각화 요소**
- GitHub 잔디밭 스타일 감정 캘린더 (색=에너지, 밀도=완료량)
- 감정 단어 워드클라우드 (월별)
- 과거-현재 비교 분할 화면

**기존 제품과 차이**
- Reflect: 메모 저널이지만 할 일 구조 없음
- Daylio류 앱: 감정 기록이지만 생산성 연동 없음
- TickTick: 습관 트래커 있지만 감정 레이어 없음
- **차별점**: Todo 완료 이벤트에 감정을 바인딩하는 첫 번째 레이어

---

### Concept D — "Future Self" (미래 자아)

**핵심 가치 제안**: 3개월 후 내가 되고 싶은 모습을 먼저 정의하고, 오늘의 할 일이 그 미래와 연결되는지 실시간으로 보여준다.

**타겟 페르소나**
- OKR이나 목표 관리에 관심 있지만 실행이 안 되는 직장인
- "목표는 있는데 오늘 할 일과 연결이 안 된다"는 불만을 가진 사람

**핵심 기능 (MoSCoW)**

| 기능 | 우선순위 |
|------|---------|
| "3개월 후 나" 선언문 작성 (텍스트+이미지) | Must |
| 모든 Todo에 "어떤 미래 자아와 연결?"을 태깅 | Must |
| 미래 연결율 대시보드: 오늘 한 일의 X%가 미래를 향함 | Must |
| AI 정렬 점검: "이번 주 할 일의 70%가 미래 목표와 무관합니다" | Should |
| 분기별 미래 자아 업데이트 후 이전 선언문 타임라인 보관 | Could |

**시각화 요소**
- 나무 성장 메타포: 미래 연결 Todo가 쌓일수록 나무가 자람
- 과거 선언문 → 현재 달성률 → 새 선언문 흐름 타임라인
- 목표별 완료 진행률 링 차트

**기존 제품과 차이**
- Linear: 프로젝트/이슈 추적이지만 개인 비전 연결 없음
- Motion: AI 일정 최적화지만 목표 정렬 개념 없음
- Notion(목표 템플릿): 연결이 수동이고 시각화 없음
- **차별점**: "미래 자아 선언 → 오늘 행동 정렬"을 자동 추적하는 최초 Todo

---

## 3. 추천 1순위: Concept A "Intent Timeline"

**추천 이유**

"과거-현재-미래 자기인식"이라는 핵심 명제를 가장 직접적으로 구현하는 컨셉이다.

1. **과거**: 완료/취소/미룸 데이터가 타임라인에 그대로 보존 → "내가 원했던 것들"
2. **현재**: 현재 활성 Todo의 의도(Why) 가시화 → "내가 원하는 것"
3. **미래**: 패턴 분석 기반 AI 예측 → "내가 원할 것 같은 것"

다른 컨셉들(B, C, D)은 하나의 시간축(현재 균형, 감정 현재, 미래 목표)에만 집중하는 데 반해,
Concept A는 세 시간축을 단일 타임라인 뷰 안에 통합한다.
또한 MVP 구현 난이도가 상대적으로 낮다. Why 필드 + 타임라인 렌더링만으로 핵심 가치가 전달된다.

---

## 4. Scope

### 4.1 MVP 범위 (In Scope)

- [ ] Supabase Auth (이메일/소셜 로그인)
- [ ] Todo CRUD + "의도(Why)" 필드
- [ ] 상태 관리: 활성 / 완료 / 취소 / 연기
- [ ] 수평 타임라인 뷰 (주간/월간 토글)
- [ ] 주간 카테고리 히트맵 리포트
- [ ] Vercel 배포 (Next.js 14 App Router)

### 4.2 향후 고도화 로드맵 (Out of Scope for MVP)

| 단계 | 기능 | 시기 |
|------|------|------|
| v1.1 | AI 패턴 분석 (OpenAI API) | MVP 출시 후 4주 |
| v1.2 | 모바일 PWA 최적화 | v1.1 이후 |
| v1.3 | Concept C 감정 스냅샷 레이어 통합 | v1.2 이후 |
| v2.0 | Concept D 미래 자아 선언 연동 | 6개월 후 |

---

## 5. Requirements

### 5.1 Functional Requirements

| ID | 요구사항 | 우선순위 | 상태 |
|----|---------|---------|------|
| FR-01 | 사용자는 Todo를 생성할 때 Why(의도) 필드를 입력할 수 있다 | High | Pending |
| FR-02 | 완료/취소/연기된 Todo는 삭제되지 않고 타임라인에 보존된다 | High | Pending |
| FR-03 | 타임라인 뷰에서 과거-현재-미래 축으로 Todo를 탐색할 수 있다 | High | Pending |
| FR-04 | 주간 카테고리별 완료율 리포트를 볼 수 있다 | High | Pending |
| FR-05 | Supabase Auth로 이메일 로그인이 가능하다 | High | Pending |
| FR-06 | AI가 반복 패턴을 분석해 인사이트를 제공한다 (v1.1) | Medium | Deferred |

### 5.2 Non-Functional Requirements

| 카테고리 | 기준 | 측정 방법 |
|---------|------|---------|
| 성능 | 타임라인 초기 로딩 < 1.5초 | Vercel Analytics |
| 보안 | Supabase RLS 정책으로 타 사용자 데이터 접근 차단 | 정책 리뷰 |
| 접근성 | 키보드 탐색 가능 | 수동 테스트 |

---

## 6. Success Criteria

### 6.1 Definition of Done (MVP)

- [ ] Todo CRUD 전체 동작
- [ ] 타임라인 뷰에서 과거 30일 데이터 시각화
- [ ] 주간 리포트 페이지 출력
- [ ] Supabase Auth 로그인/로그아웃
- [ ] Vercel 프로덕션 배포 완료

### 6.2 검증 가설

| 가설 | 검증 방법 | 성공 기준 |
|------|---------|---------|
| 사용자는 Why 필드를 실제로 입력한다 | 첫 2주 입력률 추적 | 입력률 > 60% |
| 타임라인 뷰를 반복 조회한다 | 세션당 타임라인 페이지뷰 | 세션당 2회 이상 |
| 주간 리포트가 재방문을 유도한다 | 리포트 후 7일 내 재방문율 | 리포트 조회자 40% 재방문 |

---

## 7. Risks and Mitigation

| 위험 요소 | 영향 | 가능성 | 대응 방안 |
|---------|------|--------|---------|
| Why 필드 입력 피로 → 사용자 이탈 | High | Medium | 선택 입력으로 시작, 자동완성 제안(AI) 추가 |
| 타임라인 UI 구현 복잡도 초과 | Medium | Medium | 초기엔 리스트 뷰 + 색상 구분으로 단순화 |
| Supabase 무료 플랜 제한 도달 | Low | Low | 유료 전환 시점을 사용자 100명 기준으로 설정 |
| 기존 앱 대비 "다름"이 전달 안 됨 | High | Medium | 온보딩에 "당신의 의도 기록" 강조 UX 배치 |
| 1인 개발자 유지보수 병목 | Medium | High | MVP 범위를 엄격히 제한, AI 기능 외부 API 의존 |

---

## 8. Architecture Considerations

### 8.1 Project Level

Dynamic 레벨 선택 (SaaS MVP, 1인 개발)

### 8.2 Key Architectural Decisions

| 결정 사항 | 선택 | 근거 |
|---------|------|------|
| Framework | Next.js 14 (App Router) | Vercel 배포 최적화, RSC 활용 |
| Database/Auth | Supabase | 1인 개발 BaaS, RLS 지원 |
| State Management | Zustand | 경량, 타임라인 상태 관리 적합 |
| Styling | Tailwind CSS | 빠른 MVP 구현 |
| 시각화 | Recharts or D3.js (lite) | 타임라인/히트맵 구현 |
| AI (v1.1) | OpenAI API (GPT-4o-mini) | 비용 효율적 패턴 분석 |

### 8.3 Folder Structure (Dynamic Level)

```
src/
  components/      # 공통 UI 컴포넌트
  features/
    todos/         # Todo CRUD + 의도 필드
    timeline/      # 타임라인 뷰
    reports/       # 주간 리포트
  services/        # Supabase 클라이언트
  types/           # TypeScript 타입
```

---

## 9. Convention Prerequisites

### 9.1 Environment Variables Needed

| 변수 | 용도 | 범위 |
|-----|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버사이드 관리 작업 | Server |
| `OPENAI_API_KEY` | AI 패턴 분석 (v1.1) | Server |

---

## 10. Next Steps

1. [ ] 컨셉 A "Intent Timeline" 최종 승인
2. [ ] Design 문서 작성 (`todo-app-concept.design.md`)
3. [ ] Supabase 프로젝트 생성 및 스키마 설계
4. [ ] Next.js 프로젝트 초기화 + Vercel 연동

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-07 | Initial draft | joonhwa125@gmail.com |
