/*
# Create storage bucket + add course/merch detail page schema

## 1. Storage Bucket
- Creates the `uploads` storage bucket (public) that was missing, causing "Bucket not found" errors on admin image uploads.

## 2. Course Detail Fields
- Adds columns to `courses` table for dedicated course detail pages:
  - `is_paid` (boolean, default false) — whether the course requires payment
  - `price` (text, nullable) — course price if paid
  - `currency` (text, default 'NGN') — currency for the price
  - `objectives` (text, nullable) — what the course entails / objectives
  - `benefits` (text, nullable) — benefits of taking the course
  - `who_for` (text, nullable) — who the course is for
  - `format` (text, nullable) — course format (online/offline)
  - `requirements` (text, nullable) — course requirements
  - `instructor_bio` (text, nullable) — instructor biography
  - `application_instructions` (text, nullable) — how to apply
  - `what_you_receive` (text, nullable) — what participants receive
  - `exam_info` (text, nullable) — examination information
  - `cert_info` (text, nullable) — certificate information
  - `passing_score` (integer, nullable) — minimum exam score for certificate (e.g. 75)
  - `exam_link` (text, nullable) — link to examination
  - `access_link` (text, nullable) — course access link/platform
  - `email_instructions` (text, nullable) — info sent to applicants by email

## 3. Course Sections (custom, unlimited)
- New table `course_sections` for admin-defined custom sections per course.
  - `id`, `course_id` (FK), `title`, `content`, `sort_order`, `created_at`
  - Admin can add/remove/rename/reorder sections per course.

## 4. Course Media (multiple images)
- New table `course_media` for multiple images per course.
  - `id`, `course_id` (FK), `image_url`, `sort_order`, `created_at`

## 5. Program Detail Fields
- Adds columns to `programs` table for dedicated program detail pages:
  - `objectives` (text, nullable)
  - `target_beneficiaries` (text, nullable)
  - `program_details` (text, nullable)
  - `dates` (text, nullable)
  - `location` (text, nullable)
  - `facilitators` (text, nullable)
  - `partners` (text, nullable)

## 6. Program Media (multiple images)
- New table `program_media` for multiple images per program.
  - `id`, `program_id` (FK), `image_url`, `sort_order`, `created_at`

## 7. Program Sections (custom, unlimited)
- New table `program_sections` for admin-defined custom sections per program.

## 8. Gallery Photos (already exists, add video support)
- Adds `video_url` column to `gallery_photos` for video support.

## 9. Payment Submissions — add source context fields
- Adds `course_id`, `merch_id`, `application_id`, `order_id` to `payment_submissions` so payments link to course/merch records.

## Security
- RLS enabled on all new tables with anon+authenticated CRUD (single-tenant, no public sign-in).
- Storage bucket policies for public read + anon/authenticated upload.
*/

-- 1. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "uploads_public_read" ON storage.objects;
CREATE POLICY "uploads_public_read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "uploads_anon_insert" ON storage.objects;
CREATE POLICY "uploads_anon_insert"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'uploads');

DROP POLICY IF EXISTS "uploads_anon_update" ON storage.objects;
CREATE POLICY "uploads_anon_update"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');

DROP POLICY IF EXISTS "uploads_anon_delete" ON storage.objects;
CREATE POLICY "uploads_anon_delete"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'uploads');

-- 2. Course detail fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_paid') THEN
    ALTER TABLE courses ADD COLUMN is_paid boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'price') THEN
    ALTER TABLE courses ADD COLUMN price text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'currency') THEN
    ALTER TABLE courses ADD COLUMN currency text NOT NULL DEFAULT 'NGN';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'objectives') THEN
    ALTER TABLE courses ADD COLUMN objectives text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'benefits') THEN
    ALTER TABLE courses ADD COLUMN benefits text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'who_for') THEN
    ALTER TABLE courses ADD COLUMN who_for text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'format') THEN
    ALTER TABLE courses ADD COLUMN format text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'requirements') THEN
    ALTER TABLE courses ADD COLUMN requirements text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_bio') THEN
    ALTER TABLE courses ADD COLUMN instructor_bio text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'application_instructions') THEN
    ALTER TABLE courses ADD COLUMN application_instructions text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'what_you_receive') THEN
    ALTER TABLE courses ADD COLUMN what_you_receive text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'exam_info') THEN
    ALTER TABLE courses ADD COLUMN exam_info text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'cert_info') THEN
    ALTER TABLE courses ADD COLUMN cert_info text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'passing_score') THEN
    ALTER TABLE courses ADD COLUMN passing_score integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'exam_link') THEN
    ALTER TABLE courses ADD COLUMN exam_link text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'access_link') THEN
    ALTER TABLE courses ADD COLUMN access_link text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'email_instructions') THEN
    ALTER TABLE courses ADD COLUMN email_instructions text;
  END IF;
