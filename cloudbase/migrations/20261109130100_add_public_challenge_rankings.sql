create view public.health_public_challenge_logs
with (security_invoker = false)
as
select challenge_id, user_id, log_date, value, updated_at
from public.health_challenge_logs;

revoke all on public.health_public_challenge_logs from anon;
grant select on public.health_public_challenge_logs to authenticated;

create or replace view public.health_community_shares
with (security_invoker = false)
as
select
  r.user_id,
  p.nickname,
  p.avatar_text,
  r.record_date,
  r.note,
  r.photo_refs,
  r.updated_at,
  r.steps,
  r.fatloss,
  r.musclegain,
  r.water,
  r.muscle,
  r.sleep,
  r.stand,
  r.farview
from public.daily_health_records r
join public.health_profiles p on p.user_id = r.user_id
where r.photo_refs <> '{}'::jsonb;
