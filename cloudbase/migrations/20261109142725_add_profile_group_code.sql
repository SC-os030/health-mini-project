alter table public.health_profiles
add column group_code text not null default 'personal'
check (group_code in ('personal', 'group', 'claims'));

create index idx_health_profiles_group_code
  on public.health_profiles(group_code);

create or replace view public.health_public_profiles
with (security_invoker = false)
as
select
  user_id,
  nickname,
  avatar_text,
  goals,
  enabled_projects,
  updated_at,
  group_code
from public.health_profiles;
