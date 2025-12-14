-- Add expires_at column to documents table for link expiration
ALTER TABLE public.documents 
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for efficient expiration queries
CREATE INDEX idx_documents_expires_at ON public.documents(expires_at) WHERE expires_at IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.documents.expires_at IS 'Timestamp when the share link expires. NULL means no expiration.';