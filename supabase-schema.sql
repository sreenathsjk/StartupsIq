-- ============================================================
-- Startup Intelligence Engine — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Reports table: stores one AI-generated report per day
create table if not exists reports (
  id           uuid          default gen_random_uuid() primary key,
  date         date          not null unique,
  report       jsonb         not null,
  items_count  int,
  fetch_ms     int,
  ai_ms        int,
  created_at   timestamptz   default now(),
  updated_at   timestamptz   default now()
);

-- Fast lookup by date (most common query)
create index if not exists idx_reports_date_desc on reports (date desc);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_reports_updated_at
  before update on reports
  for each row execute function update_updated_at_column();

-- RLS: allow service role full access, anon read-only
alter table reports enable row level security;

create policy "Service role full access" on reports
  for all using (auth.role() = 'service_role');

create policy "Anon read" on reports
  for select using (true);

-- ============================================================
-- Verify
-- ============================================================
select 'Schema created successfully' as status;
