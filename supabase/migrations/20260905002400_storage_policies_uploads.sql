/*
# Storage policies for the 'uploads' bucket — allow public read and anon/authenticated upload
*/

DROP POLICY IF EXISTS "public_read_uploads" ON storage.objects;
CREATE POLICY "public_read_uploads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "anon_upload_uploads" ON storage.objects;
CREATE POLICY "anon_upload_uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'uploads');

DROP POLICY IF EXISTS "anon_update_uploads" ON storage.objects;
CREATE POLICY "anon_update_uploads" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "anon_delete_uploads" ON storage.objects;
CREATE POLICY "anon_delete_uploads" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'uploads');
