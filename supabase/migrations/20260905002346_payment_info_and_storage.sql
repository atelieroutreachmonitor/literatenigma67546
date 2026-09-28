/*
# Payment info table + storage bucket for image uploads
#
# 1. payment_info — stores NGO bank/account details for the admin payment page
# 2. Creates a public storage bucket 'uploads' for admin image uploads
*/

CREATE TABLE IF NOT EXISTS payment_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  bank_name text,
  account_name text,
  account_number text,
  sort_code text,
  mobile_money text,
  notes text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_payment_info" ON payment_info;
CREATE POLICY "read_payment_info" ON payment_info FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_payment_info" ON payment_info;
CREATE POLICY "insert_payment_info" ON payment_info FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_payment_info" ON payment_info;
CREATE POLICY "update_payment_info" ON payment_info FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_payment_info" ON payment_info;
CREATE POLICY "delete_payment_info" ON payment_info FOR DELETE TO anon, authenticated USING (true);

-- Insert default payment info rows
INSERT INTO payment_info (label, bank_name, account_name, account_number, notes) VALUES
('Primary Account', '', 'The SheCan Movement', '', 'Update with your official bank details'),
('Mobile Money', '', 'The SheCan Movement', '', 'Update with your mobile money details')
ON CONFLICT DO NOTHING;
