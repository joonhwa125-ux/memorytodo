-- =============================================================
-- 기억(Memory) — 초기 스키마
-- 한 사람과의 의도-행동 간극(akrasia)을 추적하는 todo 앱
-- =============================================================

-- =====================================================
-- profiles · auth.users 와 1:1 매핑
-- =====================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_owner_select"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles_owner_insert"
  on public.profiles for insert with check (auth.uid() = id);

create policy "profiles_owner_update"
  on public.profiles for update using (auth.uid() = id);

-- 신규 사용자 가입 시 profile 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =====================================================
-- persons · 사용자가 기억하기로 한 사람 (MVP는 1명, 스키마는 N명 대비)
-- =====================================================
create table public.persons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  birthday date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index persons_user_id_active_idx
  on public.persons(user_id) where is_active = true;

alter table public.persons enable row level security;

create policy "persons_owner_all"
  on public.persons for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- =====================================================
-- intent_type / quadrant / session_type · enums
-- =====================================================
create type public.intent_type as enum ('do', 'avoid');

create type public.quadrant as enum (
  'aligned',         -- 했어야 했고 했음
  'procrastinated',  -- 했어야 했는데 못함
  'relapsed',        -- 안 했어야 했는데 함
  'resisted'         -- 안 했어야 했고 안 함 (영웅 사분면)
);

create type public.session_type as enum (
  'realtime',        -- 홈 화면에서 즉시 기록
  'daily_review'     -- 저녁 회고에서 분류
);


-- =====================================================
-- intents · 그 사람을 향한 의도 (do / avoid)
-- =====================================================
create table public.intents (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.persons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  intent_type public.intent_type not null,
  title text not null,
  why text,
  due_date date,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index intents_person_active_idx
  on public.intents(person_id) where is_archived = false;
create index intents_user_id_idx on public.intents(user_id);

alter table public.intents enable row level security;

create policy "intents_owner_all"
  on public.intents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- =====================================================
-- intent_events · 4사분면 사건 기록
-- intent와 분리: 의도 없이 발생하는 사건도 기록 가능
-- =====================================================
create table public.intent_events (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid references public.intents(id) on delete set null,
  person_id uuid not null references public.persons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  quadrant public.quadrant not null,
  recorded_at timestamptz not null default now(),
  trigger_note text,
  session_type public.session_type not null default 'realtime',
  created_at timestamptz not null default now()
);

-- 30일 strand 뷰, 사람별 시간순 조회
create index intent_events_person_recorded_idx
  on public.intent_events(person_id, recorded_at desc);

-- 사분면별 카운트 집계
create index intent_events_person_quadrant_idx
  on public.intent_events(person_id, quadrant);

create index intent_events_user_id_idx on public.intent_events(user_id);

alter table public.intent_events enable row level security;

create policy "intent_events_owner_all"
  on public.intent_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- =====================================================
-- updated_at 자동 갱신 트리거
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger persons_set_updated_at
  before update on public.persons
  for each row execute function public.set_updated_at();

create trigger intents_set_updated_at
  before update on public.intents
  for each row execute function public.set_updated_at();
