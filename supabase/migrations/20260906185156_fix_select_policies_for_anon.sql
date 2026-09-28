/*
# Fix SELECT policies for submission tables
#
# The admin uses a password-only auth (no Supabase session), so the
# anon key client can't read tables whose SELECT policy is restricted
# to `authenticated`. This drops those policies and recreates them
# with `anon, authenticated` so the admin can see form submissions.
*/

-- join_submissions
DROP POLICY IF EXISTS "read_join" ON join_submissions;
CREATE POLICY "read_join" ON join_submissions FOR SELECT TO anon, authenticated USING (true);

-- volunteer_submissions
DROP POLICY IF EXISTS "read_volunteer" ON volunteer_submissions;
CREATE POLICY "read_volunteer" ON volunteer_submissions FOR SELECT TO anon, authenticated USING (true);

-- newsletter_subscribers
DROP POLICY IF EXISTS "read_newsletter" ON newsletter_subscribers;
CREATE POLICY "read_newsletter" ON newsletter_subscribers FOR SELECT TO anon, authenticated USING (true);

-- partner_submissions
DROP POLICY IF EXISTS "read_partner_sub" ON partner_submissions;
CREATE POLICY "read_partner_sub" ON partner_submissions FOR SELECT TO anon, authenticated USING (true);

-- contact_submissions
DROP POLICY IF EXISTS "read_contact" ON contact_submissions;
CREATE POLICY "read_contact" ON contact_submissions FOR SELECT TO anon, authenticated USING (true);

-- donations
DROP POLICY IF EXISTS "read_donations" ON donations;
CREATE POLICY "read_donations" ON donations FOR SELECT TO anon, authenticated USING (true);

-- course_applications
DROP POLICY IF EXISTS "read_course_app" ON course_applications;
CREATE POLICY "read_course_app" ON course_applications FOR SELECT TO anon, authenticated USING (true);

-- raffle_entries
DROP POLICY IF EXISTS "read_raffle_entry" ON raffle_entries;
CREATE POLICY "read_raffle_entry" ON raffle_entries FOR SELECT TO anon, authenticated USING (true);

-- merch_orders
DROP POLICY IF EXISTS "read_merch_order" ON merch_orders;
CREATE POLICY "read_merch_order" ON merch_orders FOR SELECT TO anon, authenticated USING (true);
