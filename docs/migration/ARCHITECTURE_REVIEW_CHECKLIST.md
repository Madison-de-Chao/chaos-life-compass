# 會員中心架構檢視清單

> 本文件供舊系統團隊檢視新會員中心架構的完成度與完整性

---

## 📊 整體完成度摘要

| 模組 | 狀態 | 完成度 |
|------|------|--------|
| 資料庫結構 | ✅ 完成 | 100% |
| Edge Functions API | ✅ 完成 | 100% |
| 前端會員模組 | ✅ 完成 | 90% |
| OAuth 2.0 流程 | ✅ 完成 | 100% |
| Rate Limiting | ✅ 完成 | 100% |
| 管理後台 | ⚠️ 基礎完成 | 50% |

---

## 1️⃣ 資料庫結構 (Database Schema)

### 已建立的資料表

| 資料表 | 用途 | RLS | 狀態 |
|--------|------|-----|------|
| `profiles` | 用戶個人資料 | ✅ | ✅ 完成 |
| `user_roles` | 用戶角色（admin/user/helper） | ✅ | ✅ 完成 |
| `products` | 產品定義 | ✅ | ✅ 完成 |
| `plans` | 方案定義 | ✅ | ✅ 完成 |
| `entitlements` | 用戶權限記錄 | ✅ | ✅ 完成 |
| `subscriptions` | 訂閱記錄 | ✅ | ✅ 完成 |
| `oauth_clients` | OAuth 客戶端 | ✅ | ✅ 完成 |
| `oauth_authorization_codes` | OAuth 授權碼 | ✅ | ✅ 完成 |
| `oauth_access_tokens` | OAuth 存取令牌 | ✅ | ✅ 完成 |
| `api_keys` | API 金鑰管理 | ✅ | ✅ 完成 |
| `admin_logs` | 管理操作日誌 | ✅ | ✅ 完成 |
| `rate_limits` | API 速率限制記錄 | ✅ | ✅ 完成 |
| `oauth_refresh_tokens` | OAuth Refresh Token | ✅ | ✅ 完成 |

### 已建立的 Enum 類型

| Enum | 值 |
|------|-----|
| `app_role` | admin, user, helper |
| `subscription_status` | active, inactive, expired, cancelled |
| `entitlement_status` | active, expired, revoked |
| `profile_subscription_status` | free, trial, active, cancelled, expired |
| `subscription_plan` | free, basic, premium, enterprise |

### 待確認的資料庫函數

| 函數名稱 | 用途 | 狀態 |
|----------|------|------|
| `verify_api_key(key)` | 驗證 API Key | ✅ 已完成 |
| `verify_oauth_secret(client_id, secret)` | 驗證 OAuth Secret | ✅ 已完成 |
| `hash_secret(secret)` | 雜湊密鑰 | ✅ 已完成 |
| `has_role(_role, _user_id)` | 檢查用戶角色 | ✅ 已完成 |
| `is_admin_or_helper(user_id)` | 檢查管理員/協助者權限 | ✅ 已完成 |
| `check_rate_limit_v2(...)` | 速率限制檢查 | ✅ 已完成 |
| `verify_refresh_token(token)` | 驗證 Refresh Token | ✅ 已完成 |
| `revoke_user_refresh_tokens(...)` | 撤銷用戶 Refresh Token | ✅ 已完成 |

---

## 2️⃣ Edge Functions API

### 已部署的 API 端點

| 端點 | 方法 | 認證方式 | 功能 | 狀態 |
|------|------|----------|------|------|
| `/check-entitlement` | GET | API Key / JWT | 檢查用戶對特定產品的權限 | ✅ 完成 |
| `/entitlements-me` | GET | JWT | 取得當前登入用戶的所有權限 | ✅ 完成 |
| `/entitlements-lookup` | GET | API Key | 依 Email 查詢用戶權限 | ✅ 完成 |
| `/oauth-authorize` | GET/POST | Session | OAuth 授權流程 | ✅ 完成 |
| `/oauth-authorize/token` | POST | Client Secret | OAuth Token 交換 | ✅ 完成 |
| `/oauth-authorize/userinfo` | GET | Access Token | 取得用戶資訊 | ✅ 完成 |

### API 使用範例

#### check-entitlement (API Key 方式)
```bash
curl -X GET \
  "https://yrdtgwoxxjksesynrjss.supabase.co/functions/v1/check-entitlement?product_id=report_platform&email=user@example.com" \
  -H "x-api-key: mk_your_api_key"
```

