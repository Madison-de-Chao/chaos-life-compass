-- Verify RLS is enabled on customers table (it should already be, but ensuring)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (prevents bypassing RLS if you're the table owner)
ALTER TABLE public.customers FORCE ROW LEVEL SECURITY;

-- Add a comment documenting the security model
COMMENT ON TABLE public.customers IS 'Contains sensitive customer PII (names, emails, phone, birth dates). Access restricted to admin and helper roles only. Anonymous/public access is denied by RLS default deny behavior with FORCE enabled.';