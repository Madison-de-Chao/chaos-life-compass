-- ============================================
-- RLS Policy Performance Optimization
-- Replace direct function calls with scalar subqueries
-- ============================================

-- Create index for admin_logs performance (only user_id exists)
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON public.admin_logs(user_id);

-- ============================================
-- admin_logs policies
-- ============================================
DROP POLICY IF EXISTS "Admins and helpers can insert logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Admins can view all logs" ON public.admin_logs;

CREATE POLICY "Admins and helpers can insert logs"
ON public.admin_logs
FOR INSERT TO authenticated
WITH CHECK (
  has_role((SELECT auth.uid()), 'admin'::app_role) OR has_role((SELECT auth.uid()), 'helper'::app_role)
);

CREATE POLICY "Admins can view all logs"
ON public.admin_logs
FOR SELECT TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- profiles policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- user_roles policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- ============================================
-- documents policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents;

CREATE POLICY "Admins can manage all documents"
ON public.documents FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- subscriptions policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Members can view own subscriptions" ON public.subscriptions;

CREATE POLICY "Admins can manage all subscriptions"
ON public.subscriptions FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Members can view own subscriptions"
ON public.subscriptions FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- entitlements policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Users can view own entitlements" ON public.entitlements;

CREATE POLICY "Admins can manage all entitlements"
ON public.entitlements FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Users can view own entitlements"
ON public.entitlements FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- member_documents policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all member documents" ON public.member_documents;
DROP POLICY IF EXISTS "Members can update own document preferences" ON public.member_documents;
DROP POLICY IF EXISTS "Members can view own documents" ON public.member_documents;

CREATE POLICY "Admins can manage all member documents"
ON public.member_documents FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Members can update own document preferences"
ON public.member_documents FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Members can view own documents"
ON public.member_documents FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- member_interactions policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all interactions" ON public.member_interactions;
DROP POLICY IF EXISTS "Members can create own interactions" ON public.member_interactions;
DROP POLICY IF EXISTS "Members can view own interactions" ON public.member_interactions;

CREATE POLICY "Admins can manage all interactions"
ON public.member_interactions FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Members can create own interactions"
ON public.member_interactions FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Members can view own interactions"
ON public.member_interactions FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- pending_changes policies
-- ============================================
DROP POLICY IF EXISTS "Helpers can delete own draft changes" ON public.pending_changes;
DROP POLICY IF EXISTS "Helpers can insert own changes" ON public.pending_changes;
DROP POLICY IF EXISTS "Helpers can update own draft changes" ON public.pending_changes;
DROP POLICY IF EXISTS "Helpers can view own changes" ON public.pending_changes;

CREATE POLICY "Helpers can delete own draft changes"
ON public.pending_changes FOR DELETE TO authenticated
USING (
  ((submitted_by = (SELECT auth.uid())) AND (status = 'draft'::text)) 
  OR has_role((SELECT auth.uid()), 'admin'::app_role)
);

CREATE POLICY "Helpers can insert own changes"
ON public.pending_changes FOR INSERT TO authenticated
WITH CHECK (
  (submitted_by = (SELECT auth.uid())) 
  AND (has_role((SELECT auth.uid()), 'helper'::app_role) OR has_role((SELECT auth.uid()), 'admin'::app_role))
);

CREATE POLICY "Helpers can update own draft changes"
ON public.pending_changes FOR UPDATE TO authenticated
USING (
  ((submitted_by = (SELECT auth.uid())) AND (status = 'draft'::text)) 
  OR has_role((SELECT auth.uid()), 'admin'::app_role)
);

CREATE POLICY "Helpers can view own changes"
ON public.pending_changes FOR SELECT TO authenticated
USING (
  (submitted_by = (SELECT auth.uid())) 
  OR has_role((SELECT auth.uid()), 'admin'::app_role)
);

-- ============================================
-- customers policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;

CREATE POLICY "Admins can manage customers"
ON public.customers FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- customer_interactions policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage interactions" ON public.customer_interactions;
DROP POLICY IF EXISTS "Helpers can create interactions" ON public.customer_interactions;
DROP POLICY IF EXISTS "Helpers can view interactions" ON public.customer_interactions;

CREATE POLICY "Admins can manage interactions"
ON public.customer_interactions FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Helpers can create interactions"
ON public.customer_interactions FOR INSERT TO authenticated
WITH CHECK (has_role((SELECT auth.uid()), 'helper'::app_role));

CREATE POLICY "Helpers can view interactions"
ON public.customer_interactions FOR SELECT TO authenticated
USING (has_role((SELECT auth.uid()), 'helper'::app_role));

-- ============================================
-- customer_follow_ups policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage follow-ups" ON public.customer_follow_ups;
DROP POLICY IF EXISTS "Helpers can create follow-ups" ON public.customer_follow_ups;
DROP POLICY IF EXISTS "Helpers can update own follow-ups" ON public.customer_follow_ups;
DROP POLICY IF EXISTS "Helpers can view follow-ups" ON public.customer_follow_ups;

CREATE POLICY "Admins can manage follow-ups"
ON public.customer_follow_ups FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Helpers can create follow-ups"
ON public.customer_follow_ups FOR INSERT TO authenticated
WITH CHECK (has_role((SELECT auth.uid()), 'helper'::app_role));

