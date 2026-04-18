-- Traverse Pakistan — Booking System Initial Schema
-- Apply via Supabase SQL editor or: supabase db push

-- =========================================================
-- Tables
-- =========================================================

create table if not exists departures (
  id uuid primary key default gen_random_uuid(),
  tour_slug text not null,
  departure_date date not null,
  max_seats int not null check (max_seats > 0),
  seats_booked int not null default 0 check (seats_booked >= 0),
  status text not null default 'open'
    check (status in ('open','closed','cancelled')),
  price_islamabad int not null check (price_islamabad > 0),
  price_lahore int,
  single_supplement int,
  created_at timestamptz not null default now(),
  unique (tour_slug, departure_date)
);
create index if not exists departures_tour_status_date_idx
  on departures (tour_slug, status, departure_date);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  departure_id uuid not null references departures(id) on delete restrict,
  seats int not null check (seats > 0),
  departure_city text not null
    check (departure_city in ('islamabad','lahore')),
  single_rooms int not null default 0 check (single_rooms >= 0),
  total_amount int not null check (total_amount >= 0),
  currency text not null default 'PKR',
  status text not null default 'pending'
    check (status in ('pending','confirmed','cancelled','refunded')),
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on bookings (user_id, created_at desc);
create index if not exists bookings_departure_idx on bookings (departure_id);

create table if not exists booking_participants (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  full_name text not null,
  cnic_or_passport text,
  date_of_birth date,
  dietary text,
  emergency_contact text
);
create index if not exists booking_participants_booking_idx
  on booking_participants (booking_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  provider text not null,
  provider_ref text,
  amount int not null,
  currency text not null default 'PKR',
  status text not null
    check (status in ('initiated','succeeded','failed','refunded')),
  raw jsonb,
  created_at timestamptz not null default now()
);
create index if not exists payments_booking_idx on payments (booking_id);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tour_slug text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reviews_tour_idx
  on reviews (tour_slug, approved, created_at desc);

-- =========================================================
-- updated_at trigger on bookings
-- =========================================================

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- =========================================================
-- create_booking RPC — atomic, row-locked
-- =========================================================

create or replace function create_booking(
  p_departure_id uuid,
  p_seats int,
  p_departure_city text,
  p_single_rooms int,
  p_contact_name text,
  p_contact_email text,
  p_contact_phone text,
  p_participants jsonb,
  p_notes text default null
)
returns table (booking_id uuid, booking_ref text, total_amount int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dep departures%rowtype;
  v_unit_price int;
  v_total int;
  v_booking_id uuid;
  v_ref text;
begin
  if p_seats is null or p_seats <= 0 then
    raise exception 'Invalid seat count';
  end if;

  select * into v_dep from departures
    where id = p_departure_id for update;

  if not found then raise exception 'Departure not found'; end if;
  if v_dep.status <> 'open' then raise exception 'Departure is not open'; end if;
  if v_dep.seats_booked + p_seats > v_dep.max_seats then
    raise exception 'Only % seats left', v_dep.max_seats - v_dep.seats_booked;
  end if;

  v_unit_price := case p_departure_city
    when 'islamabad' then v_dep.price_islamabad
    when 'lahore'    then coalesce(v_dep.price_lahore, v_dep.price_islamabad)
    else null end;
  if v_unit_price is null then raise exception 'Invalid departure city'; end if;

  v_total := (v_unit_price * p_seats)
           + (coalesce(v_dep.single_supplement, 0) * coalesce(p_single_rooms, 0));

  v_ref := 'TP-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into bookings (
    booking_ref, user_id, departure_id, seats, departure_city,
    single_rooms, total_amount, contact_name, contact_email,
    contact_phone, notes
  ) values (
    v_ref, auth.uid(), p_departure_id, p_seats, p_departure_city,
    coalesce(p_single_rooms, 0), v_total, p_contact_name, p_contact_email,
    p_contact_phone, p_notes
  )
  returning id into v_booking_id;

  insert into booking_participants (
    booking_id, full_name, cnic_or_passport,
    date_of_birth, dietary, emergency_contact
  )
  select
    v_booking_id,
    x->>'full_name',
    nullif(x->>'cnic_or_passport', ''),
    nullif(x->>'date_of_birth', '')::date,
    nullif(x->>'dietary', ''),
    nullif(x->>'emergency_contact', '')
  from jsonb_array_elements(coalesce(p_participants, '[]'::jsonb)) x;

  update departures
    set seats_booked = seats_booked + p_seats
    where id = p_departure_id;

  return query select v_booking_id, v_ref, v_total;
end $$;

-- =========================================================
-- Row Level Security
-- =========================================================

alter table departures enable row level security;
alter table bookings enable row level security;
alter table booking_participants enable row level security;
alter table payments enable row level security;
alter table reviews enable row level security;

-- Departures: public read of open rows
drop policy if exists "departures_public_read" on departures;
create policy "departures_public_read" on departures
  for select using (status = 'open');

-- Bookings: users see only their own
drop policy if exists "bookings_own_select" on bookings;
create policy "bookings_own_select" on bookings
  for select using (auth.uid() = user_id);

-- Participants: visible only to owner of the parent booking
drop policy if exists "participants_own_select" on booking_participants;
create policy "participants_own_select" on booking_participants
  for select using (
    exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid())
  );

-- Payments: owner read only
drop policy if exists "payments_own_select" on payments;
create policy "payments_own_select" on payments
  for select using (
    exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid())
  );

-- Reviews: public read of approved, users insert their own
drop policy if exists "reviews_public_read" on reviews;
create policy "reviews_public_read" on reviews
  for select using (approved = true);

drop policy if exists "reviews_insert_self" on reviews;
create policy "reviews_insert_self" on reviews
  for insert with check (auth.uid() = user_id);
