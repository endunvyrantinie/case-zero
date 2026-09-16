-- CASE//ZERO V5 migration — run once in Supabase > SQL Editor.

alter table public.case_progress
add column if not exists reviewed_evidence jsonb not null default '[]'::jsonb;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.case_progress to authenticated;

notify pgrst, 'reload schema';
