-- CASE//ZERO owner analytics queries.
-- Run these manually in Supabase SQL Editor. Do not expose them to players.

-- 1) Case opens
select case_id, count(*) as opens
from public.analytics_events
where event_name = 'case_opened'
group by case_id
order by opens desc;

-- 2) Accusations, closes and solve rate
select
  case_id,
  count(*) as accusations,
  count(*) filter (where (properties->>'solved')::boolean is true) as solved,
  round(
    100.0 * count(*) filter (where (properties->>'solved')::boolean is true)
    / nullif(count(*), 0),
    1
  ) as solve_rate_percent
from public.analytics_events
where event_name = 'accusation_submitted'
group by case_id
order by case_id;

-- 3) Average final score by case
select
  case_id,
  round(avg((properties->>'score')::numeric), 1) as average_score
from public.analytics_events
where event_name = 'accusation_submitted'
group by case_id
order by case_id;

-- 4) Engagement by case
select
  case_id,
  count(*) filter (where event_name = 'evidence_reviewed') as evidence_reviews,
  count(*) filter (where event_name = 'suspect_questioned') as questions,
  count(*) filter (where event_name = 'attempt_restarted') as restarts
from public.analytics_events
group by case_id
order by case_id;

-- 5) Daily active signed-in players
select
  date_trunc('day', created_at) as day,
  count(distinct user_id) as active_players
from public.analytics_events
where created_at >= now() - interval '30 days'
group by 1
order by 1;
