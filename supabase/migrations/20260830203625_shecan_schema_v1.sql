/*
# The SheCan Movement — full site schema

Creates the complete data model for the NGO website: content tables
(programs, courses, cases, blog_posts, raffles, merch, community_posts,
partners) and submission tables (newsletter, join-movement, volunteer,
partner, contact, donate, course applications, raffle entries, merch orders).

## Design notes

- Single public-facing site with a SEPARATE admin area. The admin area is
  gated by Supabase email/password auth, so:
    * Content tables (public content) are readable by `anon, authenticated`
      and writable ONLY by `authenticated` (the admin).
    * Submission tables (forms filled by visitors) are INSERT-only for
      `anon, authenticated` (visitors can submit), and SELECT/UPDATE/DELETE
      only for `authenticated` (the admin reviews them).
- `image_url` columns hold Pexels/external image URLs (text).
- `published` boolean controls visibility on the public site.
- `sort_order` integer controls display order.
- Timestamps default to now().

## Tables created

Content (public-read, admin-write):
1.  programs — focus programs (Educate/Empower/Advocate pillars etc.)
2.  courses — educational courses offered
3.  cases — impact case studies / success stories
4.  blog_posts — blog articles
5.  raffles — fundraising raffle campaigns
6.  merch — merchandise products
7.  community_posts — announcements / events / community news
8.  partners — partner organizations

Submissions (visitor-insert, admin-manage):
9.  newsletter_subscribers — newsletter signups
10. join_submissions — "Join the Movement" form
11. volunteer_submissions — volunteer applications
12. partner_submissions — partner inquiry form
13. contact_submissions — contact form messages
14. donations — donation records
15. course_applications — applications to enroll in a course
16. raffle_entries — entries into a raffle
17. merch_orders — merchandise orders

## Security

- RLS enabled on every table.
- Content tables: SELECT to anon+authenticated; INSERT/UPDATE/DELETE to
  authenticated only (admin manages content).
- Submission tables: INSERT to anon+authenticated (visitors submit);
  SELECT/UPDATE/DELETE to authenticated only (admin reviews). Visitors
  cannot read other people's submissions.
*/

-- ======================= CONTENT TABLES =======================

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  pillar text,
  summary text,
  description text,
  image_url text,
  icon text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_programs" ON programs;
CREATE POLICY "read_programs" ON programs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_programs" ON programs;
CREATE POLICY "insert_programs" ON programs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_programs" ON programs;
CREATE POLICY "update_programs" ON programs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_programs" ON programs;
CREATE POLICY "delete_programs" ON programs FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  instructor text,
  summary text,
  description text,
  image_url text,
  duration text,
  level text,
  enrolled int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_courses" ON courses;
CREATE POLICY "read_courses" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_courses" ON courses;
CREATE POLICY "insert_courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_courses" ON courses;
CREATE POLICY "update_courses" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_courses" ON courses;
CREATE POLICY "delete_courses" ON courses FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  beneficiary text,
  location text,
  program text,
  summary text,
  story text,
  image_url text,
  impact text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_cases" ON cases;
