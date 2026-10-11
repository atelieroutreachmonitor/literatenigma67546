-- 1. Patrons & Trustees
CREATE TABLE IF NOT EXISTS patrons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  role text NOT NULL DEFAULT 'patron',
  bio text,
  portrait_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE patrons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_patrons" ON patrons;
CREATE POLICY "anon_select_patrons" ON patrons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_patrons" ON patrons;
CREATE POLICY "auth_insert_patrons" ON patrons FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_patrons" ON patrons;
CREATE POLICY "auth_update_patrons" ON patrons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_patrons" ON patrons;
CREATE POLICY "auth_delete_patrons" ON patrons FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS patron_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  role_interest text,
  occupation text,
  motivation text,
  experience text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE patron_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_patron_sub" ON patron_submissions;
CREATE POLICY "anon_insert_patron_sub" ON patron_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_patron_sub" ON patron_submissions;
CREATE POLICY "auth_read_patron_sub" ON patron_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_patron_sub" ON patron_submissions;
CREATE POLICY "auth_update_patron_sub" ON patron_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_patron_sub" ON patron_submissions;
CREATE POLICY "auth_delete_patron_sub" ON patron_submissions FOR DELETE TO authenticated USING (true);

-- 2. Custom Form Builder
CREATE TABLE IF NOT EXISTS custom_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  header_text text,
  slug text UNIQUE,
  published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE custom_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_custom_forms" ON custom_forms;
CREATE POLICY "anon_select_custom_forms" ON custom_forms FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_custom_forms" ON custom_forms;
CREATE POLICY "auth_insert_custom_forms" ON custom_forms FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_custom_forms" ON custom_forms;
CREATE POLICY "auth_update_custom_forms" ON custom_forms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_custom_forms" ON custom_forms;
CREATE POLICY "auth_delete_custom_forms" ON custom_forms FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS custom_form_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES custom_forms(id) ON DELETE CASCADE,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  required boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE custom_form_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_form_questions" ON custom_form_questions;
CREATE POLICY "anon_select_form_questions" ON custom_form_questions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_form_questions" ON custom_form_questions;
CREATE POLICY "auth_insert_form_questions" ON custom_form_questions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_form_questions" ON custom_form_questions;
CREATE POLICY "auth_update_form_questions" ON custom_form_questions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_form_questions" ON custom_form_questions;
CREATE POLICY "auth_delete_form_questions" ON custom_form_questions FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS custom_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES custom_forms(id) ON DELETE CASCADE,
  form_title text,
  answers text,
  full_name text,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE custom_form_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_form_subs" ON custom_form_submissions;
CREATE POLICY "anon_insert_form_subs" ON custom_form_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_form_subs" ON custom_form_submissions;
CREATE POLICY "auth_read_form_subs" ON custom_form_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_form_subs" ON custom_form_submissions;
CREATE POLICY "auth_update_form_subs" ON custom_form_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_form_subs" ON custom_form_submissions;
CREATE POLICY "auth_delete_form_subs" ON custom_form_submissions FOR DELETE TO authenticated USING (true);

-- 4. Email Log
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text NOT NULL,
  body text,
  form_type text,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_read_email_log" ON email_log;
CREATE POLICY "auth_read_email_log" ON email_log FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_email_log" ON email_log;
CREATE POLICY "auth_update_email_log" ON email_log FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_email_log" ON email_log;
CREATE POLICY "auth_delete_email_log" ON email_log FOR DELETE TO authenticated USING (true);