-- ORCA DB PANEL dual-persistence table
-- Run this entire file once in Supabase SQL Editor.
-- The Render service must use SUPABASE_SERVICE_ROLE_KEY for this server-side
-- backup because snapshots contain encrypted pgAdmin configuration data and
-- may include saved connection credentials.

create table if not exists public.orca_pgadmin_state (
  state_key text primary key,
  db_snapshot_base64 text not null,
  checksum text not null check (checksum ~ '^[0-9a-f]{64}$'),
  captured_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.orca_pgadmin_state_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists orca_pgadmin_state_updated_at on public.orca_pgadmin_state;
create trigger orca_pgadmin_state_updated_at
before update on public.orca_pgadmin_state
for each row execute function public.orca_pgadmin_state_set_updated_at();

alter table public.orca_pgadmin_state enable row level security;

-- No anon/authenticated client access. The Render server uses the service-role
-- key, which bypasses RLS. These explicit policies also protect the table if
-- Supabase client access is enabled later.
drop policy if exists "deny anon reads" on public.orca_pgadmin_state;
drop policy if exists "deny anon writes" on public.orca_pgadmin_state;
drop policy if exists "deny authenticated reads" on public.orca_pgadmin_state;
drop policy if exists "deny authenticated writes" on public.orca_pgadmin_state;
create policy "deny anon reads" on public.orca_pgadmin_state for select to anon using (false);
create policy "deny anon writes" on public.orca_pgadmin_state for all to anon using (false) with check (false);
create policy "deny authenticated reads" on public.orca_pgadmin_state for select to authenticated using (false);
create policy "deny authenticated writes" on public.orca_pgadmin_state for all to authenticated using (false) with check (false);

revoke all on table public.orca_pgadmin_state from anon, authenticated;
grant select, insert, update on table public.orca_pgadmin_state to service_role;
