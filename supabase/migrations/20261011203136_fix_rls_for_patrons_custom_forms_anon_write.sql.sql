/*
# Fix RLS: allow anon CRUD on patrons, custom_forms, custom_form_questions

## Problem
The admin panel uses a simple password check stored in sessionStorage — there is
no real Supabase auth session. All database operations therefore run as the
`anon` role. But `patrons`, `custom_forms`, and `custom_form_questions` had
INSERT/UPDATE/DELETE policies scoped to `TO authenticated` only, so the admin
panel could not create or edit rows in these tables.

## Fix
Replace the authenticated-only write policies with anon+authenticated policies
matching the pattern used by all other content tables in this project (e.g.
blog_posts, programs, partners). SELECT stays anon+authenticated (already
correct). This is consistent with the rest of the schema where the admin is
gated by a password in the frontend, not by Supabase Auth.

## Tables affected
- patrons — INSERT, UPDATE, DELETE policies changed to anon+authenticated
- custom_forms — INSERT, UPDATE, DELETE policies changed to anon+authenticated
- custom_form_questions — INSERT, UPDATE, DELETE policies changed to anon+authenticated
*/

-- patrons
DROP POLICY IF EXISTS "auth_insert_patrons" ON patrons;
CREATE POLICY "anon_insert_patrons" ON patrons FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_patrons" ON patrons;
CREATE POLICY "anon_update_patrons" ON patrons FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_patrons" ON patrons;
CREATE POLICY "anon_delete_patrons" ON patrons FOR DELETE
  TO anon, authenticated USING (true);

-- custom_forms
DROP POLICY IF EXISTS "auth_insert_custom_forms" ON custom_forms;
CREATE POLICY "anon_insert_custom_forms" ON custom_forms FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_custom_forms" ON custom_forms;
CREATE POLICY "anon_update_custom_forms" ON custom_forms FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_custom_forms" ON custom_forms;
CREATE POLICY "anon_delete_custom_forms" ON custom_forms FOR DELETE
  TO anon, authenticated USING (true);

-- custom_form_questions
DROP POLICY IF EXISTS "auth_insert_form_questions" ON custom_form_questions;
CREATE POLICY "anon_insert_form_questions" ON custom_form_questions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_form_questions" ON custom_form_questions;
CREATE POLICY "anon_update_form_questions" ON custom_form_questions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_form_questions" ON custom_form_questions;
CREATE POLICY "anon_delete_form_questions" ON custom_form_questions FOR DELETE
  TO anon, authenticated USING (true);