-- =========================================================
-- 0003_tours.sql
-- Creates tours + tour_itinerary_days tables.
-- Refactors departures: one row per city, single price,
-- adds end_date, drops city-split pricing columns.
-- Drops departure_city from bookings (redundant — now on departures).
-- =========================================================

-- ─── tours ───────────────────────────────────────────────

create table if not exists public.tours (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  name                  text not null,
  description           text not null default '',
  category              text not null,
  badge                 text,
  duration              int not null,
  route                 text not null default '',
  departure_date        date,
  destination_slug      text not null,
  region_slug           text not null,
  travel_style_slugs    text[] not null default '{}',
  rating                numeric(3,1) not null default 0,
  review_count          int not null default 0,
  max_group_size        int not null default 20,
  languages             text[] not null default '{}',
  free_cancellation     boolean not null default true,
  reserve_now_pay_later boolean not null default true,
  images                jsonb not null default '[]',
  guide                 jsonb,
  highlights            text[] not null default '{}',
  inclusions            text[] not null default '{}',
  exclusions            text[] not null default '{}',
  know_before_you_go    text[] not null default '{}',
  meeting_point         jsonb not null default '{}',
  featured              boolean not null default false,
  meta_title            text not null default '',
  meta_description      text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists tours_destination_slug_idx on public.tours(destination_slug);
create index if not exists tours_region_slug_idx on public.tours(region_slug);
create index if not exists tours_category_idx on public.tours(category);
create index if not exists tours_featured_idx on public.tours(featured);

alter table public.tours enable row level security;
create policy "tours_public_read" on public.tours for select using (true);

-- ─── tour_itinerary_days ─────────────────────────────────

create table if not exists public.tour_itinerary_days (
  id           uuid primary key default gen_random_uuid(),
  tour_slug    text not null references public.tours(slug) on delete cascade,
  day_number   int not null,
  title        text not null,
  description  text not null default '',
  image        jsonb,
  stops        jsonb not null default '[]',
  driving_time text not null default '',
  overnight    text not null default '',
  unique (tour_slug, day_number)
);

create index if not exists tour_itinerary_days_tour_slug_idx on public.tour_itinerary_days(tour_slug);

alter table public.tour_itinerary_days enable row level security;
create policy "tour_itinerary_days_public_read" on public.tour_itinerary_days for select using (true);

-- ─── refactor departures ─────────────────────────────────
-- Add new columns

alter table public.departures
  add column if not exists departure_city text
    check (departure_city in ('islamabad','lahore','karachi')),
  add column if not exists end_date date,
  add column if not exists price int;

-- Back-fill price from price_islamabad for existing rows
update public.departures set price = price_islamabad where price is null;

-- Make price not null and add departure_city not null after backfill
alter table public.departures
  alter column price set not null,
  alter column price set default 0;

-- Drop old city-split price columns
alter table public.departures
  drop column if exists price_islamabad,
  drop column if exists price_lahore;

-- Drop old unique constraint (tour_slug, departure_date) — city makes it distinct now
alter table public.departures
  drop constraint if exists departures_tour_slug_departure_date_key;

-- Add new unique constraint including city
alter table public.departures
  add constraint departures_tour_slug_date_city_key
  unique (tour_slug, departure_date, departure_city);

-- ─── drop departure_city from bookings ───────────────────

alter table public.bookings
  drop column if exists departure_city;

-- ─── rewrite create_booking RPC ──────────────────────────
-- departure_city is no longer a param — it's on the departure row

create or replace function create_booking(
  p_departure_id  uuid,
  p_seats         int,
  p_single_rooms  int,
  p_contact_name  text,
  p_contact_email text,
  p_contact_phone text,
  p_participants  jsonb,
  p_notes         text default null
)
returns table (booking_id uuid, booking_ref text, total_amount int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dep    departures%rowtype;
  v_total  int;
  v_bid    uuid;
  v_ref    text;
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

  v_total := (v_dep.price * p_seats)
           + (coalesce(v_dep.single_supplement, 0) * coalesce(p_single_rooms, 0));

  v_ref := 'TP-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into bookings (
    booking_ref, user_id, departure_id, seats,
    single_rooms, total_amount, contact_name, contact_email,
    contact_phone, notes
  ) values (
    v_ref, auth.uid(), p_departure_id, p_seats,
    coalesce(p_single_rooms, 0), v_total, p_contact_name, p_contact_email,
    p_contact_phone, p_notes
  )
  returning id into v_bid;

  insert into booking_participants (
    booking_id, full_name, cnic_or_passport,
    date_of_birth, dietary, emergency_contact
  )
  select
    v_bid,
    x->>'full_name',
    nullif(x->>'cnic_or_passport', ''),
    nullif(x->>'date_of_birth', '')::date,
    nullif(x->>'dietary', ''),
    nullif(x->>'emergency_contact', '')
  from jsonb_array_elements(coalesce(p_participants, '[]'::jsonb)) x;

  update departures
    set seats_booked = seats_booked + p_seats
    where id = p_departure_id;

  return query select v_bid, v_ref, v_total;
end $$;

-- updated_at trigger for tours
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tours_updated_at on public.tours;
create trigger tours_updated_at
  before update on public.tours
  for each row execute function public.set_updated_at();
