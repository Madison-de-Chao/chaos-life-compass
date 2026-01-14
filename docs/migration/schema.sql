-- ============================================================
-- 會員中心資料庫 Schema
-- 用於建立獨立會員中心專案的資料庫結構
-- ============================================================

-- ============================================================
-- 1. ENUM 類型定義
-- ============================================================

-- 應用角色
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'helper');

-- 訂閱狀態
CREATE TYPE public.subscription_status AS ENUM ('free', 'trial', 'active', 'cancelled', 'expired');

-- 權限狀態
CREATE TYPE public.entitlement_status AS ENUM ('active', 'expired', 'revoked');

-- ============================================================
-- 2. 核心資料表
-- ============================================================

-- 用戶資料表
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    display_name TEXT,
    full_name TEXT,
    nickname TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    gender TEXT,
    birth_date DATE,
    birth_time TIME,
    birth_place TEXT,
    subscription_status subscription_status NOT NULL DEFAULT 'free',
    subscription_started_at TIMESTAMPTZ,
    subscription_expires_at TIMESTAMPTZ,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 用戶角色表
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 產品表
CREATE TABLE public.products (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    duration_days INTEGER,
    purchase_type TEXT NOT NULL DEFAULT 'one_time',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 方案表
CREATE TABLE public.plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    currency TEXT DEFAULT 'TWD',
    duration_days INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 權限表
CREATE TABLE public.entitlements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    status entitlement_status NOT NULL DEFAULT 'active',
    starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ends_at TIMESTAMPTZ,
    granted_by UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 訂閱記錄表
CREATE TABLE public.subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    plan_name TEXT NOT NULL,
    status subscription_status NOT NULL DEFAULT 'active',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    amount NUMERIC,
    currency TEXT DEFAULT 'TWD',
    payment_method TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. OAuth 相關資料表
-- ============================================================

-- OAuth 客戶端
CREATE TABLE public.oauth_clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id TEXT NOT NULL UNIQUE,
    client_secret_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    redirect_uris TEXT[] NOT NULL DEFAULT '{}',
    allowed_products TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- OAuth 授權碼
CREATE TABLE public.oauth_authorization_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    redirect_uri TEXT NOT NULL,
    scope TEXT,
    state TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- OAuth Access Token
CREATE TABLE public.oauth_access_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    token_hash TEXT NOT NULL,
    client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    scope TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. API Key 管理
-- ============================================================

CREATE TABLE public.api_keys (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    permissions JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. 速率限制表
-- ============================================================

CREATE TABLE public.rate_limits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. 管理日誌表
-- ============================================================

CREATE TABLE public.admin_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. 資料庫函數
-- ============================================================

-- 角色檢查函數
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- 是否為管理員或小幫手
CREATE OR REPLACE FUNCTION public.is_admin_or_helper(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'helper')
    )
$$;

-- API Key 雜湊函數
CREATE OR REPLACE FUNCTION public.hash_api_key(key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN encode(digest(key, 'sha256'), 'hex');
END;
$$;

-- 驗證 API Key
CREATE OR REPLACE FUNCTION public.verify_api_key(key TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    key_id UUID;
BEGIN
    SELECT id INTO key_id
    FROM public.api_keys
    WHERE key_hash = public.hash_api_key(key)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now());
    
    IF key_id IS NOT NULL THEN
        UPDATE public.api_keys
        SET last_used_at = now(), usage_count = usage_count + 1
        WHERE id = key_id;
    END IF;
    
    RETURN key_id;
END;
$$;

-- OAuth Secret 雜湊函數
CREATE OR REPLACE FUNCTION public.hash_oauth_secret(secret TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN encode(digest(secret, 'sha256'), 'hex');
END;
$$;

-- 驗證 OAuth Secret
CREATE OR REPLACE FUNCTION public.verify_oauth_secret(client_id_param TEXT, secret TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.oauth_clients
        WHERE client_id = client_id_param
          AND client_secret_hash = public.hash_oauth_secret(secret)
          AND is_active = true
    );
END;
$$;

-- 速率限制檢查函數
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_endpoint TEXT,
    p_identifier TEXT,
    p_max_requests INTEGER DEFAULT 60,
    p_window_seconds INTEGER DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count INTEGER;
    window_start_time TIMESTAMPTZ;
    result JSONB;
BEGIN
    window_start_time := now() - (p_window_seconds || ' seconds')::INTERVAL;
    
    -- 清理過期記錄
    DELETE FROM public.rate_limits
    WHERE endpoint = p_endpoint
      AND identifier = p_identifier
      AND window_start < window_start_time;
    
    -- 獲取當前計數
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM public.rate_limits
    WHERE endpoint = p_endpoint
      AND identifier = p_identifier
      AND window_start >= window_start_time;
    
    IF current_count >= p_max_requests THEN
        result := jsonb_build_object(
            'allowed', false,
            'current', current_count,
            'limit', p_max_requests,
            'remaining', 0
        );
    ELSE
        -- 插入或更新計數
        INSERT INTO public.rate_limits (endpoint, identifier, request_count, window_start)
        VALUES (p_endpoint, p_identifier, 1, now())
        ON CONFLICT DO NOTHING;
        
        result := jsonb_build_object(
            'allowed', true,
            'current', current_count + 1,
            'limit', p_max_requests,
            'remaining', p_max_requests - current_count - 1
        );
    END IF;
    
    RETURN result;
END;
$$;

-- ============================================================
-- 8. 自動更新時間戳觸發器
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entitlements_updated_at
    BEFORE UPDATE ON public.entitlements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oauth_clients_updated_at
    BEFORE UPDATE ON public.oauth_clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 9. 新用戶自動建立 Profile 觸發器
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 建立 profile
    INSERT INTO public.profiles (user_id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- 建立預設 user 角色
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 10. Row Level Security
-- ============================================================

-- 啟用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Profiles 政策
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- User Roles 政策
CREATE POLICY "Users can view own roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Products 政策（公開讀取）
CREATE POLICY "Anyone can view products"
    ON public.products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Plans 政策（公開讀取）
CREATE POLICY "Anyone can view plans"
    ON public.plans FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin can manage plans"
    ON public.plans FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Entitlements 政策
CREATE POLICY "Users can view own entitlements"
    ON public.entitlements FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage entitlements"
    ON public.entitlements FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions 政策
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage subscriptions"
    ON public.subscriptions FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- OAuth Clients 政策
CREATE POLICY "Admin can manage oauth clients"
    ON public.oauth_clients FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- OAuth Authorization Codes 政策
CREATE POLICY "Users can view own auth codes"
    ON public.oauth_authorization_codes FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own auth codes"
    ON public.oauth_authorization_codes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- OAuth Access Tokens 政策
CREATE POLICY "Users can view own tokens"
    ON public.oauth_access_tokens FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tokens"
    ON public.oauth_access_tokens FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- API Keys 政策
CREATE POLICY "Admin can manage api keys"
    ON public.api_keys FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Admin Logs 政策
CREATE POLICY "Admin can view logs"
    ON public.admin_logs FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin and helper can insert logs"
    ON public.admin_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_helper(auth.uid()));

-- Rate Limits 政策（透過 SECURITY DEFINER 函數操作）
CREATE POLICY "Service role only"
    ON public.rate_limits FOR ALL
    USING (false);

-- ============================================================
-- 11. 初始資料
-- ============================================================

-- 預設產品
INSERT INTO public.products (id, name, description, purchase_type) VALUES
    ('report_platform', '命理報告平台', '完整命理解讀報告服務', 'one_time'),
    ('story_builder_hub', '命理遊戲中心', '互動式命理遊戲與工具', 'subscription'),
    ('seek_monster', '尋妖記', '尋找內在能量的探索工具', 'one_time'),
    ('yuanyi_divination', '元壹卜卦系統', '即時卜卦與解讀服務', 'subscription');
