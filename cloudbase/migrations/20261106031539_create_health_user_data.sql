create table public.health_profiles (
  user_id varchar(64) primary key default auth.uid(),
  real_name text not null,
  phone text not null,
  nickname text not null,
  avatar_text text not null default '',
  motto text not null default '',
  goals jsonb not null default '{}'::jsonb,
  enabled_projects text[] not null default array['steps', 'fatloss', 'musclegain']::text[],
  onboarding_completed boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_health_records (
  id bigint generated always as identity primary key,
  user_id varchar(64) not null default auth.uid(),
  record_date date not null,
  steps integer not null default 0 check (steps >= 0),
  fatloss numeric(5, 2) not null default 0 check (fatloss between -5 and 5),
  musclegain numeric(5, 2) not null default 0 check (musclegain between -5 and 5),
  water integer not null default 0 check (water >= 0),
  muscle integer not null default 0 check (muscle >= 0),
  sleep numeric(3, 1) not null default 0 check (sleep between 0 and 24),
  stand integer not null default 0 check (stand >= 0),
  farview integer not null default 0 check (farview between 0 and 10),
  note text not null default '',
  photo_refs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, record_date)
);

create index idx_daily_health_records_user_date
  on public.daily_health_records (user_id, record_date desc);

create or replace function public.touch_health_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger health_profiles_touch_updated_at
before update on public.health_profiles
for each row execute function public.touch_health_updated_at();

create trigger daily_health_records_touch_updated_at
before update on public.daily_health_records
for each row execute function public.touch_health_updated_at();

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.health_profiles to authenticated;
grant select, insert, update, delete on public.daily_health_records to authenticated;
grant usage, select on sequence public.daily_health_records_id_seq to authenticated;
grant all on public.health_profiles to service_role;
grant all on public.daily_health_records to service_role;
grant usage, select on sequence public.daily_health_records_id_seq to service_role;

alter table public.health_profiles enable row level security;
alter table public.daily_health_records enable row level security;

create policy health_profiles_select_own
on public.health_profiles for select
to authenticated
using (user_id = auth.uid());

create policy health_profiles_insert_own
on public.health_profiles for insert
to authenticated
with check (user_id = auth.uid());

create policy health_profiles_update_own
on public.health_profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy health_profiles_delete_own
on public.health_profiles for delete
to authenticated
using (user_id = auth.uid());

create policy daily_health_records_select_own
on public.daily_health_records for select
to authenticated
using (user_id = auth.uid());

create policy daily_health_records_insert_own
on public.daily_health_records for insert
to authenticated
with check (user_id = auth.uid());

create policy daily_health_records_update_own
on public.daily_health_records for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy daily_health_records_delete_own
on public.daily_health_records for delete
to authenticated
using (user_id = auth.uid());
