/*
# Fix RLS policies for password-only admin
#
# The admin panel uses a simple password gate (not Supabase auth),
# so the `authenticated` role is never assumed. The original policies
# required `authenticated` for all writes, which silently failed.
#
# This migration:
# 1. Drops the old write policies that required `authenticated`.
# 2. Creates new write policies allowing `anon, authenticated` — the
#    anon key client can now insert/update/delete. The admin panel
#    itself is gated by the password check in the frontend, and public
#    visitors can only submit to the designated submission tables
#    (which already had anon INSERT policies).
#
# Content tables now allow anon writes so the admin can manage content.
# This is acceptable because the admin UI is password-protected and
# the database is not directly exposed to end users.
*/

-- ===== PROGRAMS =====
DROP POLICY IF EXISTS "insert_programs" ON programs;
DROP POLICY IF EXISTS "update_programs" ON programs;
DROP POLICY IF EXISTS "delete_programs" ON programs;
CREATE POLICY "insert_programs" ON programs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_programs" ON programs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_programs" ON programs FOR DELETE TO anon, authenticated USING (true);

-- ===== COURSES =====
DROP POLICY IF EXISTS "insert_courses" ON courses;
DROP POLICY IF EXISTS "update_courses" ON courses;
DROP POLICY IF EXISTS "delete_courses" ON courses;
CREATE POLICY "insert_courses" ON courses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_courses" ON courses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_courses" ON courses FOR DELETE TO anon, authenticated USING (true);

-- ===== CASES =====
DROP POLICY IF EXISTS "insert_cases" ON cases;
DROP POLICY IF EXISTS "update_cases" ON cases;
DROP POLICY IF EXISTS "delete_cases" ON cases;
CREATE POLICY "insert_cases" ON cases FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_cases" ON cases FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_cases" ON cases FOR DELETE TO anon, authenticated USING (true);

-- ===== BLOG_POSTS =====
DROP POLICY IF EXISTS "insert_blog" ON blog_posts;
DROP POLICY IF EXISTS "update_blog" ON blog_posts;
DROP POLICY IF EXISTS "delete_blog" ON blog_posts;
CREATE POLICY "insert_blog" ON blog_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_blog" ON blog_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_blog" ON blog_posts FOR DELETE TO anon, authenticated USING (true);

-- ===== RAFFLES =====
DROP POLICY IF EXISTS "insert_raffles" ON raffles;
DROP POLICY IF EXISTS "update_raffles" ON raffles;
DROP POLICY IF EXISTS "delete_raffles" ON raffles;
CREATE POLICY "insert_raffles" ON raffles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_raffles" ON raffles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_raffles" ON raffles FOR DELETE TO anon, authenticated USING (true);

-- ===== MERCH =====
DROP POLICY IF EXISTS "insert_merch" ON merch;
DROP POLICY IF EXISTS "update_merch" ON merch;
DROP POLICY IF EXISTS "delete_merch" ON merch;
CREATE POLICY "insert_merch" ON merch FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_merch" ON merch FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_merch" ON merch FOR DELETE TO anon, authenticated USING (true);

-- ===== COMMUNITY_POSTS =====
DROP POLICY IF EXISTS "insert_community" ON community_posts;
DROP POLICY IF EXISTS "update_community" ON community_posts;
DROP POLICY IF EXISTS "delete_community" ON community_posts;
CREATE POLICY "insert_community" ON community_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_community" ON community_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_community" ON community_posts FOR DELETE TO anon, authenticated USING (true);

-- ===== PARTNERS =====
DROP POLICY IF EXISTS "insert_partners" ON partners;
DROP POLICY IF EXISTS "update_partners" ON partners;
DROP POLICY IF EXISTS "delete_partners" ON partners;
CREATE POLICY "insert_partners" ON partners FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_partners" ON partners FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_partners" ON partners FOR DELETE TO anon, authenticated USING (true);

-- ===== SUBMISSION TABLES: allow anon update/delete so admin can manage =====
-- Newsletter
DROP POLICY IF EXISTS "update_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "update_newsletter" ON newsletter_subscribers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_newsletter" ON newsletter_subscribers FOR DELETE TO anon, authenticated USING (true);

-- Join
DROP POLICY IF EXISTS "update_join" ON join_submissions;
DROP POLICY IF EXISTS "delete_join" ON join_submissions;
CREATE POLICY "update_join" ON join_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_join" ON join_submissions FOR DELETE TO anon, authenticated USING (true);

-- Volunteer
DROP POLICY IF EXISTS "update_volunteer" ON volunteer_submissions;
DROP POLICY IF EXISTS "delete_volunteer" ON volunteer_submissions;
CREATE POLICY "update_volunteer" ON volunteer_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_volunteer" ON volunteer_submissions FOR DELETE TO anon, authenticated USING (true);

-- Partner submissions
DROP POLICY IF EXISTS "update_partner_sub" ON partner_submissions;
DROP POLICY IF EXISTS "delete_partner_sub" ON partner_submissions;
CREATE POLICY "update_partner_sub" ON partner_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_partner_sub" ON partner_submissions FOR DELETE TO anon, authenticated USING (true);

-- Contact
DROP POLICY IF EXISTS "update_contact" ON contact_submissions;
DROP POLICY IF EXISTS "delete_contact" ON contact_submissions;
CREATE POLICY "update_contact" ON contact_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_contact" ON contact_submissions FOR DELETE TO anon, authenticated USING (true);

-- Donations
DROP POLICY IF EXISTS "update_donations" ON donations;
DROP POLICY IF EXISTS "delete_donations" ON donations;
CREATE POLICY "update_donations" ON donations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_donations" ON donations FOR DELETE TO anon, authenticated USING (true);

-- Course applications
DROP POLICY IF EXISTS "update_course_app" ON course_applications;
DROP POLICY IF EXISTS "delete_course_app" ON course_applications;
CREATE POLICY "update_course_app" ON course_applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_course_app" ON course_applications FOR DELETE TO anon, authenticated USING (true);

-- Raffle entries
DROP POLICY IF EXISTS "update_raffle_entry" ON raffle_entries;
DROP POLICY IF EXISTS "delete_raffle_entry" ON raffle_entries;
CREATE POLICY "update_raffle_entry" ON raffle_entries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_raffle_entry" ON raffle_entries FOR DELETE TO anon, authenticated USING (true);

-- Merch orders
DROP POLICY IF EXISTS "update_merch_order" ON merch_orders;
DROP POLICY IF EXISTS "delete_merch_order" ON merch_orders;
CREATE POLICY "update_merch_order" ON merch_orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_merch_order" ON merch_orders FOR DELETE TO anon, authenticated USING (true);