#### check-entitlement (JWT 方式)
```bash
curl -X GET \
  "https://yrdtgwoxxjksesynrjss.supabase.co/functions/v1/check-entitlement?product_id=report_platform" \
  -H "Authorization: Bearer <user_jwt_token>"
```

#### entitlements-me
```bash
curl -X GET \
  "https://yrdtgwoxxjksesynrjss.supabase.co/functions/v1/entitlements-me?product_id=report_platform" \
  -H "Authorization: Bearer <user_jwt_token>"
```

#### entitlements-lookup
```bash
curl -X GET \
  "https://yrdtgwoxxjksesynrjss.supabase.co/functions/v1/entitlements-lookup?email=user@example.com" \
  -H "x-api-key: mk_your_api_key"
```

---

## 3️⃣ 前端會員模組

### 目錄結構

```
src/modules/member/
├── index.ts                    # 模組匯出入口
├── types/
│   └── index.ts               # 型別定義
├── context/
│   └── MemberContext.tsx      # 認證 Context Provider
├── hooks/
│   └── useEntitlements.ts     # 權限查詢 Hook
├── utils/
│   └── validation.ts          # 表單驗證工具
├── components/
│   ├── MemberProtectedRoute.tsx   # 保護路由組件
│   ├── MemberCardSkeleton.tsx     # 載入骨架
│   ├── MemberLoginWidget.tsx      # 登入小工具
│   ├── MemberAuthHeader.tsx       # 認證表頭（可換膚）
│   └── OAuthAuthorizePage.tsx     # OAuth 授權頁面
└── pages/
    ├── index.ts
    ├── MemberAuthPage.tsx         # 登入/註冊頁
    ├── MemberDashboard.tsx        # 會員儀表板
    └── MemberProfilePage.tsx      # 個人資料頁
```

### 已實作的 Hooks

| Hook | 功能 |
|------|------|
| `useMember()` | 取得當前用戶、登入/登出、載入狀態 |
| `useEntitlements()` | 查詢用戶權限、檢查特定產品權限 |

### 已實作的路由

| 路由 | 組件 | 需登入 |
|------|------|--------|
| `/member/auth` | MemberAuthPage | ❌ |
| `/member/dashboard` | MemberDashboard | ✅ |
| `/member/profile` | MemberProfilePage | ✅ |
| `/member/oauth/authorize` | OAuthAuthorizePage | ✅ |

---

## 4️⃣ OAuth 2.0 流程

### 支援的 Grant Type

- ✅ Authorization Code Flow
- ✅ Refresh Token Flow (Token Rotation)
- ❌ Client Credentials (未實作)

### OAuth 流程說明

```
┌─────────────────┐     1. 授權請求      ┌─────────────────┐
│   外部專案      │ ─────────────────────► │   會員中心      │
│  (Client App)   │                       │  /oauth/authorize│
└─────────────────┘                       └─────────────────┘
                                                  │
                                          2. 用戶登入/授權
                                                  │
                                                  ▼
┌─────────────────┐     3. 授權碼回調     ┌─────────────────┐
│   外部專案      │ ◄───────────────────── │   會員中心      │
│  /callback      │                       │                 │
└─────────────────┘                       └─────────────────┘
        │
        │ 4. Token 交換
        ▼
┌─────────────────┐                       ┌─────────────────┐
│   外部專案      │ ─────────────────────► │   會員中心      │
│  (Server-side)  │     POST /token       │  Edge Function  │
└─────────────────┘                       └─────────────────┘
        │
        │ 5. 取得用戶資訊
        ▼
┌─────────────────┐                       ┌─────────────────┐
│   外部專案      │ ─────────────────────► │   會員中心      │
│  (Server-side)  │    GET /userinfo      │  Edge Function  │
└─────────────────┘                       └─────────────────┘
```

---

## 5️⃣ 整合方式

### 方式 A：API Key 直接查詢

適用場景：後端對後端的權限檢查

```typescript
// 外部專案的後端
const response = await fetch(
  `${MEMBER_CENTER_URL}/functions/v1/check-entitlement?product_id=my_product&email=${userEmail}`,
  { headers: { 'x-api-key': API_KEY } }
);
const { hasAccess } = await response.json();
```

### 方式 B：OAuth 登入整合

適用場景：需要用戶登入的外部專案

```typescript
// 導向會員中心登入
window.location.href = `${MEMBER_CENTER_URL}/member/oauth/authorize?` + 
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(CALLBACK_URL)}&` +
  `response_type=code&` +
  `scope=profile`;
