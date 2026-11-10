alter table public.health_profiles
drop constraint health_profiles_group_code_check;

update public.health_profiles
set group_code = case group_code
  when 'personal' then 'personal_center'
  when 'group' then 'group_center'
  when 'claims' then 'claims_operations'
  else group_code
end
where group_code in ('personal', 'group', 'claims');

alter table public.health_profiles
alter column group_code set default 'personal_center';

alter table public.health_profiles
add constraint health_profiles_group_code_check
check (
  group_code in (
    'personal_center',
    'group_center',
    'claims_operations',
    'jiangyin_branch',
    'yixing_branch',
    'shared_resources'
  )
);

alter table public.daily_health_records
add column weight numeric(5, 1) not null default 0
check (weight = 0 or weight between 30 and 200);

create or replace view public.health_public_daily_records
with (security_invoker = false)
as
select
  user_id,
  record_date,
  steps,
  fatloss,
  musclegain,
  water,
  muscle,
  sleep,
  stand,
  farview,
  updated_at,
  weight
from public.daily_health_records;

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
  r.farview,
  r.weight
from public.daily_health_records r
join public.health_profiles p on p.user_id = r.user_id
where r.photo_refs <> '{}'::jsonb;
