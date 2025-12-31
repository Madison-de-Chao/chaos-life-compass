-- Add explicit SELECT policy for helpers to view customers
-- This provides defense-in-depth and clarity for role-based access

CREATE POLICY "Helpers can view customers"
ON public.customers
FOR SELECT
USING (has_role((SELECT auth.uid()), 'helper'::app_role));