drop function if exists public.join_health_team(text);

create function public.join_health_team(p_invite_code text)
returns jsonb
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
    return jsonb_build_object('teamId', v_team.id, 'alreadyJoined', true);
  end if;

  select count(*) into v_member_count
  from public.health_team_members
  where team_id = v_team.id;

  if v_member_count >= v_team.member_limit then
    raise exception 'TEAM_IS_FULL';
  end if;

  select coalesce(nullif(name, ''), nullif(username, ''), '队员')
  into v_display_name
  from auth.users
  where id::text = auth.uid()
  limit 1;

  v_avatar_text := left(coalesce(v_display_name, '队'), 1);

  insert into public.health_team_members (team_id, user_id, display_name, avatar_text, role)
  values (v_team.id, auth.uid(), coalesce(v_display_name, '队员'), v_avatar_text, 'member');

  return jsonb_build_object('teamId', v_team.id, 'alreadyJoined', false);
end;
$$;

grant execute on function public.join_health_team(text) to authenticated;
