# Supabase Setup — Traverse Pakistan

This guide walks a new contributor through connecting a fresh clone of this repo to Supabase. Time to first booking: **~10 minutes**.

The site will render and browse fine without Supabase — auth forms and online booking flows just fall back to WhatsApp links. You only need Supabase to:

- Sign in / create accounts
- Create real bookings (seats, participants, payments)
- Store user-submitted reviews
- See your own trips in `/account/trips`

---

## 1. Prerequisites

- Node.js 20+ and npm
- A Supabase account (free tier works) — [sign up](https://supabase.com)
- (Optional) Supabase CLI for local migrations: `brew install supabase/tap/supabase`

---

## 2. Clone + install

```bash
git clone https://github.com/akifhazarvi/traverse-pakistan.git
cd traverse-pakistan
npm install
cp .env.example .env.local
```

`npm run dev` will already boot at this point; the site works in read-only mode.

---

## 3. Create a Supabase project

1. Go to [app.supabase.com](https://app.supabase.com) → **New project**.
2. Pick any name (e.g. `traverse-pakistan-dev`). Choose the closest region.
3. Set a strong database password and save it somewhere you can retrieve.
4. Wait ~2 minutes for provisioning.

---

## 4. Apply the schema

The repo ships with a single migration at [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql). It creates:

| Table | Purpose |
|---|---|
| `departures` | Fixed departure dates + seat inventory per tour |
| `bookings` | Customer bookings with ref code, status, totals |
| `booking_participants` | Passenger details per booking |
| `payments` | Payment records linked to bookings |
| `reviews` | User-submitted reviews (moderated) |

It also creates:
- A `create_booking` RPC that atomically allocates seats + returns a booking ref
- Row Level Security policies: bookings/participants/payments are owner-read, reviews are public-read-when-approved
- Indexes for the common query patterns

### Apply it — pick ONE of two ways

**Option A (easiest) — SQL editor**

1. Open your project → **SQL editor** → **New query**.
2. Paste the contents of `supabase/migrations/0001_init.sql`.
3. Click **Run**. Verify "Success. No rows returned."

**Option B — Supabase CLI**

```bash
# One-time: link your local repo to the project
supabase link --project-ref YOUR-PROJECT-REF

# Push the migration
supabase db push
```

You can find `YOUR-PROJECT-REF` in the project URL (`https://app.supabase.com/project/YOUR-PROJECT-REF`).

---

## 5. Copy your API keys

In the Supabase dashboard:

1. **Project Settings → API**
2. Copy two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon / public** key (a long JWT starting with `eyJ...`)

Paste them into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdxyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Do not** use the `service_role` key — that key bypasses RLS and must never be exposed to the browser.

---

## 6. Enable email auth (for sign-in)

1. **Authentication → Providers → Email**: toggle on.
2. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (dev) or your prod domain.
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` and your prod equivalent.
3. (Optional) Customize the magic-link email template under **Auth → Email Templates**.

---

## 7. Seed a departure (so you can test booking)

Without a seeded row in `departures`, the booking sidebar will show "No open departures." Add one from the SQL editor:

```sql
insert into departures
  (tour_slug, departure_date, max_seats, seats_booked, status,
   price_islamabad, price_lahore, single_supplement)
values
  ('blossom-trip-to-hunza', '2026-05-10', 20, 0, 'open',
   47000, 54000, 12000);
```

Substitute any slug from [`src/data/tours.ts`](../src/data/tours.ts).

---

## 8. Restart dev server

```bash
npm run dev
```

Visit [http://localhost:3000/grouptours/blossom-trip-to-hunza](http://localhost:3000/grouptours/blossom-trip-to-hunza) — the booking sidebar should now show the seeded departure and let you reach checkout.

Sign in at [http://localhost:3000/auth/sign-in](http://localhost:3000/auth/sign-in) with any email; Supabase sends a magic link. Once signed in, you'll see your bookings under [`/account/trips`](http://localhost:3000/account/trips).

---

## 9. Regenerate TypeScript types (when you change schema)

The booking service relies on types generated from your database:

```bash
supabase gen types typescript --project-id YOUR-PROJECT-REF \
  --schema public > src/lib/supabase/types.ts
```

Commit the regenerated `types.ts`. If you skip this step after changing the schema, `npm run build` will fail with a TypeScript error in `booking.service.ts`.

---

## 10. Deploy to Vercel

1. Import the repo into Vercel.
2. Add all the env vars from `.env.local` to **Project Settings → Environment Variables** (all three environments: Production, Preview, Development).
3. In Supabase → **Auth → URL Configuration**, add the Vercel preview + prod URLs to **Redirect URLs**.
4. Push. Done.

---

## Common issues

| Symptom | Cause | Fix |
|---|---|---|
| Checkout page shows "Online booking is not available. Please use WhatsApp." | Env vars missing or typo | Double-check both `NEXT_PUBLIC_SUPABASE_*` vars in `.env.local` and restart `npm run dev` |
| Sign-in email never arrives | Redirect URL not allowlisted | Add the exact URL (including path) to **Auth → URL Configuration → Redirect URLs** |
| TypeScript error in `booking.service.ts` after schema change | Types out of date | Run `supabase gen types typescript ...` (step 9) |
| `npm run build` warns about `RLS disabled` | Migration didn't finish | Re-run the SQL — it's idempotent |
| Booking returns "No seats available" | `departures.max_seats = seats_booked` | Seed/top up the departure row |

---

## Schema reference

```
auth.users (managed by Supabase)
   ↓
bookings ────→ departures
   ↓
booking_participants
   ↓
payments

reviews (independent, links to auth.users + tour slug)
```

All columns, constraints, and indexes are documented inline in [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).

---

## Where to look in the code

| Path | Purpose |
|---|---|
| [`src/lib/supabase/env.ts`](../src/lib/supabase/env.ts) | Env var loading + `isSupabaseConfigured` flag |
| [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts) | Browser client (singleton) |
| [`src/lib/supabase/types.ts`](../src/lib/supabase/types.ts) | Generated DB types |
| [`src/services/booking.service.ts`](../src/services/booking.service.ts) | `createBooking()`, `getMyBookings()`, etc. |
| [`src/components/auth/AuthProvider.tsx`](../src/components/auth/AuthProvider.tsx) | Session state for the UI |
| [`supabase/migrations/`](../supabase/migrations/) | All schema changes, in order |

---

Any questions or setup issues: info@traversepakistan.com or WhatsApp +92-321-6650670.
