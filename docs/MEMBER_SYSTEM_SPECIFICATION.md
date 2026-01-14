# 會員系統完整功能規格書

> 用於對照新專案（獨立會員中心）與現行主專案的會員系統是否一致

---

## 📁 目錄

1. [系統架構總覽](#1-系統架構總覽)
2. [前端模組結構](#2-前端模組結構)
3. [後端 Edge Functions](#3-後端-edge-functions)
4. [資料庫表格結構](#4-資料庫表格結構)
5. [認證功能清單](#5-認證功能清單)
6. [頁面功能清單](#6-頁面功能清單)
7. [權限系統功能](#7-權限系統功能)
8. [OAuth 授權功能](#8-oauth-授權功能)
9. [UI 元件清單](#9-ui-元件清單)
10. [樣式主題配置](#10-樣式主題配置)
11. [路由對照表](#11-路由對照表)
12. [API 端點清單](#12-api-端點清單)
13. [驗證規則](#13-驗證規則)
14. [核對清單](#14-核對清單)

---

## 1. 系統架構總覽

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (React + Vite)                       │
├─────────────────────────────────────────────────────────────────┤
│  src/modules/member/                                             │
│  ├── context/MemberContext.tsx    ← 認證狀態管理                  │
│  ├── hooks/useEntitlements.ts     ← 權限查詢 Hooks                │
│  ├── utils/validation.ts          ← Zod 表單驗證                  │
│  ├── types/index.ts               ← 型別定義                      │
│  ├── components/                  ← 可共享 UI 元件                │
│  └── pages/                       ← 會員頁面                      │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   後端 (Supabase + Edge Functions)                │
├─────────────────────────────────────────────────────────────────┤
│  supabase/functions/                                             │
│  ├── check-entitlement/     ← 權限驗證（API Key + JWT 雙模式）     │
│  ├── entitlements-me/       ← 取得當前用戶權限（JWT）              │
│  ├── entitlements-lookup/   ← 透過 Email 查詢權限（API Key）      │
│  └── oauth-authorize/       ← OAuth 2.0 授權流程                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        資料庫 (PostgreSQL)                        │
├─────────────────────────────────────────────────────────────────┤
│  profiles          ← 用戶資料                                     │
│  user_roles        ← 角色分配 (admin/user/helper)                 │
│  products          ← 產品定義                                     │
│  plans             ← 方案定義                                     │
│  entitlements      ← 權限記錄                                     │
│  subscriptions     ← 訂閱記錄                                     │
│  oauth_clients     ← OAuth 客戶端                                 │
│  oauth_access_tokens      ← 存取令牌                              │
│  oauth_authorization_codes ← 授權碼                               │
│  api_keys          ← API 金鑰                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 前端模組結構

### 2.1 目錄結構

```
src/modules/member/
├── index.ts                        # 主要匯出入口
├── README.md                       # 模組文件
├── types/
│   └── index.ts                    # 所有型別定義
├── context/
│   └── MemberContext.tsx           # 認證 Context 和 Provider
├── hooks/
│   └── useEntitlements.ts          # 權限相關 Hooks
├── utils/
│   └── validation.ts               # Zod 表單驗證邏輯
├── components/
│   ├── MemberProtectedRoute.tsx    # 路由保護元件
│   ├── MemberCardSkeleton.tsx      # 載入骨架元件
│   ├── MemberLoginWidget.tsx       # 登入小工具元件
│   ├── MemberAuthHeader.tsx        # 可換膚認證表頭 ⭐
│   ├── MemberAuthHeader.stories.md # 元件文件
│   └── OAuthAuthorizePage.tsx      # OAuth 授權頁面
└── pages/
    ├── index.ts                    # 頁面匯出
    ├── UnifiedAuthPage.tsx         # 統一登入/註冊頁 ⭐
    ├── UnifiedDashboard.tsx        # 會員中心主頁 ⭐
    └── UnifiedProfilePage.tsx      # 個人資料編輯頁
```

### 2.2 匯出項目

從 `@/modules/member` 匯出：

```typescript
// Context & Provider
MemberProvider, useMember, MemberContext

// Hooks
useProducts, usePlans, useMyEntitlements, useAllEntitlements
useCreateEntitlement, useUpdateEntitlement, useDeleteEntitlement
useSearchUsers, useProductAccess, useActiveProductIds

// Components
MemberProtectedRoute, MemberCardSkeleton, MemberListSkeleton
StatsCardSkeleton, MemberLoginWidget, MemberAuthHeader
OAuthAuthorizePage

// Pages
UnifiedAuthPage, UnifiedDashboard, UnifiedProfilePage

// Utils
emailSchema, passwordSchema, displayNameSchema
loginFormSchema, signupFormSchema, resetPasswordSchema
validateLoginForm, validateSignupForm, validateEmail, validatePassword

// Types
Profile, Product, Plan, Entitlement, EntitlementWithDetails
MemberContextType, AppRole, UserRole, OAuthClient, OAuthAccessToken
OAuthAuthorizationCode, OAuthAuthorizationRequest, ApiKey
CheckAccessResult, UserLookupResult, UserEntitlements
PRODUCT_IDS, ProductId, SubscriptionStatus, EntitlementStatus
```

---

## 3. 後端 Edge Functions

### 3.1 check-entitlement

| 項目 | 說明 |
|-----|------|
| **路徑** | `/functions/v1/check-entitlement` |
| **方法** | GET |
| **JWT 驗證** | 否 (verify_jwt = false) |
| **認證方式** | API Key (`X-API-Key`) 或 JWT (`Authorization: Bearer`) |
| **參數** | `product_id` (必填), `email` (API Key 模式必填) |
| **回傳** | `{ hasAccess, found, userId, email, entitlement }` |

### 3.2 entitlements-me

| 項目 | 說明 |
|-----|------|
| **路徑** | `/functions/v1/entitlements-me` |
| **方法** | GET |
| **JWT 驗證** | 是 (verify_jwt = true) |
| **認證方式** | JWT (`Authorization: Bearer`) |
| **參數** | `product_id` (選填，過濾用) |
| **回傳** | `{ userId, email, entitlements[] }` |

### 3.3 entitlements-lookup

| 項目 | 說明 |
|-----|------|
| **路徑** | `/functions/v1/entitlements-lookup` |
| **方法** | GET |
| **JWT 驗證** | 否 (verify_jwt = false) |
| **認證方式** | API Key (`X-API-Key`) 或 Service Role Key |
| **參數** | `email` (必填), `product_id` (選填) |
| **回傳** | `{ found, user, profile, entitlements[] }` |

### 3.4 oauth-authorize

| 項目 | 說明 |
|-----|------|
| **路徑** | `/functions/v1/oauth-authorize` |
| **方法** | GET, POST |
| **JWT 驗證** | 否 (verify_jwt = false) |
| **功能** | 處理 OAuth 2.0 授權碼流程 |
| **端點** | `/token` (換取令牌), `/userinfo` (取得用戶資訊) |

---

## 4. 資料庫表格結構

### 4.1 profiles

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  nickname TEXT,
  display_name TEXT,
  phone TEXT,
  birth_date TEXT,
  birth_time TEXT,
  birth_place TEXT,
  gender TEXT,
  avatar_url TEXT,
  bio TEXT,
  subscription_status subscription_status DEFAULT 'free',
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  total_spent NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 user_roles

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,  -- 'admin' | 'user' | 'helper'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.3 products

```sql
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  purchase_type TEXT DEFAULT 'subscription',
  price NUMERIC,
  duration_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**預設產品：**
- `report_platform` - 虹靈御所命理報告
- `story_builder_hub` - 四時八字人生兵法
- `seek_monster` - 尋妖記
- `yuanyi_divination` - 元壹卜卦系統

### 4.4 plans

```sql
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  currency TEXT DEFAULT 'TWD',
  duration_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.5 entitlements

```sql
CREATE TABLE public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id TEXT REFERENCES products(id),
  plan_id UUID REFERENCES plans(id),
  status entitlement_status DEFAULT 'active',  -- 'active' | 'expired' | 'revoked'
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ,
  granted_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);
```

### 4.6 subscriptions

```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  status subscription_status DEFAULT 'free',
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  amount NUMERIC,
  currency TEXT,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.7 oauth_clients

```sql
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
```

### 4.8 api_keys

```sql
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.9 Enums

```sql
CREATE TYPE subscription_status AS ENUM ('free', 'trial', 'active', 'cancelled', 'expired');
CREATE TYPE entitlement_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE app_role AS ENUM ('admin', 'user', 'helper');
```

---

## 5. 認證功能清單

### 5.1 MemberContext 提供的方法

| 方法 | 參數 | 說明 |
|-----|------|------|
| `signIn` | `(email, password)` | Email 密碼登入 |
| `signUp` | `(email, password, displayName?)` | 註冊新帳號 |
| `signInWithGoogle` | - | Google OAuth 登入 |
| `resetPassword` | `(email)` | 發送密碼重設郵件 |
| `signOut` | - | 登出 |
| `updateProfile` | `(updates)` | 更新個人資料 |
| `refreshProfile` | - | 重新載入資料與角色 |

### 5.2 MemberContext 提供的狀態

| 狀態 | 類型 | 說明 |
|-----|------|------|
| `user` | `User \| null` | Supabase Auth User |
| `session` | `Session \| null` | Supabase Session |
| `profile` | `Profile \| null` | 用戶資料 |
| `loading` | `boolean` | 載入狀態 |
| `isAdmin` | `boolean` | 是否為管理員 |
| `isMember` | `boolean` | 是否為會員 (user role) |
| `isHelper` | `boolean` | 是否為小幫手 |

---

## 6. 頁面功能清單

### 6.1 UnifiedAuthPage（統一登入頁）

**路徑：** `/auth/login`

**功能：**
- ✅ Email/密碼登入
- ✅ Email/密碼註冊
- ✅ Google OAuth 登入
- ✅ 忘記密碼（發送重設郵件）
- ✅ 登入/註冊切換 Tab
- ✅ 密碼顯示/隱藏切換
- ✅ Zod 表單驗證
- ✅ 產品輪播展示（4個產品）
- ✅ 來源產品識別（`?from=product_id`）
- ✅ 登入後重導向（`?redirect=path`）
- ✅ 動態背景動畫（漸變光暈、粒子、網格）
- ✅ 黑金奢華主題

**視覺元素：**
- 浮動粒子動畫（20個）
- 產品圖示輪播（每 3 秒切換）
- 漸變光暈背景
- Shield 主 Logo
- 表單發光邊框效果

### 6.2 UnifiedDashboard（會員中心）

**路徑：** `/account`

**功能：**
- ✅ 歡迎區塊（顯示暱稱和訂閱狀態）
- ✅ Beta 公告通知
- ✅ 四個 Tab 頁籤：
  - **產品權限**：有效權限 + 過期權限
  - **訂閱記錄**：歷史訂閱列表
  - **已授權應用**：OAuth 應用管理 + 撤銷
  - **個人資料**：快速資料預覽
- ✅ Pull-to-Refresh 手勢更新
- ✅ 權限卡片（含產品圖示、有效期）
- ✅ 管理員/小幫手快捷入口
- ✅ 登出功能
- ✅ 響應式設計（桌面/行動版）

**產品配置：**
```typescript
const PRODUCT_INFO = {
  report_platform: { icon: Sparkles, color: "amber", ... },
  story_builder_hub: { icon: Star, color: "purple", ... },
  seek_monster: { icon: Compass, color: "emerald", ... },
  yuanyi_divination: { icon: Zap, color: "blue", ... },
};
```

### 6.3 UnifiedProfilePage（個人資料編輯）

**路徑：** `/account/profile`

**功能：**
- ✅ 基本資料區塊：
  - 暱稱 (display_name)
  - 電話 (phone)
  - 性別 (gender)
  - 簡介 (bio)
- ✅ 出生資訊區塊：
  - 出生日期 (birth_date)
  - 出生時間 (birth_time)
  - 出生地點 (birth_place)
- ✅ 表單驗證
- ✅ 儲存成功/失敗 Toast
- ✅ 返回按鈕

---

## 7. 權限系統功能

### 7.1 權限 Hooks

| Hook | 說明 |
|------|------|
| `useProducts()` | 取得所有產品列表 |
| `usePlans()` | 取得所有方案列表 |
| `useMyEntitlements()` | 取得當前用戶的權限 |
| `useAllEntitlements()` | 取得所有權限（管理員） |
| `useCreateEntitlement()` | 建立/更新權限 |
| `useUpdateEntitlement()` | 更新權限 |
| `useDeleteEntitlement()` | 刪除權限 |
| `useSearchUsers(email)` | 搜尋用戶 |
| `useProductAccess(productId)` | 檢查產品權限 |
| `useActiveProductIds()` | 取得有效產品 ID 列表 |

### 7.2 權限狀態判斷邏輯

```typescript
const getEntitlementStatus = (ent: Entitlement) => {
  const now = new Date();
  if (ent.status === 'revoked') return 'revoked';
  if (ent.ends_at && new Date(ent.ends_at) < now) return 'expired';
  if (ent.status === 'active') return 'active';
  return ent.status;
};
```

---

## 8. OAuth 授權功能

### 8.1 授權流程

```
1. 外部應用 → /oauth/authorize?client_id=xxx&redirect_uri=xxx&scope=xxx&state=xxx
2. 用戶登入（如未登入）
3. 顯示授權確認頁面（OAuthAuthorizePage）
4. 用戶同意 → 生成 Authorization Code
5. 重導向回 redirect_uri?code=xxx&state=xxx
6. 外部應用用 code 換取 access_token
7. 外部應用用 access_token 呼叫 API
```

### 8.2 OAuthAuthorizePage 功能

- ✅ 顯示客戶端名稱和描述
- ✅ 顯示請求的權限範圍
- ✅ 顯示允許存取的產品
- ✅ 同意/拒絕按鈕
- ✅ 未登入時導向登入頁
- ✅ 錯誤處理（無效客戶端等）

### 8.3 已授權應用管理

**位置：** `/account` → 「已授權」Tab

- ✅ 列出所有已授權應用
- ✅ 顯示授權時間和到期時間
- ✅ 撤銷授權功能
- ✅ 空狀態提示

---

## 9. UI 元件清單

### 9.1 MemberAuthHeader（可換膚認證表頭）

**Props：**
```typescript
interface MemberAuthHeaderProps {
  theme?: MemberAuthHeaderTheme;
  config?: MemberAuthHeaderConfig;
  logo?: React.ReactNode;
  extraNavItems?: React.ReactNode;
  className?: string;
}
```

**主題配置：**
```typescript
interface MemberAuthHeaderTheme {
  background?: string;       // 預設: 'bg-background/95 backdrop-blur-sm'
  textColor?: string;        // 預設: 'text-foreground'
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  avatarBorder?: string;     // 預設: 'ring-2 ring-primary/20'
  dropdownBackground?: string;
}
```

**路由配置：**
```typescript
interface MemberAuthHeaderConfig {
  loginPath?: string;        // 預設: '/auth/login'
  dashboardPath?: string;    // 預設: '/account'
  profilePath?: string;      // 預設: '/account/profile'
  logoutRedirect?: string;   // 預設: '/'
  showAdminEntry?: boolean;  // 預設: true
  adminPath?: string;        // 預設: '/dashboard'
}
```

**功能：**
- ✅ 未登入狀態：顯示「登入/註冊」按鈕
- ✅ 已登入狀態：顯示頭像下拉選單
- ✅ 下拉選單項目：會員中心、個人資料、管理後台（角色條件）、登出
- ✅ 管理員/小幫手快捷入口（桌面版）
- ✅ 載入狀態骨架

### 9.2 MemberProtectedRoute

**功能：**
- ✅ 未登入時重導向至登入頁
- ✅ 載入中顯示 Loading 狀態
- ✅ 已登入時渲染子元件

### 9.3 MemberCardSkeleton

**變體：**
- `MemberCardSkeleton` - 單一卡片骨架
- `MemberListSkeleton` - 列表骨架（預設 3 個）
- `StatsCardSkeleton` - 統計卡片骨架

### 9.4 MemberLoginWidget

**Props：**
```typescript
interface MemberLoginWidgetProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showGoogleLogin?: boolean;
}
```

**功能：**
- ✅ 嵌入式登入/註冊表單
- ✅ Email/密碼驗證
- ✅ Google 登入（可選）
- ✅ 成功回調

---

## 10. 樣式主題配置

### 10.1 黑金奢華主題（主專案使用）

```typescript
const luxuryBlackGoldTheme: MemberAuthHeaderTheme = {
  background: 'bg-transparent',
  textColor: 'text-white',
  buttonVariant: 'outline',
  avatarBorder: 'ring-2 ring-amber-500/30',
  dropdownBackground: 'bg-[#1a1a1a] border-white/10',
};
```

### 10.2 關鍵 CSS 變數

需同步到新專案的 `index.css`：

```css
:root {
  /* 基礎色 */
  --background: 0 0% 4%;        /* #0a0a0a */
  --foreground: 0 0% 95%;       /* #f5f5f5 */
  
  /* 主色（金色） */
  --primary: 43 74% 58%;        /* #c9a962 amber */
  --primary-foreground: 0 0% 100%;
  
  /* 卡片/元件背景 */
  --card: 0 0% 8%;              /* #141414 */
  --muted: 0 0% 15%;            /* #262626 */
  
  /* 邊框 */
  --border: 0 0% 20%;           /* #333333 */
}
```

### 10.3 動畫定義

需同步的 Tailwind 動畫：

```typescript
// tailwind.config.ts
animation: {
  'fade-in': 'fadeIn 0.5s ease-out',
  'slide-up': 'slideUp 0.5s ease-out',
  'pulse': 'pulse 2s infinite',
}
```

---

## 11. 路由對照表

### 11.1 統一會員系統路由

| 路徑 | 頁面 | 保護 | 說明 |
|-----|------|------|------|
| `/auth/login` | UnifiedAuthPage | 否 | 統一登入/註冊 |
| `/account` | UnifiedDashboard | ✅ | 會員中心主頁 |
| `/account/profile` | UnifiedProfilePage | ✅ | 個人資料編輯 |
| `/account/products` | ProductsPage | ✅ | 產品列表 |
| `/oauth/authorize` | OAuthAuthorizePage | 條件 | OAuth 授權 |

### 11.2 Legacy 路由（主專案保留）

| 路徑 | 說明 |
|-----|------|
| `/member/auth` | 舊版登入頁（虹靈御所專用） |
| `/member` | 舊版會員中心 |
| `/member/profile` | 舊版個人資料 |

---

## 12. API 端點清單

### 12.1 Edge Functions

| 端點 | 方法 | 認證 | 用途 |
|-----|------|------|------|
| `/functions/v1/check-entitlement` | GET | API Key / JWT | 驗證權限 |
| `/functions/v1/entitlements-me` | GET | JWT | 取得我的權限 |
| `/functions/v1/entitlements-lookup` | GET | API Key | Email 查詢權限 |
| `/functions/v1/oauth-authorize` | GET/POST | - | OAuth 授權 |
| `/functions/v1/oauth-authorize/token` | POST | Client Secret | 換取令牌 |
| `/functions/v1/oauth-authorize/userinfo` | GET | Bearer Token | 取得用戶資訊 |

### 12.2 Supabase Client 直接查詢

| 表格 | 操作 | 說明 |
|-----|------|------|
| `profiles` | SELECT/UPDATE | 用戶資料 |
| `user_roles` | SELECT | 角色查詢 |
| `products` | SELECT | 產品列表 |
| `plans` | SELECT | 方案列表 |
| `entitlements` | SELECT/INSERT/UPDATE/DELETE | 權限管理 |
| `subscriptions` | SELECT | 訂閱記錄 |
| `oauth_clients` | SELECT | OAuth 客戶端（公開欄位） |
| `oauth_access_tokens` | SELECT/UPDATE | 存取令牌管理 |

---

## 13. 驗證規則

### 13.1 Zod Schemas

```typescript
// Email 驗證
const emailSchema = z.string()
  .email('請輸入有效的 Email 地址')
  .min(1, 'Email 為必填欄位');

// 密碼驗證
const passwordSchema = z.string()
  .min(6, '密碼至少需要 6 個字元')
  .max(72, '密碼最多 72 個字元');

// 暱稱驗證
const displayNameSchema = z.string()
  .min(1, '暱稱為必填欄位')
  .max(50, '暱稱最多 50 個字元')
  .optional();

// 登入表單
const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// 註冊表單
const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
});

// 重設密碼
const resetPasswordSchema = z.object({
  email: emailSchema,
});
```

---

## 14. 核對清單

### 14.1 前端模組

| 項目 | 主專案 | 新專案 | 說明 |
|-----|:------:|:------:|------|
| MemberContext.tsx | ✅ | ⬜ | 認證狀態管理 |
| useEntitlements.ts | ✅ | ⬜ | 權限 Hooks |
| validation.ts | ✅ | ⬜ | Zod 驗證 |
| types/index.ts | ✅ | ⬜ | 型別定義 |
| MemberAuthHeader.tsx | ✅ | ⬜ | 可換膚表頭 |
| MemberProtectedRoute.tsx | ✅ | ⬜ | 路由保護 |
| MemberCardSkeleton.tsx | ✅ | ⬜ | 骨架載入 |
| MemberLoginWidget.tsx | ✅ | ⬜ | 登入元件 |
| OAuthAuthorizePage.tsx | ✅ | ⬜ | OAuth 授權頁 |
| UnifiedAuthPage.tsx | ✅ | ⬜ | 登入頁（含動畫） |
| UnifiedDashboard.tsx | ✅ | ⬜ | 會員中心 |
| UnifiedProfilePage.tsx | ✅ | ⬜ | 個人資料頁 |

### 14.2 後端 Edge Functions

| 項目 | 主專案 | 新專案 | 說明 |
|-----|:------:|:------:|------|
| check-entitlement | ✅ | ⬜ | 權限驗證 |
| entitlements-me | ✅ | ⬜ | 我的權限 |
| entitlements-lookup | ✅ | ⬜ | Email 查詢 |
| oauth-authorize | ✅ | ⬜ | OAuth 授權 |

### 14.3 資料庫表格

| 項目 | 主專案 | 新專案 | 說明 |
|-----|:------:|:------:|------|
| profiles | ✅ | ⬜ | 用戶資料 |
| user_roles | ✅ | ⬜ | 角色分配 |
| products | ✅ | ⬜ | 產品定義 |
| plans | ✅ | ⬜ | 方案定義 |
| entitlements | ✅ | ⬜ | 權限記錄 |
| subscriptions | ✅ | ⬜ | 訂閱記錄 |
| oauth_clients | ✅ | ⬜ | OAuth 客戶端 |
| oauth_access_tokens | ✅ | ⬜ | 存取令牌 |
| oauth_authorization_codes | ✅ | ⬜ | 授權碼 |
| api_keys | ✅ | ⬜ | API 金鑰 |

### 14.4 樣式與主題

| 項目 | 主專案 | 新專案 | 說明 |
|-----|:------:|:------:|------|
| 黑金奢華主題 CSS | ✅ | ⬜ | index.css 變數 |
| Tailwind 動畫 | ✅ | ⬜ | tailwind.config.ts |
| luxuryBlackGoldTheme | ✅ | ⬜ | 主題配置物件 |
| 背景動畫效果 | ✅ | ⬜ | 登入頁粒子/光暈 |

### 14.5 路由配置

| 項目 | 主專案 | 新專案 | 說明 |
|-----|:------:|:------:|------|
| /auth/login | ✅ | ⬜ | 統一登入 |
| /account | ✅ | ⬜ | 會員中心 |
| /account/profile | ✅ | ⬜ | 個人資料 |
| /oauth/authorize | ✅ | ⬜ | OAuth 授權 |

---

## 附錄：快速同步指令

如果使用 GitHub 同步，可將以下檔案/目錄複製到新專案：

```bash
# 前端模組
src/modules/member/

# Edge Functions
supabase/functions/check-entitlement/
supabase/functions/entitlements-me/
supabase/functions/entitlements-lookup/
supabase/functions/oauth-authorize/

# 配置
supabase/config.toml（相關 function 設定）

# 樣式（需手動合併）
src/index.css（CSS 變數部分）
tailwind.config.ts（動畫部分）

# 文件
docs/migration/
docs/MEMBER_CENTER_ARCHITECTURE.md
docs/UNIFIED_MEMBER_SDK.md
docs/ENTITLEMENTS_API.md
```

---

*文件版本：v1.0.0*
*最後更新：2026-01-14*
