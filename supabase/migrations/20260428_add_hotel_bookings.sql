create table if not exists public.hotel_bookings (
  id             uuid        primary key default gen_random_uuid(),
  booking_ref    text        unique not null,
  user_id        uuid        references auth.users(id) on delete set null,
  hotel_slug     text        not null,
  room_name      text        not null,
  checkin_date   date,
  checkout_date  date,
  adults         int         not null default 1,
  children       int         not null default 0,
  rooms          int         not null default 1,
  nights         int         not null default 1,
  total_amount   numeric(12,2) not null,
  currency       text        not null default 'PKR',
  payment_status text        not null default 'pending',
  contact_name   text        not null,
  contact_email  text        not null,
  contact_phone  text        not null,
  arrival_time   text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.hotel_bookings enable row level security;

create policy "hotel_bookings_anon_insert" on public.hotel_bookings
  for insert with check (true);

create policy "hotel_bookings_service_select" on public.hotel_bookings
  for select using (auth.role() = 'service_role');

create policy "hotel_bookings_service_update" on public.hotel_bookings
  for update using (auth.role() = 'service_role');

create or replace function public.create_hotel_booking(
  p_hotel_slug    text,
  p_room_name     text,
  p_checkin_date  date,
  p_checkout_date date,
  p_adults        int,
  p_children      int,
  p_rooms         int,
  p_nights        int,
  p_total_amount  numeric,
  p_contact_name  text,
  p_contact_email text,
  p_contact_phone text,
  p_arrival_time  text default null,
  p_notes         text default null
) returns table(booking_id uuid, booking_ref text, total_amount numeric)
language plpgsql security definer as $$
declare
  v_ref text;
  v_id  uuid;
begin
  v_ref := 'HTL-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.hotel_bookings (
    booking_ref, hotel_slug, room_name, checkin_date, checkout_date,
    adults, children, rooms, nights, total_amount, currency,
    contact_name, contact_email, contact_phone, arrival_time, notes
  ) values (
    v_ref, p_hotel_slug, p_room_name, p_checkin_date, p_checkout_date,
    p_adults, p_children, p_rooms, p_nights, p_total_amount, 'PKR',
    p_contact_name, p_contact_email, p_contact_phone, p_arrival_time, p_notes
  ) returning id into v_id;

  return query select v_id, v_ref, p_total_amount;
end;
$$;