```

---

## 6️⃣ 待完成項目

### 高優先級（全部完成 ✅）

| 項目 | 說明 | 狀態 |
|------|------|------|
| `verify_api_key` 函數 | 資料庫函數，驗證 API Key | ✅ 已完成 |
| `verify_oauth_secret` 函數 | 資料庫函數，驗證 OAuth Secret | ✅ 已完成 |
| `hash_secret` 函數 | 資料庫函數，雜湊密鑰 | ✅ 已完成 |
| `is_admin_or_helper` 函數 | 資料庫函數，檢查管理權限 | ✅ 已完成 |
| `admin_logs` 資料表 | 管理操作日誌 | ✅ 已完成 |
| Rate Limiting | API 速率限制機制 | ✅ 已完成 |
| Refresh Token 支援 | OAuth refresh_token 流程 | ✅ 已完成 |

### 中優先級

| 項目 | 說明 | 預估工時 | 狀態 |
|------|------|----------|------|
| 管理後台 - AdminSidebar | 管理側邊欄導航 | 1h | ⏳ 待實作 |
| 管理後台 - 用戶管理 | 查看/編輯用戶權限 | 4h | ⏳ 待實作 |
| 管理後台 - 權益管理 | 權益 CRUD 介面 | 3h | ⏳ 待實作 |
| 管理後台 - API Key 管理 | 生成/撤銷 API Key | 2h | ⏳ 待實作 |

### 低優先級

| 項目 | 說明 | 預估工時 |
|------|------|----------|
| 權限變更通知 | Email 通知用戶權限變更 | 3h |
| 使用統計 Dashboard | API 使用量統計 | 4h |

---

## 7️⃣ 環境資訊

### Supabase 專案

- **Project ID**: `yrdtgwoxxjksesynrjss`
- **Region**: (請確認)
- **API URL**: `https://yrdtgwoxxjksesynrjss.supabase.co`

### 前端部署

- **Preview URL**: `https://id-preview--6ed201bd-d25a-4acf-9e7f-566274e225a6.lovable.app`
- **Production URL**: (尚未發布)

---

## 8️⃣ 檢視確認項目

請舊系統團隊確認以下項目：

### 資料結構確認

- [ ] `profiles` 欄位是否涵蓋所有需要的用戶資料？
- [ ] `products` 的 ID 命名是否與舊系統一致？
- [ ] `entitlements` 的狀態流程是否符合業務需求？

### API 確認

- [ ] `check-entitlement` 回傳格式是否符合需求？
- [ ] API Key 的權限範圍是否需要更細緻的控制？
- [ ] 是否需要批次查詢權限的 API？

### 整合確認

- [ ] OAuth redirect_uri 白名單機制是否足夠？
- [ ] Token 有效期（1小時）是否合適？
- [ ] 授權碼有效期（10分鐘）是否合適？

### 安全確認

- [ ] RLS 政策是否足夠嚴謹？
- [ ] API Key 是否需要 IP 白名單？
- [x] ~~是否需要 Rate Limiting？~~ ✅ 已實作多層速率限制

---

## 📎 相關文件

- [完整架構文件](../MEMBER_CENTER_ARCHITECTURE.md)
- [資料遷移指南](./DATA_MIGRATION.md)
- [完整遷移打包](./COMPLETE_MIGRATION_PACKAGE.md)
- [資料庫 Schema](./schema.sql)
- [缺少組件指南](./MISSING_COMPONENTS_GUIDE.md)
- [樣式同步清單](./STYLE_SYNC_CHECKLIST.md)
- [中優先級實作指南](./MEDIUM_PRIORITY_IMPLEMENTATION_GUIDE.md)

---

*文件版本：v1.2 | 更新日期：2025-01-14*

---

## 📝 最新更新記錄

### v1.2 (2025-01-14)
- ✅ **Rate Limiting 機制**：已在所有 Edge Functions 實作多層速率限制
  - IP 層級限制（100 req/min）
  - API Key 層級限制（50 req/min）
  - User 層級限制（100 req/min）
  - 建立 `rate_limits` 資料表與 `check_rate_limit_v2` 函數
- ✅ **OAuth Refresh Token 機制**：完整實作 Token Rotation
  - 建立 `oauth_refresh_tokens` 資料表
  - 實作 `verify_refresh_token` 與 `revoke_user_refresh_tokens` 函數
  - Access Token 有效期 1 小時，Refresh Token 有效期 30 天
  - 支援 `grant_type=refresh_token` 流程
