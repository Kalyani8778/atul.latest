create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  years_as_customer int,
  tier text not null default 'Regular' check (tier in ('Gold', 'Platinum', 'Regular')),
  total_calls int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.calls
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists tier text;

create index if not exists idx_customers_phone on public.customers(phone);
