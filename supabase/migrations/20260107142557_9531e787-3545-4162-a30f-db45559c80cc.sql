-- Create a secure function to get public document by share_link without exposing password_hash
CREATE OR REPLACE FUNCTION public.get_public_document(doc_share_link TEXT)
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  original_name TEXT,
  file_path TEXT,
  file_size BIGINT,
  content JSONB,
  share_link TEXT,
  is_public BOOLEAN,
  view_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  customer_id UUID,
  expires_at TIMESTAMPTZ,
  tts_audio_urls JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.file_name,
    d.original_name,
    d.file_path,
    d.file_size,
    d.content,
    d.share_link,
    d.is_public,
    d.view_count,
    d.created_at,
    d.updated_at,
    d.customer_id,
    d.expires_at,
    d.tts_audio_urls
  FROM public.documents d
  WHERE d.share_link = doc_share_link
    AND d.is_public = true;
END;
$$;

-- Drop the permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view public documents by share_link" ON public.documents;