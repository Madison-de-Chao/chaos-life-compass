# 獨立會員中心架構文件

> 版本：1.0 | 最後更新：2026-01-14

## 📋 目錄

1. [專案概述](#專案概述)
2. [系統架構](#系統架構)
3. [資料庫設計](#資料庫設計)
4. [API 端點設計](#api-端點設計)
5. [與主站整合方式](#與主站整合方式)
6. [SDK 設計](#sdk-設計)
7. [遷移計畫](#遷移計畫)

---

## 專案概述

### 為什麼需要獨立會員中心？

隨著生態系統的擴展，目前的會員相關功能散布在主站（DocShow）中，造成：
- 程式碼耦合度高，難以維護
- 外部專案（遊戲、卜卦系統）整合困難
- 擴展會員功能需要改動主站

### 獨立後的架構

```
┌─────────────────────────────────────────────────────────────┐
│                      會員中心 (Member Center)                 │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   認證系統   │   權限系統   │  訂閱管理   │  OAuth 授權  │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
│                              │                               │
│                         REST API                             │
└──────────────────────────────┼───────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   主站       │         │  遊戲站      │         │  卜卦系統    │
│  (DocShow)  │         │ (GamesHub)  │         │ (Divination) │
└─────────────┘         └─────────────┘         └─────────────┘
```

### 核心功能範圍

| 功能 | 說明 | 優先級 |
|-----|------|-------|
| 用戶認證 | Email/Password、Google OAuth | P0 |
| 個人資料 | Profile CRUD、頭像、出生資訊 | P0 |
| 權限管理 | 產品/方案權限、到期管理 | P0 |
| OAuth Provider | 讓外部專案使用會員中心登入 | P1 |
| 訂閱管理 | 訂閱狀態、付款記錄 | P1 |
| API Key 管理 | 外部專案 API 認證 | P1 |
| 管理後台 | 會員/權限/產品管理 | P2 |

---

## 系統架構

### 技術棧

| 層級 | 技術 | 說明 |
|-----|------|------|
| 前端 | React + TypeScript + Tailwind | 與現有主站一致 |
| 後端 | Supabase (Lovable Cloud) | Edge Functions + PostgreSQL |
| 認證 | Supabase Auth | Email + Google OAuth |
| API | REST | Edge Functions 提供 |

### 專案結構

```
member-center/
├── src/
│   ├── components/
│   │   ├── auth/               # 認證相關組件
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── GoogleLoginButton.tsx
│   │   │   └── PasswordResetForm.tsx
│   │   ├── profile/            # 個人資料組件
│   │   ├── admin/              # 管理後台組件
│   │   └── ui/                 # shadcn/ui 組件
│   ├── hooks/
│   │   ├── useAuth.tsx         # 認證 Hook
│   │   ├── useProfile.tsx      # 個人資料 Hook
│   │   ├── useEntitlements.tsx # 權限 Hook
│   │   └── useAdmin.tsx        # 管理員 Hook
│   ├── pages/
│   │   ├── auth/               # 認證頁面
│   │   ├── account/            # 會員中心頁面
│   │   ├── admin/              # 管理後台頁面
│   │   └── oauth/              # OAuth 授權頁面
│   └── lib/
│       └── api-client.ts       # API 客戶端
├── supabase/
│   └── functions/
│       ├── auth-callback/      # OAuth 回調
│       ├── check-entitlement/  # 權限驗證
│       ├── entitlements-me/    # 取得自己權限
│       ├── entitlements-lookup/# 查詢權限
│       ├── oauth-authorize/    # OAuth 授權
│       ├── oauth-token/        # OAuth Token 交換
│       └── user-info/          # 用戶資訊 API
└── docs/
    └── sdk/                    # SDK 原始碼與文檔
```

---

## 資料庫設計

### ER Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  auth.users  │     │   profiles   │     │  user_roles  │
│──────────────│     │──────────────│     │──────────────│
│ id (PK)      │◄───►│ user_id (FK) │     │ user_id (FK) │
│ email        │     │ display_name │     │ role         │
│ ...          │     │ avatar_url   │     └──────────────┘
└──────────────┘     │ birth_date   │
                     │ birth_time   │
                     │ birth_place  │
                     │ phone        │
                     │ gender       │
                     │ bio          │
                     └──────────────┘
                            │
                            ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   products   │◄────│ entitlements │     │    plans     │
│──────────────│     │──────────────│     │──────────────│
│ id (PK)      │     │ user_id (FK) │     │ id (PK)      │
│ name         │     │ product_id   │────►│ product_id   │
│ description  │     │ plan_id      │     │ name         │
│ purchase_type│     │ status       │     │ price        │
└──────────────┘     │ starts_at    │     │ duration_days│
                     │ ends_at      │     └──────────────┘
                     └──────────────┘

┌──────────────┐     ┌──────────────────────┐
│ oauth_clients│     │ oauth_access_tokens  │
│──────────────│     │──────────────────────│
│ client_id    │◄────│ client_id            │
│ secret_hash  │     │ user_id              │
│ redirect_uris│     │ token_hash           │
│ allowed_prods│     │ scope                │
└──────────────┘     │ expires_at           │
                     └──────────────────────┘

┌──────────────┐     ┌──────────────┐
│   api_keys   │     │ subscriptions│
│──────────────│     │──────────────│
│ key_hash     │     │ user_id      │
│ key_prefix   │     │ plan_name    │
│ permissions  │     │ status       │
│ usage_count  │     │ amount       │
└──────────────┘     │ expires_at   │
                     └──────────────┘
```

### 完整 Schema SQL

```sql
-- ============================================
-- 1. 用戶資料表
-- ============================================

-- 個人資料
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  full_name TEXT,
  nickname TEXT,
  avatar_url TEXT,
  phone TEXT,
  gender TEXT,
  bio TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  -- 訂閱狀態快照（方便查詢）
  subscription_status subscription_status DEFAULT 'free',
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 用戶角色
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'helper');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- ============================================
-- 2. 產品與權限系統
-- ============================================

-- 產品定義
CREATE TABLE public.products (
  id TEXT PRIMARY KEY, -- e.g., 'report_platform', 'story_builder_hub'
  name TEXT NOT NULL,
  description TEXT,
  purchase_type TEXT DEFAULT 'one_time', -- 'one_time', 'subscription'
  price DECIMAL(10,2),
  duration_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 方案定義
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'TWD',
  duration_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 權限狀態
CREATE TYPE public.entitlement_status AS ENUM ('active', 'expired', 'revoked');

-- 用戶權限
CREATE TABLE public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  plan_id UUID REFERENCES plans(id),
  status entitlement_status DEFAULT 'active',
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ,
  granted_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- 3. 訂閱管理
-- ============================================

CREATE TYPE public.subscription_status AS ENUM ('free', 'trial', 'active', 'cancelled', 'expired');

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status subscription_status DEFAULT 'free',
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'TWD',
  payment_method TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. OAuth 系統
-- ============================================

-- OAuth Clients（外部應用）
CREATE TABLE public.oauth_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT UNIQUE NOT NULL,
  client_secret_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  redirect_uris TEXT[] DEFAULT '{}',
  allowed_products TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Authorization Codes（授權碼）
CREATE TABLE public.oauth_authorization_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  client_id TEXT NOT NULL REFERENCES oauth_clients(client_id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  redirect_uri TEXT NOT NULL,
  scope TEXT,
  state TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Access Tokens
CREATE TABLE public.oauth_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT UNIQUE NOT NULL,
  client_id TEXT NOT NULL REFERENCES oauth_clients(client_id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scope TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. API Key 系統
-- ============================================

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  key_prefix TEXT NOT NULL, -- e.g., 'mk_abc'
  key_hash TEXT UNIQUE NOT NULL,
  permissions JSONB,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. 管理員日誌
-- ============================================

CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. RLS 政策
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Entitlements
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entitlements"
  ON public.entitlements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all entitlements"
  ON public.entitlements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Products (public read)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- API Keys (admin only)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage API keys"
  ON public.api_keys FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- OAuth Clients (admin only)
ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage OAuth clients"
  ON public.oauth_clients FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 8. 輔助函數
-- ============================================

-- 檢查用戶角色
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

-- 自動建立 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## API 端點設計

### 端點總覽

| 端點 | 方法 | 認證方式 | 說明 |
|-----|------|---------|------|
| `/auth/login` | POST | - | Email 登入 |
| `/auth/register` | POST | - | 註冊 |
| `/auth/google` | GET | - | Google OAuth 開始 |
| `/auth/callback` | GET | - | OAuth 回調 |
| `/auth/logout` | POST | JWT | 登出 |
| `/auth/reset-password` | POST | - | 重設密碼 |
| `/user/me` | GET | JWT | 取得當前用戶資訊 |
| `/user/profile` | GET/PUT | JWT | 個人資料 CRUD |
| `/entitlements/me` | GET | JWT | 取得自己的權限 |
| `/entitlements/check` | GET | API Key / JWT | 驗證權限 |
| `/entitlements/lookup` | GET | API Key | 查詢用戶權限 |
| `/oauth/authorize` | GET | JWT | OAuth 授權頁面 |
| `/oauth/token` | POST | Client Credentials | 換取 Access Token |
| `/oauth/userinfo` | GET | Bearer Token | 取得用戶資訊 |

### 詳細 API 規格

#### 1. 權限驗證 API（核心）

**`GET /functions/v1/check-entitlement`**

最重要的 API，供外部專案驗證用戶權限。

```typescript
// Request
GET /functions/v1/check-entitlement?product_id=report_platform&email=user@example.com
Headers:
  X-API-Key: mk_xxxxxxxxxxxxxxxx  // 方式一：API Key
  // 或
  Authorization: Bearer <jwt>      // 方式二：JWT Token

// Response (成功)
{
  "hasAccess": true,
  "email": "user@example.com",
  "product_id": "report_platform",
  "entitlement": {
    "id": "uuid",
    "status": "active",
    "starts_at": "2024-01-01T00:00:00Z",
    "ends_at": "2025-01-01T00:00:00Z",
    "plan_id": "uuid"
  }
}

// Response (無權限)
{
  "hasAccess": false,
  "email": "user@example.com",
  "product_id": "report_platform",
  "entitlement": null
}
```

#### 2. OAuth 授權流程

**Step 1: 授權請求**
```
GET /oauth/authorize
  ?client_id=external_app_123
  &redirect_uri=https://game.example.com/callback
  &scope=profile entitlements
  &state=random_state_string
  &response_type=code
```

**Step 2: 用戶授權後回調**
```
GET https://game.example.com/callback
  ?code=authorization_code_here
  &state=random_state_string
```

**Step 3: 換取 Token**
```typescript
// Request
POST /functions/v1/oauth-token
Content-Type: application/json
{
  "grant_type": "authorization_code",
  "code": "authorization_code_here",
  "client_id": "external_app_123",
  "client_secret": "client_secret_here",
  "redirect_uri": "https://game.example.com/callback"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "scope": "profile entitlements"
}
```

**Step 4: 取得用戶資訊**
```typescript
// Request
GET /functions/v1/oauth-userinfo
Authorization: Bearer <access_token>

// Response
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "name": "用戶名稱",
  "picture": "https://...",
  "entitlements": [
    {
      "product_id": "report_platform",
      "status": "active"
    }
  ]
}
```

---

## 與主站整合方式

### 整合模式選擇

| 模式 | 適用場景 | 複雜度 |
|-----|---------|-------|
| **API Key 模式** | 後端對後端驗證 | 低 |
| **JWT 透傳模式** | 前端直接呼叫 | 中 |
| **OAuth 模式** | 完整 SSO 體驗 | 高 |

### 主站改造方案

#### 1. 移除本地認證，改用會員中心

```typescript
// 舊版：src/hooks/useMember.tsx（本地 Supabase）
const { data } = await supabase.auth.signInWithPassword({ email, password });

// 新版：使用會員中心 API
const response = await fetch(`${MEMBER_CENTER_URL}/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
const { user, session } = await response.json();
```

#### 2. 權限驗證改為 API 呼叫

```typescript
// 舊版：直接查詢本地 entitlements 表
const { data } = await supabase
  .from('entitlements')
  .select('*')
  .eq('user_id', userId);

// 新版：呼叫會員中心 API
const response = await fetch(
  `${MEMBER_CENTER_URL}/functions/v1/check-entitlement?product_id=report_platform`,
  {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  }
);
const { hasAccess, entitlement } = await response.json();
```

#### 3. 主站保留的資料

主站仍需保留與內容相關的用戶資料：

```sql
-- 主站資料庫（簡化）
CREATE TABLE public.member_documents (
  id UUID PRIMARY KEY,
  user_email TEXT NOT NULL,  -- 改用 email 關聯，不用 UUID
  document_id UUID REFERENCES documents(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  is_favorited BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0
);
```

### 整合流程圖

```
┌────────────────────────────────────────────────────────────────┐
│                         用戶訪問主站                            │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  檢查本地 Session │
                    └────────┬───────┘
                             │
              ┌──────────────┴──────────────┐
              │ 有效                         │ 無效/過期
              ▼                              ▼
    ┌─────────────────┐            ┌─────────────────┐
    │   正常使用主站    │            │ 跳轉會員中心登入  │
    └─────────────────┘            └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  會員中心登入頁   │
                                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  登入成功，回調   │
                                   │  主站帶 token    │
                                   └────────┬────────┘
                                            │
                                            ▼
                              ┌──────────────────────────┐
                              │  主站驗證 token，建立 session │
                              └──────────────────────────┘
```

---

## SDK 設計

### NPM 套件結構

```
@hongling/member-sdk/
├── src/
│   ├── index.ts           # 主入口
│   ├── client.ts          # API Client
│   ├── auth.ts            # 認證相關
│   ├── entitlements.ts    # 權限相關
│   ├── react/
│   │   ├── provider.tsx   # React Context Provider
│   │   ├── hooks.ts       # useAuth, useEntitlements
│   │   └── components.tsx # LoginButton, ProtectedRoute
│   └── types.ts           # TypeScript 類型
├── package.json
├── tsconfig.json
└── README.md
```

### 使用範例

```typescript
// 安裝
npm install @hongling/member-sdk

// 初始化
import { MemberClient } from '@hongling/member-sdk';

const client = new MemberClient({
  baseUrl: 'https://member.momo-chao.com',
  apiKey: 'mk_your_api_key', // 後端使用
});

// 前端 React 使用
import { MemberProvider, useAuth, useEntitlements } from '@hongling/member-sdk/react';

function App() {
  return (
    <MemberProvider 
      baseUrl="https://member.momo-chao.com"
      clientId="your_client_id"
    >
      <MyApp />
    </MemberProvider>
  );
}

function MyComponent() {
  const { user, login, logout } = useAuth();
  const { hasAccess, isLoading } = useEntitlements('report_platform');

  if (isLoading) return <Loading />;
  if (!hasAccess) return <UpgradePrompt />;
  
  return <PremiumContent />;
}
```

---

## 遷移計畫

### 階段一：建立獨立專案（1-2 週）

1. 建立新的 Lovable 專案
2. 設置資料庫 schema
3. 遷移核心 Edge Functions
4. 建立基本 UI（登入、註冊、個人資料）

### 階段二：API 開發（1-2 週）

1. 實作所有 API 端點
2. 建立 API 文檔
3. 開發 SDK 套件
4. 測試所有功能

### 階段三：資料遷移（1 週）

1. 匯出現有用戶資料
2. 匯入新系統
3. 驗證資料完整性
4. 設置資料同步機制（過渡期）

### 階段四：主站改造（1-2 週）

1. 移除本地認證程式碼
2. 整合會員中心 SDK
3. 更新權限驗證邏輯
4. 測試所有流程

### 階段五：上線與切換（1 週）

1. 部署會員中心
2. DNS 設置（member.momo-chao.com）
3. 主站切換到新系統
4. 監控與調整

---

## 附錄

### 環境變數

**會員中心：**
```env
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
RESEND_API_KEY=xxx
```

**主站（改造後）：**
```env
VITE_MEMBER_CENTER_URL=https://member.momo-chao.com
VITE_MEMBER_API_KEY=mk_xxx  # 後端使用
VITE_MEMBER_CLIENT_ID=docshow_client
```

### 安全考量

1. **API Key 只在後端使用**：前端使用 OAuth 或 JWT
2. **CORS 設置**：限制允許的來源
3. **Rate Limiting**：防止濫用
4. **Token 過期**：Access Token 1 小時，Refresh Token 7 天
5. **敏感資料加密**：密碼使用 bcrypt，API Key 使用 SHA-256

---

*文件完成 - 準備開始實作*