CREATE POLICY "Helpers can update own follow-ups"
ON public.customer_follow_ups FOR UPDATE TO authenticated
USING (has_role((SELECT auth.uid()), 'helper'::app_role) AND (created_by = (SELECT auth.uid())));

CREATE POLICY "Helpers can view follow-ups"
ON public.customer_follow_ups FOR SELECT TO authenticated
USING (has_role((SELECT auth.uid()), 'helper'::app_role));

-- ============================================
-- customer_tags policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage tags" ON public.customer_tags;
DROP POLICY IF EXISTS "Helpers can view tags" ON public.customer_tags;

CREATE POLICY "Admins can manage tags"
ON public.customer_tags FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Helpers can view tags"
ON public.customer_tags FOR SELECT TO authenticated
USING (has_role((SELECT auth.uid()), 'helper'::app_role));

-- ============================================
-- customer_tag_assignments policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage tag assignments" ON public.customer_tag_assignments;
DROP POLICY IF EXISTS "Helpers can view tag assignments" ON public.customer_tag_assignments;

CREATE POLICY "Admins can manage tag assignments"
ON public.customer_tag_assignments FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Helpers can view tag assignments"
ON public.customer_tag_assignments FOR SELECT TO authenticated
USING (has_role((SELECT auth.uid()), 'helper'::app_role));

-- ============================================
-- feedbacks policies
-- ============================================
DROP POLICY IF EXISTS "Admins can delete feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Admins can update feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Admins can view all feedbacks" ON public.feedbacks;

CREATE POLICY "Admins can delete feedbacks"
ON public.feedbacks FOR DELETE TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can update feedbacks"
ON public.feedbacks FOR UPDATE TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can view all feedbacks"
ON public.feedbacks FOR SELECT TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- feedback_tracking policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage feedback tracking" ON public.feedback_tracking;

CREATE POLICY "Admins can manage feedback tracking"
ON public.feedback_tracking FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- notes policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all notes" ON public.notes;
DROP POLICY IF EXISTS "Members can view member notes" ON public.notes;
DROP POLICY IF EXISTS "Paid members can view paid notes" ON public.notes;

CREATE POLICY "Admins can manage all notes"
ON public.notes FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Members can view member notes"
ON public.notes FOR SELECT TO authenticated
USING (
  (is_published = true) 
  AND (visibility = ANY (ARRAY['public'::note_visibility, 'members'::note_visibility])) 
  AND is_member((SELECT auth.uid()))
);

CREATE POLICY "Paid members can view paid notes"
ON public.notes FOR SELECT TO authenticated
USING (
  (is_published = true) 
  AND (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = (SELECT auth.uid()) 
    AND profiles.subscription_status = ANY (ARRAY['active'::subscription_status, 'trial'::subscription_status])
  ))
);

-- ============================================
-- note_attachments policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all attachments" ON public.note_attachments;
DROP POLICY IF EXISTS "Anyone can view attachments of accessible notes" ON public.note_attachments;

CREATE POLICY "Admins can manage all attachments"
ON public.note_attachments FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Anyone can view attachments of accessible notes"
ON public.note_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM notes n
    WHERE n.id = note_attachments.note_id 
    AND n.is_published = true 
    AND (
      n.visibility = 'public'::note_visibility 
      OR (n.visibility = 'members'::note_visibility AND is_member((SELECT auth.uid()))) 
      OR (n.visibility = 'paid_members'::note_visibility AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = (SELECT auth.uid()) 
        AND profiles.subscription_status = ANY (ARRAY['active'::subscription_status, 'trial'::subscription_status])
      ))
    )
  )
);

-- ============================================
-- note_social_syncs policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage social syncs" ON public.note_social_syncs;

CREATE POLICY "Admins can manage social syncs"
ON public.note_social_syncs FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- api_keys policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage API keys" ON public.api_keys;

CREATE POLICY "Admins can manage API keys"
ON public.api_keys FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- ip_blacklist policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage IP blacklist" ON public.ip_blacklist;

CREATE POLICY "Admins can manage IP blacklist"
ON public.ip_blacklist FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- oauth_clients policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage oauth clients" ON public.oauth_clients;

CREATE POLICY "Admins can manage oauth clients"
ON public.oauth_clients FOR ALL TO authenticated
USING (is_admin_or_helper((SELECT auth.uid())));

-- ============================================
-- oauth_access_tokens policies
-- ============================================
DROP POLICY IF EXISTS "Users can revoke own access tokens" ON public.oauth_access_tokens;
DROP POLICY IF EXISTS "Users can view own access tokens" ON public.oauth_access_tokens;

CREATE POLICY "Users can revoke own access tokens"
ON public.oauth_access_tokens FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view own access tokens"
ON public.oauth_access_tokens FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- oauth_authorization_codes policies
-- ============================================
DROP POLICY IF EXISTS "Users can view own authorization codes" ON public.oauth_authorization_codes;

CREATE POLICY "Users can view own authorization codes"
ON public.oauth_authorization_codes FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- plans policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;

CREATE POLICY "Admins can manage plans"
ON public.plans FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ============================================
-- products policies
-- ============================================
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));