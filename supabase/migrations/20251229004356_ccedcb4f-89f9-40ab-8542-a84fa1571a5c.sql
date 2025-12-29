-- 為 oauth_authorization_codes 和 oauth_access_tokens 新增 RLS 政策
-- 這些表只能透過 service role 在 Edge Function 中操作，不開放一般用戶直接存取

-- 授權碼表：用戶可以看到自己的授權記錄
CREATE POLICY "Users can view own authorization codes" 
ON public.oauth_authorization_codes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Access Token 表：用戶可以看到和撤銷自己的 token
CREATE POLICY "Users can view own access tokens" 
ON public.oauth_access_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can revoke own access tokens" 
ON public.oauth_access_tokens 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);