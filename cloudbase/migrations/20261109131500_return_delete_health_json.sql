drop function if exists public.delete_my_health_data();

create function public.delete_my_health_data()
returns jsonb
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
  return jsonb_build_object('deleted', true);
end;
$$;

grant execute on function public.delete_my_health_data() to authenticated;
