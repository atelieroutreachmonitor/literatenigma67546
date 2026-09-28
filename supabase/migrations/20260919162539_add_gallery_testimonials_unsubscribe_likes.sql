/*
# Add gallery, testimonials, unsubscribe, and blog likes tables

1. New Tables
- `gallery_events` — gallery events with title, description, cover image, and publish status
- `gallery_photos` — photos belonging to gallery events, with image URL, caption, and sort order
- `testimonials` — testimonials with quote, author name, role, location, photo, and publish status
- `unsubscribe_submissions` — form submissions from users unsubscribing from newsletter, with reason
- `blog_likes` — tracks likes on blog posts (one per email per post)

2. Security
- All tables use anon+authenticated CRUD (single-tenant, no sign-in for public-facing forms)
- Gallery events and photos: public read, anon insert for submissions
- Testimonials: public read, anon insert
- Unsubscribe: public read/insert
- Blog likes: public read/insert

3. Notes
- Gallery events link to gallery photos via event_id foreign key
- Blog likes use a unique constraint on (blog_post_id, email) to prevent duplicate likes
*/

-- Gallery events
CREATE TABLE IF NOT EXISTS gallery_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image_url text,
  event_date text,
  event_location text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_events" ON gallery_events;
CREATE POLICY "anon_select_gallery_events" ON gallery_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gallery_events" ON gallery_events;
CREATE POLICY "anon_insert_gallery_events" ON gallery_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gallery_events" ON gallery_events;
CREATE POLICY "anon_update_gallery_events" ON gallery_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gallery_events" ON gallery_events;
CREATE POLICY "anon_delete_gallery_events" ON gallery_events FOR DELETE
  TO anon, authenticated USING (true);

-- Gallery photos
CREATE TABLE IF NOT EXISTS gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES gallery_events(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_photos" ON gallery_photos;
CREATE POLICY "anon_select_gallery_photos" ON gallery_photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gallery_photos" ON gallery_photos;
CREATE POLICY "anon_insert_gallery_photos" ON gallery_photos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gallery_photos" ON gallery_photos;
CREATE POLICY "anon_update_gallery_photos" ON gallery_photos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gallery_photos" ON gallery_photos;
CREATE POLICY "anon_delete_gallery_photos" ON gallery_photos FOR DELETE
  TO anon, authenticated USING (true);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author_name text NOT NULL,
  author_role text,
  author_location text,
  photo_url text,
  published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_testimonials" ON testimonials;
CREATE POLICY "anon_insert_testimonials" ON testimonials FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_testimonials" ON testimonials;
CREATE POLICY "anon_update_testimonials" ON testimonials FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_testimonials" ON testimonials;
CREATE POLICY "anon_delete_testimonials" ON testimonials FOR DELETE
  TO anon, authenticated USING (true);

-- Unsubscribe submissions
CREATE TABLE IF NOT EXISTS unsubscribe_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE unsubscribe_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_unsubscribe" ON unsubscribe_submissions;
CREATE POLICY "anon_select_unsubscribe" ON unsubscribe_submissions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_unsubscribe" ON unsubscribe_submissions;
CREATE POLICY "anon_insert_unsubscribe" ON unsubscribe_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_unsubscribe" ON unsubscribe_submissions;
CREATE POLICY "anon_update_unsubscribe" ON unsubscribe_submissions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_unsubscribe" ON unsubscribe_submissions;
CREATE POLICY "anon_delete_unsubscribe" ON unsubscribe_submissions FOR DELETE
  TO anon, authenticated USING (true);

-- Blog likes
CREATE TABLE IF NOT EXISTS blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blog_post_id, email)
);

ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blog_likes" ON blog_likes;
CREATE POLICY "anon_select_blog_likes" ON blog_likes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_blog_likes" ON blog_likes;
CREATE POLICY "anon_insert_blog_likes" ON blog_likes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_blog_likes" ON blog_likes;
CREATE POLICY "anon_delete_blog_likes" ON blog_likes FOR DELETE
  TO anon, authenticated USING (true);
