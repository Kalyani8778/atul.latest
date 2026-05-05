-- Enable realtime for calls and messages tables
-- Run this in your Supabase SQL editor if calls/messages aren't updating live

alter publication supabase_realtime add table public.calls;
alter publication supabase_realtime add table public.messages;

-- Allow the anon key (frontend) to read calls and messages
-- If RLS is enabled on these tables without policies, the frontend gets empty results silently
alter table public.calls disable row level security;
alter table public.messages disable row level security;
