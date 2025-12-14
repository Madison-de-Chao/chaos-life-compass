-- ===========================================
-- SECURITY FIX: Role-Based Access Control (RBAC)
-- ===========================================

-- 1. Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. RLS policy for user_roles table (only admins can manage roles)
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ===========================================
-- SECURITY FIX: Restrict Customer Data Access
-- ===========================================

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;

-- Only admins can manage customers
CREATE POLICY "Admins can manage customers"
ON public.customers FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===========================================
-- SECURITY FIX: Restrict Documents Management
-- ===========================================

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage all documents" ON public.documents;

-- Only admins can manage all documents
CREATE POLICY "Admins can manage all documents"
ON public.documents FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===========================================
-- SECURITY FIX: Restrict Feedbacks Management
-- ===========================================

-- Drop existing overly permissive policies for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view all feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated users can update feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated users can delete feedbacks" ON public.feedbacks;

-- Only admins can manage feedbacks
CREATE POLICY "Admins can view all feedbacks"
ON public.feedbacks FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feedbacks"
ON public.feedbacks FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feedbacks"
ON public.feedbacks FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ===========================================
-- SECURITY FIX: Hash Document Passwords
-- ===========================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add password_hash column
ALTER TABLE public.documents ADD COLUMN password_hash TEXT;

-- Migrate existing plaintext passwords to hashed passwords
UPDATE public.documents 
SET password_hash = crypt(password, gen_salt('bf'))
WHERE password IS NOT NULL AND password != '';

-- Create secure password verification function
CREATE OR REPLACE FUNCTION public.verify_document_password(doc_share_link TEXT, pwd TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.documents 
    WHERE share_link = doc_share_link 
    AND password_hash = crypt(pwd, password_hash)
  );
END;
$$;

-- Create function to hash password when setting it
CREATE OR REPLACE FUNCTION public.hash_document_password(pwd TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF pwd IS NULL OR pwd = '' THEN
    RETURN NULL;
  END IF;
  RETURN crypt(pwd, gen_salt('bf'));
END;
$$;

-- Create function to check if document has password
CREATE OR REPLACE FUNCTION public.document_has_password(doc_share_link TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT password_hash IS NOT NULL 
  FROM public.documents 
  WHERE share_link = doc_share_link
$$;

-- Drop the plaintext password column
ALTER TABLE public.documents DROP COLUMN password;