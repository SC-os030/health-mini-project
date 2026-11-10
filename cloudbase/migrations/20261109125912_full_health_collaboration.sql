create table public.daily_checkins (
  user_id varchar(64) not null default auth.uid(),
  checkin_date date not null,
  checked_in_at timestamptz not null default now(),
  streak integer not null default 1 check (streak >= 1),
  primary key (user_id, checkin_date)
);

create table public.health_teams (
  id text primary key,
  name text not null check (char_length(name) between 1 and 24),
  slogan text not null default '',
  invite_code text not null unique,
  owner_id varchar(64) not null default auth.uid(),
  member_limit integer not null default 20 check (member_limit between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.health_team_members (
  team_id text not null references public.health_teams(id) on delete cascade,
  user_id varchar(64) not null,
  display_name text not null,
  avatar_text text not null default '',
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table public.health_challenges (
  id text primary key,
  team_id text not null references public.health_teams(id) on delete cascade,
  activity_key text not null,
  activity_name text not null,
  unit text not null,
  daily_goal numeric(12, 2) not null,
  decimals integer not null default 0 check (decimals between 0 and 2),
  quick_amount numeric(12, 2) not null default 1,
  record_source text not null default 'team' check (record_source in ('team', 'health')),
  health_project text,
  days integer not null check (days between 1 and 365),
  start_date date not null,
  end_date date not null,
  goal numeric(14, 2) not null,
  created_by varchar(64) not null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.health_challenge_logs (
  challenge_id text not null references public.health_challenges(id) on delete cascade,
  user_id varchar(64) not null,
  log_date date not null,
  value numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (challenge_id, user_id, log_date)
);

create index idx_health_team_members_user on public.health_team_members(user_id);
create index idx_health_challenges_team on public.health_challenges(team_id, created_at desc);
create index idx_health_challenge_logs_user on public.health_challenge_logs(user_id, log_date desc);
create index idx_daily_checkins_user_date on public.daily_checkins(user_id, checkin_date desc);

create trigger health_teams_touch_updated_at
before update on public.health_teams
for each row execute function public.touch_health_updated_at();

create trigger health_challenges_touch_updated_at
before update on public.health_challenges
for each row execute function public.touch_health_updated_at();

create or replace function public.is_health_team_member(
  p_team_id text,
  p_user_id varchar(64) default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.health_team_members
    where team_id = p_team_id and user_id = p_user_id
  );
$$;

create or replace function public.is_health_team_owner(
  p_team_id text,
  p_user_id varchar(64) default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.health_teams
    where id = p_team_id and owner_id = p_user_id
  );
$$;

grant execute on function public.is_health_team_member(text, varchar) to authenticated;
grant execute on function public.is_health_team_owner(text, varchar) to authenticated;

grant select, insert, update, delete on public.daily_checkins to authenticated;
grant select, insert, update, delete on public.health_teams to authenticated;
grant select, insert, update, delete on public.health_team_members to authenticated;
grant select, insert, update, delete on public.health_challenges to authenticated;
grant select, insert, update, delete on public.health_challenge_logs to authenticated;

alter table public.daily_checkins enable row level security;
alter table public.health_teams enable row level security;
alter table public.health_team_members enable row level security;
alter table public.health_challenges enable row level security;
alter table public.health_challenge_logs enable row level security;

create policy daily_checkins_select_own
on public.daily_checkins for select to authenticated
using (user_id = auth.uid());

create policy daily_checkins_insert_own
on public.daily_checkins for insert to authenticated
with check (user_id = auth.uid());

create policy daily_checkins_update_own
on public.daily_checkins for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy daily_checkins_delete_own
on public.daily_checkins for delete to authenticated
using (user_id = auth.uid());

create policy health_teams_select_member
on public.health_teams for select to authenticated
using (owner_id = auth.uid() or public.is_health_team_member(id));

create policy health_teams_insert_owner
on public.health_teams for insert to authenticated
with check (owner_id = auth.uid());

create policy health_teams_update_owner
on public.health_teams for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy health_teams_delete_owner
on public.health_teams for delete to authenticated
using (owner_id = auth.uid());

create policy health_team_members_select_teammate
on public.health_team_members for select to authenticated
using (user_id = auth.uid() or public.is_health_team_member(team_id));

create policy health_team_members_insert_self
on public.health_team_members for insert to authenticated
with check (
  user_id = auth.uid()
  and (
    public.is_health_team_member(team_id)
    or public.is_health_team_owner(team_id)
  )
);

create policy health_team_members_update_self_or_owner
on public.health_team_members for update to authenticated
using (user_id = auth.uid() or public.is_health_team_owner(team_id))
with check (user_id = auth.uid() or public.is_health_team_owner(team_id));

create policy health_team_members_delete_self_or_owner
on public.health_team_members for delete to authenticated
using (user_id = auth.uid() or public.is_health_team_owner(team_id));

create policy health_challenges_select_member
on public.health_challenges for select to authenticated
using (public.is_health_team_member(team_id));

create policy health_challenges_insert_member
on public.health_challenges for insert to authenticated
with check (
  created_by = auth.uid()
  and public.is_health_team_member(team_id)
);

create policy health_challenges_update_creator_or_owner
on public.health_challenges for update to authenticated
using (created_by = auth.uid() or public.is_health_team_owner(team_id))
with check (created_by = auth.uid() or public.is_health_team_owner(team_id));

create policy health_challenges_delete_creator_or_owner
on public.health_challenges for delete to authenticated
using (created_by = auth.uid() or public.is_health_team_owner(team_id));

create policy health_challenge_logs_select_member
on public.health_challenge_logs for select to authenticated
using (public.is_health_team_member(
  (select team_id from public.health_challenges where id = challenge_id)
));

create policy health_challenge_logs_insert_own
on public.health_challenge_logs for insert to authenticated
with check (
  user_id = auth.uid()
  and public.is_health_team_member(
    (select team_id from public.health_challenges where id = challenge_id)
  )
);

create policy health_challenge_logs_update_own
on public.health_challenge_logs for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy health_challenge_logs_delete_own
on public.health_challenge_logs for delete to authenticated
using (user_id = auth.uid());

create or replace function public.join_health_team(p_invite_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team public.health_teams%rowtype;
  v_member_count integer;
  v_display_name text;
  v_avatar_text text;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_team
  from public.health_teams
  where upper(invite_code) = upper(trim(p_invite_code))
  limit 1;

  if v_team.id is null then
    raise exception 'INVITE_CODE_NOT_FOUND';
  end if;

  if exists (
    select 1 from public.health_team_members
    where team_id = v_team.id and user_id = auth.uid()
  ) then
    return v_team.id;
  end if;

  select count(*) into v_member_count
  from public.health_team_members
  where team_id = v_team.id;

  if v_member_count >= v_team.member_limit then
    raise exception 'TEAM_IS_FULL';
  end if;

  select coalesce(nullif(user_metadata->>'name', ''), nullif(user_metadata->>'nickname', ''), '队员')
  into v_display_name
  from auth.users
  where id = auth.uid();

  v_avatar_text := left(coalesce(v_display_name, '队'), 1);

  insert into public.health_team_members (team_id, user_id, display_name, avatar_text, role)
  values (v_team.id, auth.uid(), coalesce(v_display_name, '队员'), v_avatar_text, 'member');

  return v_team.id;
end;
$$;

grant execute on function public.join_health_team(text) to authenticated;

create or replace function public.delete_my_health_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.health_challenge_logs where user_id = auth.uid();
  delete from public.health_team_members where user_id = auth.uid();
  delete from public.health_challenges
  where team_id in (
    select id from public.health_teams where owner_id = auth.uid()
  );
  delete from public.health_team_members
  where team_id in (
    select id from public.health_teams where owner_id = auth.uid()
  );
  delete from public.health_teams where owner_id = auth.uid();
  delete from public.daily_checkins where user_id = auth.uid();
  delete from public.daily_health_records where user_id = auth.uid();
  delete from public.health_profiles where user_id = auth.uid();
end;
$$;

grant execute on function public.delete_my_health_data() to authenticated;

create view public.health_public_profiles
with (security_invoker = false)
as
select user_id, nickname, avatar_text, goals, enabled_projects, updated_at
from public.health_profiles;

create view public.health_public_daily_records
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
  updated_at
from public.daily_health_records;

create view public.health_public_teams
with (security_invoker = false)
as
select
  t.id,
  t.name,
  t.slogan,
  t.owner_id,
  t.created_at,
  count(m.user_id)::integer as member_count
from public.health_teams t
left join public.health_team_members m on m.team_id = t.id
group by t.id;

create view public.health_public_team_members
with (security_invoker = false)
as
select team_id, user_id, display_name, avatar_text, role, joined_at
from public.health_team_members;

create view public.health_public_challenges
with (security_invoker = false)
as
select
  id,
  team_id,
  activity_key,
  activity_name,
  unit,
  daily_goal,
  decimals,
  quick_amount,
  record_source,
  health_project,
  days,
  start_date,
  end_date,
  goal,
  created_by,
  created_at
from public.health_challenges;

create view public.health_team_challenge_logs
with (security_invoker = false)
as
select l.challenge_id, l.user_id, l.log_date, l.value, l.updated_at
from public.health_challenge_logs l
join public.health_challenges c on c.id = l.challenge_id
where public.is_health_team_member(c.team_id);

create view public.health_community_shares
with (security_invoker = false)
as
select
  r.user_id,
  p.nickname,
  p.avatar_text,
  r.record_date,
  r.note,
  r.photo_refs,
  r.updated_at
from public.daily_health_records r
join public.health_profiles p on p.user_id = r.user_id
where r.photo_refs <> '{}'::jsonb;

revoke all on public.health_public_profiles from anon;
revoke all on public.health_public_daily_records from anon;
revoke all on public.health_public_teams from anon;
revoke all on public.health_public_team_members from anon;
revoke all on public.health_public_challenges from anon;
revoke all on public.health_team_challenge_logs from anon;
revoke all on public.health_community_shares from anon;

grant select on public.health_public_profiles to authenticated;
grant select on public.health_public_daily_records to authenticated;
grant select on public.health_public_teams to authenticated;
grant select on public.health_public_team_members to authenticated;
grant select on public.health_public_challenges to authenticated;
grant select on public.health_team_challenge_logs to authenticated;
grant select on public.health_community_shares to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'health-checkin-photos',
  'health-checkin-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'health_checkin_photos_insert_own'
  ) then
    create policy health_checkin_photos_insert_own
    on storage.objects for insert to authenticated
    with check (
      bucket_id = 'health-checkin-photos'
      and (storage.foldername(name))[1] = auth.uid()
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'health_checkin_photos_read_authenticated'
  ) then
    create policy health_checkin_photos_read_authenticated
    on storage.objects for select to authenticated
    using (bucket_id = 'health-checkin-photos');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'health_checkin_photos_update_own'
  ) then
    create policy health_checkin_photos_update_own
    on storage.objects for update to authenticated
    using (
      bucket_id = 'health-checkin-photos'
      and (storage.foldername(name))[1] = auth.uid()
    )
    with check (
      bucket_id = 'health-checkin-photos'
      and (storage.foldername(name))[1] = auth.uid()
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'health_checkin_photos_delete_own'
  ) then
    create policy health_checkin_photos_delete_own
    on storage.objects for delete to authenticated
    using (
      bucket_id = 'health-checkin-photos'
      and (storage.foldername(name))[1] = auth.uid()
    );
  end if;
end;
$$;
