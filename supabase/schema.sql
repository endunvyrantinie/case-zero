-- CASE//ZERO V4 — run once in Supabase > SQL Editor.

create table if not exists public.case_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id text not null,
  solved boolean not null default false,
  best_score integer not null default 0 check (best_score between 0 and 100),
  attempts integer not null default 0 check (attempts >= 0),
  last_played_at timestamptz,
  notes text not null default '',
  chats jsonb not null default '{}'::jsonb,
  reviewed_evidence jsonb not null default '[]'::jsonb,
  attempt_started_at timestamptz,
  attempt_deadline_at timestamptz,
  attempt_closed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, case_id)
);

alter table public.case_progress enable row level security;

-- Re-runnable policy setup.
drop policy if exists "Users can read own case progress" on public.case_progress;
drop policy if exists "Users can insert own case progress" on public.case_progress;
drop policy if exists "Users can update own case progress" on public.case_progress;
drop policy if exists "Users can delete own case progress" on public.case_progress;

create policy "Users can read own case progress"
on public.case_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own case progress"
on public.case_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own case progress"
on public.case_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own case progress"
on public.case_progress for delete
using (auth.uid() = user_id);
