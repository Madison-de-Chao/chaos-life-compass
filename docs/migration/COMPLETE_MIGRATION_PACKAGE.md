# 會員中心完整遷移打包指南

本文件整合所有必要檔案和步驟，幫助您在新 Lovable 專案中快速建立獨立會員中心。

---

## 📦 檔案清單

### 必須複製的目錄

| 來源路徑 | 目標路徑 | 說明 |
|---------|---------|------|
| `src/modules/member/` | `src/modules/member/` | 會員模組核心 |
| `supabase/functions/check-entitlement/` | `supabase/functions/check-entitlement/` | 權限檢查 API |
| `supabase/functions/entitlements-me/` | `supabase/functions/entitlements-me/` | 用戶權限查詢 |
| `supabase/functions/entitlements-lookup/` | `supabase/functions/entitlements-lookup/` | Email 權限查詢 |
| `supabase/functions/oauth-authorize/` | `supabase/functions/oauth-authorize/` | OAuth 授權流程 |

### 必須複製的檔案

| 來源路徑 | 目標路徑 | 說明 |
|---------|---------|------|
| `docs/migration/schema.sql` | 用於 Migration Tool | 資料庫結構 |
| `docs/UNIFIED_MEMBER_SDK.md` | `docs/` | SDK 文檔 |
| `docs/ENTITLEMENTS_API.md` | `docs/` | API 文檔 |

---

## 🚀 快速開始步驟

### Step 1: 建立新專案

1. 前往 [lovable.dev](https://lovable.dev) 建立新專案
2. 建議命名：`hongling-member-center`
3. 等待 Cloud 自動啟用

### Step 2: 執行資料庫 Migration

在新專案中貼上以下訊息請 AI 執行：

```
請執行以下 SQL Migration 來建立會員中心資料庫結構：

[貼上 docs/migration/schema.sql 的完整內容]
```

### Step 3: 複製前端模組

將以下內容複製到新專案：

#### 3.1 會員模組目錄結構

```
src/modules/member/
├── index.ts              # 主要匯出入口
├── README.md             # 模組文檔
├── types/
│   └── index.ts          # 型別定義
├── context/
│   └── MemberContext.tsx # 認證 Context
├── hooks/
│   └── useEntitlements.ts # 權限 Hooks
├── utils/
│   └── validation.ts      # 表單驗證
├── components/
│   ├── MemberProtectedRoute.tsx
│   ├── MemberCardSkeleton.tsx
│   ├── MemberLoginWidget.tsx
│   └── OAuthAuthorizePage.tsx
└── pages/
    ├── index.ts
    ├── UnifiedAuthPage.tsx
    ├── UnifiedDashboard.tsx
    └── UnifiedProfilePage.tsx
```

### Step 4: 設置路由

在新專案的 `App.tsx` 中添加路由：

```tsx
import { MemberProvider } from '@/modules/member';
import {
  UnifiedAuthPage,
  UnifiedDashboard,
  UnifiedProfilePage,
  MemberProtectedRoute,
  OAuthAuthorizePage,
} from '@/modules/member';

function App() {
  return (
    <MemberProvider>
      <Routes>
        {/* 公開路由 */}
        <Route path="/auth/login" element={<UnifiedAuthPage />} />
        <Route path="/oauth/authorize" element={<OAuthAuthorizePage />} />
        
        {/* 受保護路由 */}
        <Route path="/account" element={
          <MemberProtectedRoute>
            <UnifiedDashboard />
          </MemberProtectedRoute>
        } />
        <Route path="/account/profile" element={
          <MemberProtectedRoute>
            <UnifiedProfilePage />
          </MemberProtectedRoute>
        } />
      </Routes>
    </MemberProvider>
  );
}
```

### Step 5: 配置認證

請 AI 執行：

```
請啟用自動確認 Email 註冊，這是非正式環境的必要設定
```

### Step 6: 設置 Secrets（如需要）

如需發送郵件，添加 `RESEND_API_KEY` secret。

---

## 📄 Edge Functions 程式碼

### check-entitlement/index.ts

用於外部專案查詢用戶權限，支援：
- **API Key + email**：外部專案使用
- **JWT Token**：內部用戶使用

```typescript
// 完整程式碼請參考：supabase/functions/check-entitlement/index.ts
```

### entitlements-me/index.ts

用戶查詢自己的權限：

```typescript
// 完整程式碼請參考：supabase/functions/entitlements-me/index.ts
```

### entitlements-lookup/index.ts

根據 Email 查詢用戶權限（需 API Key）：

```typescript
// 完整程式碼請參考：supabase/functions/entitlements-lookup/index.ts
```

### oauth-authorize/index.ts

OAuth 2.0 授權流程：

```typescript
// 完整程式碼請參考：supabase/functions/oauth-authorize/index.ts
```

---

## 🔗 主站整合

當會員中心獨立運作後，主站需要修改為 API 呼叫模式：

### 使用 SDK

```typescript
import { UnifiedMemberClient } from '@hongling/member-sdk';

const memberClient = new UnifiedMemberClient({
  apiKey: 'mk_your_api_key_here',
  baseUrl: 'https://your-member-center.lovable.app'
});

// 檢查用戶權限
const access = await memberClient.checkAccess(
  'user@example.com',
  'report_platform'
);

if (access.hasAccess) {
  // 用戶有權限
}
```

### 直接 API 呼叫

```bash
# 使用 API Key + Email 查詢
curl -H "X-API-Key: mk_xxx" \
  "https://member-center.lovable.app/functions/v1/check-entitlement?product_id=report_platform&email=user@example.com"

# 使用 JWT 查詢（用戶已登入）
curl -H "Authorization: Bearer <jwt_token>" \
  "https://member-center.lovable.app/functions/v1/entitlements-me"
```

---

## 📊 資料遷移

### 1. 匯出主站資料

在主站資料庫執行查詢匯出以下資料：

- `profiles` - 用戶資料
- `user_roles` - 角色分配  
- `products` - 產品定義
- `plans` - 方案定義
- `entitlements` - 權限記錄
- `oauth_clients` - OAuth 客戶端
- `api_keys` - API 金鑰

詳細步驟請參考：`docs/migration/DATA_MIGRATION.md`

### 2. 處理 auth.users

**重要**：`auth.users` 無法直接遷移，建議：

1. **漸進遷移**：用戶首次存取時同步資料
2. **邀請機制**：發送邀請郵件重新註冊
3. **Magic Link**：使用 Magic Link 自動遷移

---

## ✅ 驗證清單

- [ ] 資料庫 Schema 已執行
- [ ] Edge Functions 已部署
- [ ] 登入/註冊功能正常
- [ ] 權限查詢 API 可用
- [ ] OAuth 授權流程可用
- [ ] 主站 API 整合測試通過

---

## 🔒 安全注意事項

1. **API Key 管理**：每個外部專案使用獨立 API Key
2. **CORS 設定**：僅允許已知域名
3. **Rate Limiting**：已內建速率限制
4. **Token 過期**：OAuth Token 24 小時過期

---

## 📚 相關文件

- [完整資料庫 Schema](./schema.sql)
- [資料遷移指南](./DATA_MIGRATION.md)
- [SDK 使用文檔](../UNIFIED_MEMBER_SDK.md)
- [API 參考](../ENTITLEMENTS_API.md)
- [會員中心架構](../MEMBER_CENTER_ARCHITECTURE.md)
