/*
# Add payment submissions, merch images, and gallery event fields

1. New Tables
- `payment_submissions` — stores payment form submissions (donations, merch, course payments)
  - id (uuid, primary key)
  - full_name (text, not null)
  - email (text, not null)
  - phone (text, nullable)
  - amount (text, not null)
  - reference_number (text, nullable)
  - purpose (text, nullable) — where proceeds should go
  - message (text, nullable)
  - receipt_url (text, nullable) — uploaded receipt image/pdf
  - source (text, nullable) — 'general', 'merch', 'course'
  - status (text, default 'pending')
  - created_at (timestamptz)

- `merch_images` — additional images for merch products
  - id (uuid, primary key)
  - merch_id (uuid, references merch)
  - image_url (text, not null)
  - sort_order (int, default 0)
  - created_at (timestamptz)

2. Modified Tables
- `gallery_events` — add event_type, impact columns
  - event_type (text, nullable) — e.g. 'Outreach', 'Workshop', 'Conference'
  - impact (text, nullable) — description of event impact

3. Security
- Enable RLS on new tables
- Allow anon + authenticated CRUD (single-tenant, no-auth public app)
*/

-- Payment submissions table
CREATE TABLE IF NOT EXISTS payment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  amount text NOT NULL,
  proceeds text,
  reference_number text,
  purpose text,
  message text,
  receipt_url text,
  source text DEFAULT 'general',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_payment_submissions" ON payment_submissions;
CREATE POLICY "anon_select_payment_submissions" ON payment_submissions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_payment_submissions" ON payment_submissions;
CREATE POLICY "anon_insert_payment_submissions" ON payment_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_payment_submissions" ON payment_submissions;
CREATE POLICY "anon_update_payment_submissions" ON payment_submissions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_payment_submissions" ON payment_submissions;
CREATE POLICY "anon_delete_payment_submissions" ON payment_submissions FOR DELETE
  TO anon, authenticated USING (true);

-- Merch images table
CREATE TABLE IF NOT EXISTS merch_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merch_id uuid REFERENCES merch(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merch_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_merch_images" ON merch_images;
CREATE POLICY "anon_select_merch_images" ON merch_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_merch_images" ON merch_images;
CREATE POLICY "anon_insert_merch_images" ON merch_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_merch_images" ON merch_images;
CREATE POLICY "anon_update_merch_images" ON merch_images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_merch_images" ON merch_images;
CREATE POLICY "anon_delete_merch_images" ON merch_images FOR DELETE
  TO anon, authenticated USING (true);

-- Add event_type and impact columns to gallery_events
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_events' AND column_name = 'event_type') THEN
    ALTER TABLE gallery_events ADD COLUMN event_type text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_events' AND column_name = 'impact') THEN
    ALTER TABLE gallery_events ADD COLUMN impact text;
  END IF;
END $$;
