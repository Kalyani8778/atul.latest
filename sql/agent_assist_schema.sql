-- Run this in your Supabase SQL editor to enable the agent-assist platform.

-- 1. Add priority column to calls table
alter table public.calls
  add column if not exists priority text not null default 'low';

-- 2. Create analysis table
create table if not exists public.analysis (
  id              uuid        primary key default gen_random_uuid(),
  call_id         uuid        not null,
  emotion         text        not null,
  intent          text        not null,
  priority        text        not null default 'low',
  suggested_actions jsonb     not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_analysis_call_id on public.analysis(call_id);
create index if not exists idx_analysis_created_at on public.analysis(created_at desc);

-- 3. Enable realtime for the analysis table
alter publication supabase_realtime add table public.analysis;

-- 4. Disable RLS so the anon key can read (matches existing calls/messages setup)
alter table public.analysis disable row level security;
