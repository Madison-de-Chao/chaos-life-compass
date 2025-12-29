-- Create IP blacklist table
CREATE TABLE public.ip_blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL UNIQUE,
  reason text,
  blocked_by uuid REFERENCES auth.users(id),
  blocked_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ip_blacklist ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage IP blacklist"
ON public.ip_blacklist
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create function to check if IP is blacklisted
CREATE OR REPLACE FUNCTION public.is_ip_blacklisted(p_ip_address text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ip_blacklist
    WHERE ip_address = p_ip_address
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Create index for faster lookups
CREATE INDEX idx_ip_blacklist_ip ON public.ip_blacklist(ip_address) WHERE is_active = true;