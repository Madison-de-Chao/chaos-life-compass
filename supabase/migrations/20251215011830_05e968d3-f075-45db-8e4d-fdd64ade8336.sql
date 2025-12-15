-- Create a public bucket for document images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('document-images', 'document-images', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to document images
CREATE POLICY "Public can read document images"
ON storage.objects FOR SELECT
USING (bucket_id = 'document-images');

-- Allow authenticated users to upload document images
CREATE POLICY "Authenticated users can upload document images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'document-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update document images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'document-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete document images"
ON storage.objects FOR DELETE
USING (bucket_id = 'document-images' AND auth.role() = 'authenticated');