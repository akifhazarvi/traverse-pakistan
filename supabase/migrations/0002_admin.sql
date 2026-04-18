-- Traverse Pakistan — Admin Backoffice
-- Adds: profiles table, is_admin() helper, quote_requests table (idempotent),
-- and admin-full-access RLS policies across all tables.
-- Apply via Supabase SQL editor or: supabase db push
-- Safe to re-run.

-- =========================================================
-- quote_requests (if it wasn't created out-of-band earlier)
-- =========================================================

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  request_type text not null
    check (request_type in ('package','hotel','tour','custom')),
  slug text,
  display_name text not null,
  tier text,
  preferred_start_date date,
  preferred_end_date date,
  adults int not null default 1 check (adults >= 0),
  children int not null default 0 check (children >= 0),
  rooms int not null default 1 check (rooms >= 0),
  departure_city text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  notes text,
  status text not null default 'new'
    check (status in ('new','contacted','quoted','converted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists quote_requests_status_created_idx
  on quote_requests (status, created_at desc);
create index if not exists quote_requests_user_idx
  on quote_requests (user_id, created_at desc);

alter table quote_requests enable row level security;

-- Anyone (incl. anon) can submit a quote request
drop policy if exists "quote_requests_insert_any" on quote_requests;
create policy "quote_requests_insert_any" on quote_requests
  for insert with check (true);

-- Users see their own quote requests
drop policy if exists "quote_requests_own_select" on quote_requests;
create policy "quote_requests_own_select" on quote_requests
  for select using (auth.uid() is not null and auth.uid() = user_id);

drop trigger if exists quote_requests_set_updated_at on quote_requests;
create trigger quote_requests_set_updated_at
  before update on quote_requests
  for each row execute function set_updated_at();

-- =========================================================
-- profiles — one row per auth.users, carries admin flag
-- =========================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create profile row when an auth user is created
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any existing auth.users
insert into public.profiles (id)
select u.id from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- =========================================================
-- is_admin() — RLS helper. security definer avoids recursion
-- on profiles RLS when evaluating other tables' policies.
-- =========================================================

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- =========================================================
-- profiles RLS: users read/update own; admins read/update all
-- is_admin column is protected — only admins can flip it.
-- =========================================================

drop policy if exists "profiles_self_select" on profiles;
create policy "profiles_self_select" on profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_admin_select" on profiles;
create policy "profiles_admin_select" on profiles
  for select using (public.is_admin());

drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- non-admins cannot flip their own is_admin
    and (is_admin = (select p.is_admin from profiles p where p.id = auth.uid()))
  );

drop policy if exists "profiles_admin_update" on profiles;
create policy "profiles_admin_update" on profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- Admin full-access policies on every operational table
-- (select/insert/update/delete). Existing owner-scoped
-- policies remain — Postgres OR's policies together.
-- =========================================================

-- departures
drop policy if exists "departures_admin_all" on departures;
create policy "departures_admin_all" on departures
  for all using (public.is_admin()) with check (public.is_admin());

-- bookings
drop policy if exists "bookings_admin_all" on bookings;
create policy "bookings_admin_all" on bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- booking_participants
drop policy if exists "participants_admin_all" on booking_participants;
create policy "participants_admin_all" on booking_participants
  for all using (public.is_admin()) with check (public.is_admin());

-- payments
drop policy if exists "payments_admin_all" on payments;
create policy "payments_admin_all" on payments
  for all using (public.is_admin()) with check (public.is_admin());

-- reviews (admins can approve/reject/delete)
drop policy if exists "reviews_admin_all" on reviews;
create policy "reviews_admin_all" on reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- quote_requests
drop policy if exists "quote_requests_admin_all" on quote_requests;
create policy "quote_requests_admin_all" on quote_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- To promote your first admin, run ONCE in SQL editor:
--
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
--
-- After that, admins can flip other users via the admin UI.
-- =========================================================
