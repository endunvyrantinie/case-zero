-- CASE//ZERO combined monetisation upgrade.
-- Run once in Supabase > SQL Editor after the existing CASE//ZERO schema.

create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  ad_free_lifetime boolean not null default false,
  payment_provider text,
  payment_reference text unique,
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_entitlements enable row level security;

drop policy if exists "Users can read own entitlements" on public.user_entitlements;
create policy "Users can read own entitlements"
on public.user_entitlements for select
using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select on table public.user_entitlements to authenticated;

notify pgrst, 'reload schema';