CREATE POLICY "read_cases" ON cases FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_cases" ON cases;
CREATE POLICY "insert_cases" ON cases FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_cases" ON cases;
CREATE POLICY "update_cases" ON cases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_cases" ON cases;
CREATE POLICY "delete_cases" ON cases FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  author text,
  excerpt text,
  content text,
  image_url text,
  category text,
  tags text,
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_blog" ON blog_posts;
CREATE POLICY "read_blog" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_blog" ON blog_posts;
CREATE POLICY "insert_blog" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_blog" ON blog_posts;
CREATE POLICY "update_blog" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_blog" ON blog_posts;
CREATE POLICY "delete_blog" ON blog_posts FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS raffles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  prize text,
  ticket_price text,
  draw_date text,
  status text NOT NULL DEFAULT 'open',
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_raffles" ON raffles;
CREATE POLICY "read_raffles" ON raffles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_raffles" ON raffles;
CREATE POLICY "insert_raffles" ON raffles FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_raffles" ON raffles;
CREATE POLICY "update_raffles" ON raffles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_raffles" ON raffles;
CREATE POLICY "delete_raffles" ON raffles FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS merch (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  price text,
  category text,
  sizes text,
  colors text,
  in_stock boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE merch ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_merch" ON merch;
CREATE POLICY "read_merch" ON merch FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_merch" ON merch;
CREATE POLICY "insert_merch" ON merch FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_merch" ON merch;
CREATE POLICY "update_merch" ON merch FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_merch" ON merch;
CREATE POLICY "delete_merch" ON merch FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'announcement',
  description text,
  image_url text,
  event_date text,
  event_location text,
  link text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_community" ON community_posts;
CREATE POLICY "read_community" ON community_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_community" ON community_posts;
CREATE POLICY "insert_community" ON community_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_community" ON community_posts;
CREATE POLICY "update_community" ON community_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_community" ON community_posts;
CREATE POLICY "delete_community" ON community_posts FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo_url text,
  website text,
  category text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_partners" ON partners;
CREATE POLICY "read_partners" ON partners FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_partners" ON partners;
CREATE POLICY "insert_partners" ON partners FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_partners" ON partners;
CREATE POLICY "update_partners" ON partners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_partners" ON partners;
CREATE POLICY "delete_partners" ON partners FOR DELETE TO authenticated USING (true);

-- ======================= SUBMISSION TABLES =======================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "insert_newsletter" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_newsletter" ON newsletter_subscribers;
CREATE POLICY "read_newsletter" ON newsletter_subscribers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_newsletter" ON newsletter_subscribers;
CREATE POLICY "update_newsletter" ON newsletter_subscribers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "delete_newsletter" ON newsletter_subscribers FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS join_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  city text,
  interests text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE join_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_join" ON join_submissions;
CREATE POLICY "insert_join" ON join_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_join" ON join_submissions;
CREATE POLICY "read_join" ON join_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_join" ON join_submissions;
CREATE POLICY "update_join" ON join_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_join" ON join_submissions;
CREATE POLICY "delete_join" ON join_submissions FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS volunteer_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  city text,
  area_of_interest text,
  availability text,
  skills text,
  experience text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_volunteer" ON volunteer_submissions;
CREATE POLICY "insert_volunteer" ON volunteer_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_volunteer" ON volunteer_submissions;
CREATE POLICY "read_volunteer" ON volunteer_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_volunteer" ON volunteer_submissions;
CREATE POLICY "update_volunteer" ON volunteer_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_volunteer" ON volunteer_submissions;
CREATE POLICY "delete_volunteer" ON volunteer_submissions FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS partner_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  partnership_type text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_partner_sub" ON partner_submissions;
CREATE POLICY "insert_partner_sub" ON partner_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_partner_sub" ON partner_submissions;
CREATE POLICY "read_partner_sub" ON partner_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_partner_sub" ON partner_submissions;
CREATE POLICY "update_partner_sub" ON partner_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_partner_sub" ON partner_submissions;
CREATE POLICY "delete_partner_sub" ON partner_submissions FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_contact" ON contact_submissions;
CREATE POLICY "insert_contact" ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_contact" ON contact_submissions;
CREATE POLICY "read_contact" ON contact_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_contact" ON contact_submissions;
CREATE POLICY "update_contact" ON contact_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_contact" ON contact_submissions;
CREATE POLICY "delete_contact" ON contact_submissions FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  email text NOT NULL,
  amount text NOT NULL,
  frequency text,
  purpose text,
  message text,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_donations" ON donations;
CREATE POLICY "insert_donations" ON donations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_donations" ON donations;
CREATE POLICY "read_donations" ON donations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_donations" ON donations;
CREATE POLICY "update_donations" ON donations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_donations" ON donations;
CREATE POLICY "delete_donations" ON donations FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS course_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  course_title text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  motivation text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_course_app" ON course_applications;
CREATE POLICY "insert_course_app" ON course_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_course_app" ON course_applications;
CREATE POLICY "read_course_app" ON course_applications FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_course_app" ON course_applications;
CREATE POLICY "update_course_app" ON course_applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_course_app" ON course_applications;
CREATE POLICY "delete_course_app" ON course_applications FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS raffle_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id uuid REFERENCES raffles(id) ON DELETE SET NULL,
  raffle_title text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  ticket_count int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE raffle_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_raffle_entry" ON raffle_entries;
CREATE POLICY "insert_raffle_entry" ON raffle_entries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_raffle_entry" ON raffle_entries;
CREATE POLICY "read_raffle_entry" ON raffle_entries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_raffle_entry" ON raffle_entries;
CREATE POLICY "update_raffle_entry" ON raffle_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_raffle_entry" ON raffle_entries;
CREATE POLICY "delete_raffle_entry" ON raffle_entries FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS merch_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merch_id uuid REFERENCES merch(id) ON DELETE SET NULL,
  merch_name text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  size text,
  color text,
  quantity int NOT NULL DEFAULT 1,
  total text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merch_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_merch_order" ON merch_orders;
CREATE POLICY "insert_merch_order" ON merch_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "read_merch_order" ON merch_orders;
CREATE POLICY "read_merch_order" ON merch_orders FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_merch_order" ON merch_orders;
CREATE POLICY "update_merch_order" ON merch_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_merch_order" ON merch_orders;
CREATE POLICY "delete_merch_order" ON merch_orders FOR DELETE TO authenticated USING (true);
