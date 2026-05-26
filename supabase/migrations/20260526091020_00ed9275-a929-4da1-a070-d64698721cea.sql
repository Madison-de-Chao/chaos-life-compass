-- Replace the broken WITH CHECK on profiles update policy with a correct one
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK (
  (SELECT auth.uid()) = user_id
  AND subscription_status IS NOT DISTINCT FROM (
    SELECT p.subscription_status FROM public.profiles p WHERE p.user_id = profiles.user_id
  )
  AND subscription_started_at IS NOT DISTINCT FROM (
    SELECT p.subscription_started_at FROM public.profiles p WHERE p.user_id = profiles.user_id
  )
  AND subscription_expires_at IS NOT DISTINCT FROM (
    SELECT p.subscription_expires_at FROM public.profiles p WHERE p.user_id = profiles.user_id
  )
  AND total_spent IS NOT DISTINCT FROM (
    SELECT p.total_spent FROM public.profiles p WHERE p.user_id = profiles.user_id
  )
);