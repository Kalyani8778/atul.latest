-- ============================================================
-- Run this in Supabase SQL Editor (in order, one block at a time)
-- ============================================================

-- 1. Enable pgvector extension (required for embeddings)
create extension if not exists vector;

-- 2. Add priority column to calls (skip if already done)
alter table public.calls
  add column if not exists priority text not null default 'low';

-- 3. Add suggested_reply to analysis table
alter table public.analysis
  add column if not exists suggested_reply text;

-- 4. Create knowledge_base table
create table if not exists public.knowledge_base (
  id        uuid        primary key default gen_random_uuid(),
  content   text        not null,
  source    text,
  embedding vector(768),
  created_at timestamptz not null default now()
);

create index if not exists idx_knowledge_base_embedding
  on public.knowledge_base
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 5. Create the similarity search function used by RAG
create or replace function match_knowledge(
  query_embedding vector(768),
  match_count     int default 3
)
returns table(content text, similarity float)
language sql stable as $$
  select
    content,
    1 - (embedding <=> query_embedding) as similarity
  from public.knowledge_base
  where embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- 6. Enable realtime on knowledge_base
alter publication supabase_realtime add table public.knowledge_base;

-- 7. Disable RLS (matches existing calls/messages/analysis setup)
alter table public.knowledge_base disable row level security;
