-- Drop existing overly permissive storage policies for documents bucket
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- Create admin-only storage policies for documents bucket
CREATE POLICY "Admins can upload to documents bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  has_role((SELECT auth.uid()), 'admin'::app_role)
);

CREATE POLICY "Admins can view documents bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  has_role((SELECT auth.uid()), 'admin'::app_role)
);

CREATE POLICY "Admins can delete from documents bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  has_role((SELECT auth.uid()), 'admin'::app_role)
);