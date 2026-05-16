CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE service_category AS ENUM ('hair', 'nails', 'skincare', 'children', 'event', 'home');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  password_hash text NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category service_category NOT NULL,
  description text NOT NULL,
  price_cents integer,
  duration_minutes integer NOT NULL,
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_door_to_door boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT booking_time_order CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings (user_id);
CREATE INDEX IF NOT EXISTS bookings_service_id_idx ON bookings (service_id);
CREATE INDEX IF NOT EXISTS bookings_schedule_idx ON bookings (appointment_date, start_time, end_time);

DO $$ BEGIN
  ALTER TABLE bookings
    ADD CONSTRAINT bookings_no_active_overlap
    EXCLUDE USING gist (
      tsrange(appointment_date + start_time, appointment_date + end_time, '[)') WITH &&
    )
    WHERE (status IN ('pending', 'confirmed'));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
