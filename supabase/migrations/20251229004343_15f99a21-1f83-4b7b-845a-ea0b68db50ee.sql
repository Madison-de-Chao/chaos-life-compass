-- OAuth 客戶端表：存儲已註冊的外部應用程式
CREATE TABLE public.oauth_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL UNIQUE,
  client_secret_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  redirect_uris TEXT[] NOT NULL DEFAULT '{}',
  allowed_products TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- OAuth 授權碼表：臨時存儲授權碼
CREATE TABLE public.oauth_authorization_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  redirect_uri TEXT NOT NULL,
  scope TEXT,
  state TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- OAuth Access Token 表
CREATE TABLE public.oauth_access_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scope TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_access_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for oauth_clients (只有 admin 可以管理)
CREATE POLICY "Admins can manage oauth clients" 
ON public.oauth_clients 
FOR ALL 
USING (public.is_admin_or_helper(auth.uid()));

-- oauth_authorization_codes 和 oauth_access_tokens 只能透過 Edge Function 操作
-- 不開放直接存取

-- 索引優化
CREATE INDEX idx_oauth_clients_client_id ON public.oauth_clients(client_id);
CREATE INDEX idx_oauth_auth_codes_code ON public.oauth_authorization_codes(code);
CREATE INDEX idx_oauth_auth_codes_expires ON public.oauth_authorization_codes(expires_at);
CREATE INDEX idx_oauth_tokens_hash ON public.oauth_access_tokens(token_hash);
CREATE INDEX idx_oauth_tokens_user ON public.oauth_access_tokens(user_id);

-- 自動更新 updated_at
CREATE TRIGGER update_oauth_clients_updated_at
BEFORE UPDATE ON public.oauth_clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 生成 OAuth client secret hash 函數
CREATE OR REPLACE FUNCTION public.hash_oauth_secret(secret text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'extensions', 'public'
AS $$
BEGIN
  RETURN extensions.crypt(secret, extensions.gen_salt('bf'));
END;
$$;

-- 驗證 OAuth client secret 函數
CREATE OR REPLACE FUNCTION public.verify_oauth_secret(client_id_param text, secret text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'extensions', 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.oauth_clients
    WHERE client_id = client_id_param
    AND client_secret_hash = extensions.crypt(secret, client_secret_hash)
    AND is_active = true
  );
END;
$$;