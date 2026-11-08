-- 賽事備忘：Supabase 資料表與權限
-- 在 Supabase Dashboard → SQL Editor 貼上整份執行一次即可（可重複執行）。

-- 賽事資料（兩人共用，都可以新增、修改、刪除）
create table if not exists public.races (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  short_name text not null,
  date date not null,
  end_date date,
  distance_km numeric(6, 4) not null check (distance_km > 0),
  event_mode text not null default 'in_person' check (event_mode in ('in_person', 'virtual')),
  venue text not null default '',
  start_time text not null default '',
  finish_limit text not null default '',
  official_url text not null default '',
  assembly_short text,
  distance_note text,
  check_in_summary text not null default '',
  memo text[] not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);

-- 每場賽事的個人內容：清單勾選、我的備忘、成績、心得
create table if not exists public.race_entries (
  race_id text primary key references public.races (id) on delete cascade,
  checklist jsonb not null default '{}'::jsonb,
  note text not null default '',
  finish_time text not null default '',
  result text not null default 'finished' check (result in ('finished', 'dnf', 'dns')),
  reflection text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);

create or replace function public.touch_updated()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists races_touch on public.races;
create trigger races_touch before update on public.races
  for each row execute function public.touch_updated();

drop trigger if exists race_entries_touch on public.race_entries;
create trigger race_entries_touch before update on public.race_entries
  for each row execute function public.touch_updated();

-- 權限：只有登入的帳號能讀寫。請在 Authentication 設定關閉公開註冊，只建立你們兩人的帳號。
alter table public.races enable row level security;
alter table public.race_entries enable row level security;

drop policy if exists "signed-in users manage races" on public.races;
create policy "signed-in users manage races" on public.races
  for all to authenticated using (true) with check (true);

drop policy if exists "signed-in users manage entries" on public.race_entries;
create policy "signed-in users manage entries" on public.race_entries
  for all to authenticated using (true) with check (true);

-- 即時同步：一支手機改了，另一支馬上更新
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'races'
  ) then
    alter publication supabase_realtime add table public.races;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'race_entries'
  ) then
    alter publication supabase_realtime add table public.race_entries;
  end if;
end;
$$;
