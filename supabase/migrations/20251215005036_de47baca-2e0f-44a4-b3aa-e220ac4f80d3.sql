-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Recreate the hash_document_password function to use the extension properly
CREATE OR REPLACE FUNCTION public.hash_document_password(pwd text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'extensions', 'public'
AS $function$
BEGIN
  IF pwd IS NULL OR pwd = '' THEN
    RETURN NULL;
  END IF;
  RETURN extensions.crypt(pwd, extensions.gen_salt('bf'));
END;
$function$;

-- Recreate verify_document_password to use the extension properly
CREATE OR REPLACE FUNCTION public.verify_document_password(doc_share_link text, pwd text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'extensions', 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.documents 
    WHERE share_link = doc_share_link 
    AND password_hash = extensions.crypt(pwd, password_hash)
  );
END;
$function$;