END $$;

-- 3. Course sections table
CREATE TABLE IF NOT EXISTS course_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_course_sections" ON course_sections;
CREATE POLICY "anon_select_course_sections" ON course_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_course_sections" ON course_sections;
CREATE POLICY "anon_insert_course_sections" ON course_sections FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_course_sections" ON course_sections;
CREATE POLICY "anon_update_course_sections" ON course_sections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_course_sections" ON course_sections;
CREATE POLICY "anon_delete_course_sections" ON course_sections FOR DELETE TO anon, authenticated USING (true);

-- 4. Course media table
CREATE TABLE IF NOT EXISTS course_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE course_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_course_media" ON course_media;
CREATE POLICY "anon_select_course_media" ON course_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_course_media" ON course_media;
CREATE POLICY "anon_insert_course_media" ON course_media FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_course_media" ON course_media;
CREATE POLICY "anon_update_course_media" ON course_media FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_course_media" ON course_media;
CREATE POLICY "anon_delete_course_media" ON course_media FOR DELETE TO anon, authenticated USING (true);

-- 5. Program detail fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'objectives') THEN
    ALTER TABLE programs ADD COLUMN objectives text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'target_beneficiaries') THEN
    ALTER TABLE programs ADD COLUMN target_beneficiaries text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'program_details') THEN
    ALTER TABLE programs ADD COLUMN program_details text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'dates') THEN
    ALTER TABLE programs ADD COLUMN dates text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'location') THEN
    ALTER TABLE programs ADD COLUMN location text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'facilitators') THEN
    ALTER TABLE programs ADD COLUMN facilitators text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'partners') THEN
    ALTER TABLE programs ADD COLUMN partners text;
  END IF;
END $$;

-- 6. Program media table
CREATE TABLE IF NOT EXISTS program_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE program_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_program_media" ON program_media;
CREATE POLICY "anon_select_program_media" ON program_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_program_media" ON program_media;
CREATE POLICY "anon_insert_program_media" ON program_media FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_program_media" ON program_media;
CREATE POLICY "anon_update_program_media" ON program_media FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_program_media" ON program_media;
CREATE POLICY "anon_delete_program_media" ON program_media FOR DELETE TO anon, authenticated USING (true);

-- 7. Program sections table
CREATE TABLE IF NOT EXISTS program_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE program_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_program_sections" ON program_sections;
CREATE POLICY "anon_select_program_sections" ON program_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_program_sections" ON program_sections;
CREATE POLICY "anon_insert_program_sections" ON program_sections FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_program_sections" ON program_sections;
CREATE POLICY "anon_update_program_sections" ON program_sections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_program_sections" ON program_sections;
CREATE POLICY "anon_delete_program_sections" ON program_sections FOR DELETE TO anon, authenticated USING (true);

-- 8. Gallery photos video support
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'video_url') THEN
    ALTER TABLE gallery_photos ADD COLUMN video_url text;
  END IF;
END $$;

-- 9. Payment submissions context fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_submissions' AND column_name = 'course_id') THEN
    ALTER TABLE payment_submissions ADD COLUMN course_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_submissions' AND column_name = 'merch_id') THEN
    ALTER TABLE payment_submissions ADD COLUMN merch_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_submissions' AND column_name = 'application_id') THEN
    ALTER TABLE payment_submissions ADD COLUMN application_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_submissions' AND column_name = 'order_id') THEN
    ALTER TABLE payment_submissions ADD COLUMN order_id uuid;
  END IF;
END $$;
