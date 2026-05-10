-- =============================================================
-- 0002 — 의미있는 날(important_dates) 도입
--
-- 변경:
--   1) persons.birthday 컬럼 제거
--   2) important_dates 테이블 신설
--      사용자가 라벨(자유 텍스트)과 날짜를 자유롭게 입력하는 구조.
--      예: "생일", "결혼기념일", "어버이날", "처음 만난 날"
--      매년 반복되는 날로 간주(다음 발생일 기준 D-day 계산).
-- =============================================================

-- =====================================================
-- persons.birthday 제거
-- =====================================================
alter table public.persons drop column if exists birthday;


-- =====================================================
-- important_dates · 사람당 0~N개의 의미있는 날
-- =====================================================
create table public.important_dates (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.persons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,            -- 자유 입력 라벨
  date_value date not null,       -- 양력 날짜 (매년 반복 기준)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index important_dates_person_idx
  on public.important_dates(person_id);

create index important_dates_user_id_idx
  on public.important_dates(user_id);

alter table public.important_dates enable row level security;

create policy "important_dates_owner_all"
  on public.important_dates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- =====================================================
-- updated_at 트리거
-- =====================================================
create trigger important_dates_set_updated_at
  before update on public.important_dates
  for each row execute function public.set_updated_at();
