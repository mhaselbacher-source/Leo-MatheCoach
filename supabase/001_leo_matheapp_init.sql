-- Leo MatheApp: initial Supabase schema
-- Run this file in Supabase SQL Editor.
-- This setup avoids direct browser access to tables and exposes only RPC functions.

create extension if not exists pgcrypto;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_key text generated always as (lower(trim(name))) stored,
  pin_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint players_name_key_unique unique (name_key)
);

create table if not exists public.player_stats (
  player_id uuid primary key references public.players(id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  current_week integer not null default 1 check (current_week between 1 and 3),
  current_day integer not null default 1 check (current_day between 1 and 5),
  last_session_on date,
  total_sessions integer not null default 0 check (total_sessions >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  quiz_type text not null check (quiz_type in ('times', 'round', 'est', 'frac', 'numline', 'pyramid')),
  correct boolean not null,
  close boolean not null default false,
  response_time_ms integer not null default 0 check (response_time_ms >= 0),
  session_id uuid not null,
  week integer check (week between 1 and 3),
  day integer check (day between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_results_player_created_at
  on public.quiz_results (player_id, created_at desc);

create index if not exists idx_quiz_results_player_session
  on public.quiz_results (player_id, session_id, created_at desc);

create table if not exists public.skill_stats (
  player_id uuid not null references public.players(id) on delete cascade,
  skill_key text not null check (skill_key in ('times', 'round', 'est', 'frac', 'numline', 'pyramid')),
  attempts integer not null default 0 check (attempts >= 0),
  correct numeric(10,1) not null default 0 check (correct >= 0),
  total_time_ms integer not null default 0 check (total_time_ms >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (player_id, skill_key),
  constraint skill_stats_correct_lte_attempts check (correct <= attempts)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_players_updated_at on public.players;
create trigger trg_players_updated_at
before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists trg_player_stats_updated_at on public.player_stats;
create trigger trg_player_stats_updated_at
before update on public.player_stats
for each row execute function public.set_updated_at();

drop trigger if exists trg_skill_stats_updated_at on public.skill_stats;
create trigger trg_skill_stats_updated_at
before update on public.skill_stats
for each row execute function public.set_updated_at();

alter table public.players enable row level security;
alter table public.player_stats enable row level security;
alter table public.quiz_results enable row level security;
alter table public.skill_stats enable row level security;

revoke all on public.players from anon, authenticated;
revoke all on public.player_stats from anon, authenticated;
revoke all on public.quiz_results from anon, authenticated;
revoke all on public.skill_stats from anon, authenticated;

create or replace function public.verify_player_pin(
  p_player_id uuid,
  p_pin text
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.players p
    where p.id = p_player_id
      and p.pin_hash = extensions.crypt(p_pin, p.pin_hash)
  );
$$;

create or replace function public.create_player(
  p_name text,
  p_pin text
)
returns table (
  player_id uuid,
  player_name text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := trim(coalesce(p_name, ''));
  v_player_id uuid;
  v_skill text;
begin
  if length(v_name) < 2 then
    raise exception 'name_too_short';
  end if;

  if p_pin is null or length(trim(p_pin)) < 4 then
    raise exception 'pin_too_short';
  end if;

  insert into public.players (name, pin_hash)
  values (v_name, extensions.crypt(trim(p_pin), extensions.gen_salt('bf')))
  returning id into v_player_id;

  insert into public.player_stats (player_id)
  values (v_player_id);

  foreach v_skill in array array['times', 'round', 'est', 'frac', 'numline', 'pyramid']
  loop
    insert into public.skill_stats (player_id, skill_key)
    values (v_player_id, v_skill);
  end loop;

  return query
  select v_player_id, v_name;
exception
  when unique_violation then
    raise exception 'name_already_exists';
end;
$$;

create or replace function public.login_player(
  p_name text,
  p_pin text
)
returns table (
  player_id uuid,
  player_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select p.id, p.name
  from public.players p
  where p.name_key = lower(trim(coalesce(p_name, '')))
    and p.pin_hash = extensions.crypt(trim(coalesce(p_pin, '')), p.pin_hash);

  if not found then
    raise exception 'invalid_login';
  end if;
end;
$$;

create or replace function public.get_player_state(
  p_player_id uuid,
  p_pin text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payload jsonb;
begin
  if not public.verify_player_pin(p_player_id, p_pin) then
    raise exception 'invalid_login';
  end if;

  select jsonb_build_object(
    'player', jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'created_at', p.created_at
    ),
    'stats', jsonb_build_object(
      'total_xp', ps.total_xp,
      'streak', ps.streak,
      'current_week', ps.current_week,
      'current_day', ps.current_day,
      'last_session_on', ps.last_session_on,
      'total_sessions', ps.total_sessions
    ),
    'skills', (
      select jsonb_object_agg(
        ss.skill_key,
        jsonb_build_object(
          'attempts', ss.attempts,
          'correct', ss.correct,
          'totalTime', ss.total_time_ms
        )
      )
      from public.skill_stats ss
      where ss.player_id = p.id
    ),
    'recent_sessions', (
      select coalesce(
        jsonb_agg(s order by (s ->> 'date') desc),
        '[]'::jsonb
      )
      from (
        select jsonb_build_object(
          'date', max(qr.created_at),
          'score', sum(
            case
              when qr.correct then 1
              when qr.close then 0.5
              else 0
            end
          ),
          'total', count(*),
          'week', max(qr.week),
          'day', max(qr.day),
          'session_id', qr.session_id
        ) as s
        from public.quiz_results qr
        where qr.player_id = p.id
        group by qr.session_id
        order by max(qr.created_at) desc
        limit 30
      ) sessions
    )
  )
  into v_payload
  from public.players p
  join public.player_stats ps on ps.player_id = p.id
  where p.id = p_player_id;

  return v_payload;
end;
$$;

create or replace function public.save_session_results(
  p_player_id uuid,
  p_pin text,
  p_week integer,
  p_day integer,
  p_results jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid := gen_random_uuid();
  v_item jsonb;
  v_type text;
  v_correct boolean;
  v_close boolean;
  v_response_time integer;
  v_total integer := 0;
  v_score numeric(10,1) := 0;
  v_earned_xp integer := 0;
  v_last_session date;
  v_new_streak integer;
  v_next_day integer;
  v_next_week integer;
begin
  if not public.verify_player_pin(p_player_id, p_pin) then
    raise exception 'invalid_login';
  end if;

  if p_week is not null and (p_week < 1 or p_week > 3) then
    raise exception 'invalid_week';
  end if;

  if p_day is not null and (p_day < 1 or p_day > 5) then
    raise exception 'invalid_day';
  end if;

  if jsonb_typeof(p_results) <> 'array' then
    raise exception 'results_must_be_array';
  end if;

  for v_item in select * from jsonb_array_elements(p_results)
  loop
    v_type := v_item ->> 'type';
    v_correct := coalesce((v_item ->> 'correct')::boolean, false);
    v_close := coalesce((v_item ->> 'close')::boolean, false) and not v_correct;
    v_response_time := greatest(coalesce((v_item ->> 'time')::integer, 0), 0);

    if v_type not in ('times', 'round', 'est', 'frac', 'numline', 'pyramid') then
      raise exception 'invalid_quiz_type';
    end if;

    insert into public.quiz_results (
      player_id,
      quiz_type,
      correct,
      close,
      response_time_ms,
      session_id,
      week,
      day
    )
    values (
      p_player_id,
      v_type,
      v_correct,
      v_close,
      v_response_time,
      v_session_id,
      p_week,
      p_day
    );

    insert into public.skill_stats (
      player_id,
      skill_key,
      attempts,
      correct,
      total_time_ms
    )
    values (
      p_player_id,
      v_type,
      1,
      case
        when v_correct then 1
        when v_close then 0.5
        else 0
      end,
      v_response_time
    )
    on conflict (player_id, skill_key)
    do update set
      attempts = public.skill_stats.attempts + 1,
      correct = public.skill_stats.correct + excluded.correct,
      total_time_ms = public.skill_stats.total_time_ms + excluded.total_time_ms;

    v_total := v_total + 1;
    v_score := v_score + case
      when v_correct then 1
      when v_close then 0.5
      else 0
    end;
  end loop;

  v_earned_xp := (v_score * 10)::integer;

  select last_session_on
  into v_last_session
  from public.player_stats
  where player_id = p_player_id;

  v_new_streak := case
    when v_last_session is null then 1
    when v_last_session = current_date then (
      select streak from public.player_stats where player_id = p_player_id
    )
    when v_last_session = current_date - 1 then (
      select streak + 1 from public.player_stats where player_id = p_player_id
    )
    else 1
  end;

  v_next_day := case
    when coalesce(p_day, 1) < 5 then coalesce(p_day, 1) + 1
    else 1
  end;

  v_next_week := case
    when coalesce(p_day, 1) < 5 then coalesce(p_week, 1)
    else least(coalesce(p_week, 1) + 1, 3)
  end;

  insert into public.player_stats (
    player_id,
    total_xp,
    streak,
    current_week,
    current_day,
    last_session_on,
    total_sessions
  )
  values (
    p_player_id,
    v_earned_xp,
    v_new_streak,
    v_next_week,
    v_next_day,
    current_date,
    1
  )
  on conflict (player_id)
  do update set
    total_xp = public.player_stats.total_xp + excluded.total_xp,
    streak = excluded.streak,
    current_week = excluded.current_week,
    current_day = excluded.current_day,
    last_session_on = excluded.last_session_on,
    total_sessions = public.player_stats.total_sessions + 1;

  return jsonb_build_object(
    'session_id', v_session_id,
    'score', v_score,
    'total', v_total,
    'earned_xp', v_earned_xp,
    'streak', (
      select streak from public.player_stats where player_id = p_player_id
    ),
    'current_week', (
      select current_week from public.player_stats where player_id = p_player_id
    ),
    'current_day', (
      select current_day from public.player_stats where player_id = p_player_id
    )
  );
end;
$$;

create or replace function public.save_free_training_result(
  p_player_id uuid,
  p_pin text,
  p_skill_key text,
  p_correct boolean,
  p_close boolean,
  p_response_time_ms integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_close boolean := coalesce(p_close, false) and not coalesce(p_correct, false);
begin
  if not public.verify_player_pin(p_player_id, p_pin) then
    raise exception 'invalid_login';
  end if;

  if p_skill_key not in ('times', 'round', 'est', 'frac', 'numline', 'pyramid') then
    raise exception 'invalid_quiz_type';
  end if;

  insert into public.skill_stats (
    player_id,
    skill_key,
    attempts,
    correct,
    total_time_ms
  )
  values (
    p_player_id,
    p_skill_key,
    1,
    case
      when coalesce(p_correct, false) then 1
      when v_close then 0.5
      else 0
    end,
    greatest(coalesce(p_response_time_ms, 0), 0)
  )
  on conflict (player_id, skill_key)
  do update set
    attempts = public.skill_stats.attempts + 1,
    correct = public.skill_stats.correct + excluded.correct,
    total_time_ms = public.skill_stats.total_time_ms + excluded.total_time_ms;

  return jsonb_build_object(
    'skill_key', p_skill_key,
    'attempts', (
      select attempts from public.skill_stats
      where player_id = p_player_id and skill_key = p_skill_key
    ),
    'correct', (
      select correct from public.skill_stats
      where player_id = p_player_id and skill_key = p_skill_key
    ),
    'totalTime', (
      select total_time_ms from public.skill_stats
      where player_id = p_player_id and skill_key = p_skill_key
    )
  );
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.verify_player_pin(uuid, text) from public, anon, authenticated;
revoke all on function public.create_player(text, text) from public;
revoke all on function public.login_player(text, text) from public;
revoke all on function public.get_player_state(uuid, text) from public;
revoke all on function public.save_session_results(uuid, text, integer, integer, jsonb) from public;
revoke all on function public.save_free_training_result(uuid, text, text, boolean, boolean, integer) from public;

grant usage on schema public to anon, authenticated;
grant execute on function public.create_player(text, text) to anon, authenticated;
grant execute on function public.login_player(text, text) to anon, authenticated;
grant execute on function public.get_player_state(uuid, text) to anon, authenticated;
grant execute on function public.save_session_results(uuid, text, integer, integer, jsonb) to anon, authenticated;
grant execute on function public.save_free_training_result(uuid, text, text, boolean, boolean, integer) to anon, authenticated;
