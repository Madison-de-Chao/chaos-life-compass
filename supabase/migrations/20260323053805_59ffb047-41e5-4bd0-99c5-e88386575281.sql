
DROP POLICY "Admins can manage oauth clients" ON public.oauth_clients;

CREATE POLICY "Admins can manage oauth clients"
ON public.oauth_clients
FOR ALL
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
