# 기억 (Memory)

> 한 사람과의 1년을 조용히 기록합니다.

의도-행동 간극(akrasia)을 4사분면으로 추적·시각화하는 todo 앱.
"보내려다 멈춘 메시지", "또 미룬 안부 전화", "참아낸 충동" — 자기실망 패턴을 직시하고
1년이 지났을 때 그 사람과 보낸 시간을 한 장의 카드로 돌려준다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router) + React 19
- **언어**: TypeScript
- **스타일**: Tailwind CSS v4
- **모션**: Framer Motion
- **백엔드**: Supabase (PostgreSQL + Auth + RLS)
- **배포**: Vercel

## 폴더 구조

```
.
├── app/                       # Next.js App Router 페이지
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css            # ← 프론트엔드 세션 담당 (디자인 토큰)
├── components/                # ← 프론트엔드 세션 담당 (UI 컴포넌트)
├── lib/
│   ├── supabase/              # 서버/클라이언트/미들웨어 클라이언트
│   ├── types/                 # DB 타입 정의
│   └── utils/                 # 시간/사분면 유틸
├── supabase/
│   └── migrations/            # SQL 스키마
├── docs/                      # 기획·설계 문서
├── mockup/                    # HTML 목업 (디자인 레퍼런스)
└── middleware.ts              # Supabase 세션 갱신 미들웨어
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 생성

1. <https://supabase.com/dashboard> 접속 후 **New project**
2. 프로젝트 이름: `memory` (자유)
3. DB 비밀번호 설정 — 안전한 곳에 보관
4. 리전: **Northeast Asia (Seoul)** 또는 **Northeast Asia (Tokyo)** 권장 (한국에서 빠름)
5. 프로젝트 생성 완료까지 약 2분 대기

### 3. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

Supabase Dashboard → 좌측 **Project Settings** → **API** 메뉴에서:

| 환경 변수 | 가져올 값 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project API keys → anon public** |

`.env.local` 파일에 붙여넣기.

### 4. 스키마 적용

Supabase Dashboard → 좌측 **SQL Editor** → **New query** →
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) 파일 내용을 복사해 붙여넣고 **Run**.

생성되는 것들:

- 테이블: `profiles`, `persons`, `intents`, `intent_events`
- Enum: `intent_type`, `quadrant`, `session_type`
- 트리거: 신규 가입 시 `profiles` 자동 생성, `updated_at` 자동 갱신
- RLS 정책: 모든 테이블에 owner-only 접근

### 5. 개발 서버 실행

```bash
npm run dev
```

<http://localhost:3000> 에서 확인.

## 데이터 모델

### 4사분면 사건 모델

모든 의도-행동 사건은 4개 사분면 중 하나로 분류:

| 사분면 | 의미 | 예시 |
|---|---|---|
| `aligned` | 해야 했고 했음 | 약속한 통화 함 |
| `procrastinated` | 해야 했는데 못 함 | 통화 또 미룸 |
| `relapsed` | 안 했어야 했는데 함 | 늦은 밤 충동 메시지 보냄 |
| `resisted` | 안 했어야 했고 안 함 | 참아낸 메시지 (영웅 사분면) |

### 보편 기능 (관계 유형 무관)

- **올해 남은 주말 N번** — 시간의 유한함 인식
- **생일 D-day** — 그 사람의 다음 기념일
- **올해 남은 통화 약 N번** — 주말 1회 기준 추정

## 개발 메모

### 병렬 작업 분담

이 프로젝트는 두 세션으로 병렬 개발 중:

- **백엔드 라인**: Supabase, 타입, 유틸, 미들웨어, Server Actions
- **프론트엔드 라인**: 디자인 토큰(`globals.css`), 컴포넌트, 페이지 UI

### 디자인 레퍼런스

`mockup/index.html` — 6개 화면 (온보딩 2 + 일상 4) 정적 목업.
워밋 라이트 모드, Pretendard, 컬러 팔레트는 다음을 따름:

- Resisted gold: `#b8923f`
- Aligned sage: `#5a8d6e`
- Procrastinated steel: `#7e8a9b`
- Relapsed coral: `#b56b58`
- Present lavender: `#8975c8`

## 다음 단계

- [ ] Supabase 프로젝트 생성 + 스키마 적용 (사용자)
- [ ] `.env.local` 작성 (사용자)
- [ ] 인증 페이지 구현
- [ ] 온보딩 플로우 구현 (스플래시 + 이름 입력)
- [ ] 홈 화면 구현
- [ ] 빠른 기록 4 버튼
- [ ] 저녁 회고 (스와이프)
- [ ] 30일 그래프
- [ ] 월간 회고 카드
- [ ] Vercel 배포
