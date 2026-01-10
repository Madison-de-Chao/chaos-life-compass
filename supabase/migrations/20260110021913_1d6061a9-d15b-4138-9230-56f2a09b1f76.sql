-- Force RLS on documents table to ensure it applies even to table owner
ALTER TABLE public.documents FORCE ROW LEVEL SECURITY;

-- Add security documentation comment
COMMENT ON TABLE public.documents IS 'Contains document content and password_hash for protected documents. password_hash is NEVER exposed to public - access is controlled via: (1) RLS allowing only admin access, (2) get_public_document RPC which explicitly excludes password_hash, (3) verify_document_password RPC for password validation. FORCE RLS ensures no bypass even for table owner.';