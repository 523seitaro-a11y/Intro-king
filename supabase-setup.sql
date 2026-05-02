-- Intro-post shared storage for public testing.
-- Run this in Supabase SQL Editor before opening the GitHub Pages site.

create table if not exists public.intro_topics (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.intro_rankings (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.intro_topics enable row level security;
alter table public.intro_rankings enable row level security;

drop policy if exists "intro_topics_public_read" on public.intro_topics;
drop policy if exists "intro_topics_public_insert" on public.intro_topics;
drop policy if exists "intro_topics_public_update" on public.intro_topics;
drop policy if exists "intro_topics_public_delete" on public.intro_topics;

create policy "intro_topics_public_read"
on public.intro_topics for select
to anon, authenticated
using (true);

create policy "intro_topics_public_insert"
on public.intro_topics for insert
to anon, authenticated
with check (true);

create policy "intro_topics_public_update"
on public.intro_topics for update
to anon, authenticated
using (true)
with check (true);

create policy "intro_topics_public_delete"
on public.intro_topics for delete
to anon, authenticated
using (true);

drop policy if exists "intro_rankings_public_read" on public.intro_rankings;
drop policy if exists "intro_rankings_public_insert" on public.intro_rankings;
drop policy if exists "intro_rankings_public_update" on public.intro_rankings;
drop policy if exists "intro_rankings_public_delete" on public.intro_rankings;

create policy "intro_rankings_public_read"
on public.intro_rankings for select
to anon, authenticated
using (true);

create policy "intro_rankings_public_insert"
on public.intro_rankings for insert
to anon, authenticated
with check (true);

create policy "intro_rankings_public_update"
on public.intro_rankings for update
to anon, authenticated
using (true)
with check (true);

create policy "intro_rankings_public_delete"
on public.intro_rankings for delete
to anon, authenticated
using (true);
