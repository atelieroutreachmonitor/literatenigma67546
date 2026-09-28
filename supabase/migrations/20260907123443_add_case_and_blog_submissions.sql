-- Case submissions table (public "Submit a Case" form)
CREATE TABLE IF NOT EXISTS case_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  category text,
  title text NOT NULL,
  description text,
  image_url text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE case_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_case_submissions" ON case_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "select_case_submissions" ON case_submissions FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "update_case_submissions" ON case_submissions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_case_submissions" ON case_submissions FOR DELETE
  TO anon, authenticated USING (true);

-- Blog submissions table (public "Write for Us" form)
CREATE TABLE IF NOT EXISTS blog_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  article_name text NOT NULL,
  email text NOT NULL,
  summary text,
  content text,
  tags text,
  image_url text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_blog_submissions" ON blog_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "select_blog_submissions" ON blog_submissions FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "update_blog_submissions" ON blog_submissions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_blog_submissions" ON blog_submissions FOR DELETE
  TO anon, authenticated USING (true);
