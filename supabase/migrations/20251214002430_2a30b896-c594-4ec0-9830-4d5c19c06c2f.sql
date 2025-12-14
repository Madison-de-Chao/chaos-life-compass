-- Create documents table for file records
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT, -- Storage path for the original Word file
  file_size BIGINT DEFAULT 0, -- File size in bytes
  content JSONB, -- Parsed document content
  share_link TEXT UNIQUE NOT NULL,
  password TEXT, -- Custom password set by admin
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view documents by share_link (for public viewing)
CREATE POLICY "Anyone can view public documents by share_link"
ON public.documents
FOR SELECT
USING (is_public = true);

-- Policy: Authenticated admin can do everything
CREATE POLICY "Authenticated users can manage all documents"
ON public.documents
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(doc_share_link TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.documents
  SET view_count = view_count + 1
  WHERE share_link = doc_share_link;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create storage bucket for document files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documents', 'documents', false, 52428800);

-- Storage policies: Only authenticated users can upload
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Storage policies: Only authenticated users can view/download
CREATE POLICY "Authenticated users can view documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Storage policies: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents');