-- Migration: Add safety constraints to bookings table
-- Purpose: Prevent invalid data from being inserted
-- Date: 2026-04-24

-- Prevent booking_ref duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_booking_ref
ON bookings(booking_ref);

-- Prevent null booking refs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_booking_ref_not_null') THEN
    ALTER TABLE bookings ADD CONSTRAINT check_booking_ref_not_null CHECK (booking_ref IS NOT NULL);
  END IF;
END $$;

-- Prevent negative/zero amounts
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_amount_positive') THEN
    ALTER TABLE bookings ADD CONSTRAINT check_amount_positive CHECK (total_amount > 0);
  END IF;
END $$;

-- Prevent zero/negative seats
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_seats_positive') THEN
    ALTER TABLE bookings ADD CONSTRAINT check_seats_positive CHECK (seats > 0);
  END IF;
END $$;

-- Prevent unrealistic seat counts
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_seats_realistic') THEN
    ALTER TABLE bookings ADD CONSTRAINT check_seats_realistic CHECK (seats <= 100);
  END IF;
END $$;

-- Ensure created_at is set
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_created_at_not_null') THEN
    ALTER TABLE bookings ADD CONSTRAINT check_created_at_not_null CHECK (created_at IS NOT NULL);
  END IF;
END $$;
