-- Create api_keys table for external API access
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB DEFAULT '{"products": ["*"]}'::jsonb,
  usage_count INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can manage API keys
CREATE POLICY "Admins can manage API keys"
ON public.api_keys
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to hash API key
CREATE OR REPLACE FUNCTION public.hash_api_key(key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'extensions', 'public'
AS $$
BEGIN
  RETURN extensions.crypt(key, extensions.gen_salt('bf'));
END;
$$;

-- Create function to verify API key
CREATE OR REPLACE FUNCTION public.verify_api_key(key TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'extensions', 'public'
AS $$
DECLARE
  api_key_id UUID;
BEGIN
  SELECT id INTO api_key_id
  FROM public.api_keys
  WHERE key_hash = extensions.crypt(key, key_hash)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
  
  IF api_key_id IS NOT NULL THEN
    UPDATE public.api_keys
    SET last_used_at = now(), usage_count = usage_count + 1
    WHERE id = api_key_id;
  END IF;
  
  RETURN api_key_id;
END;
$$;

-- Create index for faster lookups
CREATE INDEX idx_api_keys_prefix ON public.api_keys(key_prefix);
CREATE INDEX idx_api_keys_active ON public.api_keys(is_active) WHERE is_active = true;