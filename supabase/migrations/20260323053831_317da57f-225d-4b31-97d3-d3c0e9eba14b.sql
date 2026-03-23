
CREATE POLICY "Only admins can view rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role));
