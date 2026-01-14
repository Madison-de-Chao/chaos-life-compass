# 會員中心遷移指南

本指南說明如何將會員模組從主站遷移至獨立的會員中心專案。

## 概述

會員中心將作為整個品牌生態系的統一身份認證和權限管理中心，主站及其他外部專案透過 API 呼叫驗證用戶權限。

## 遷移步驟

### 第一階段：建立新專案

1. 在 Lovable 建立新專案（例如：`hongling-member-center`）
2. 等待 Cloud 後端自動啟用
3. 複製 `src/modules/member/` 目錄到新專案的 `src/` 下

### 第二階段：設置資料庫

使用以下 SQL 在新專案中建立資料表：

```sql
-- 檔案：docs/migration/schema.sql
-- 執行順序：1. Enums → 2. Tables → 3. Functions → 4. Triggers → 5. RLS Policies
```

### 第三階段：配置環境

新專案需要的環境變數（透過 Cloud 介面設定）：
- `RESEND_API_KEY` - 郵件發送服務

### 第四階段：資料遷移

從主站匯出以下資料：
1. `profiles` - 用戶資料
2. `user_roles` - 角色分配
3. `products` - 產品定義
4. `plans` - 方案定義
5. `entitlements` - 權限記錄
6. `oauth_clients` - OAuth 客戶端
7. `api_keys` - API 金鑰

### 第五階段：主站整合

更新主站使用 API 驗證：
```typescript
import { UnifiedMemberClient } from '@hongling/member-sdk';

const client = new UnifiedMemberClient({
  apiKey: 'mk_xxx',
  baseUrl: 'https://member-center.lovable.app'
});
```

## 目錄結構

```
member-center/
├── src/
│   ├── modules/
│   │   └── member/           # 從主站複製
│   │       ├── types/
│   │       ├── context/
│   │       ├── hooks/
│   │       ├── utils/
│   │       ├── components/
│   │       └── pages/
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── functions/
│       ├── check-entitlement/
│       ├── entitlements-me/
│       ├── entitlements-lookup/
│       ├── oauth-authorize/
│       └── admin-get-users/
└── docs/
    └── API.md
```

## API 端點

會員中心提供以下 API：

| 端點 | 方法 | 認證 | 說明 |
|------|------|------|------|
| `/check-entitlement` | GET | API Key / JWT | 檢查用戶權限 |
| `/entitlements-me` | GET | JWT | 取得當前用戶權限 |
| `/entitlements-lookup` | GET | API Key | 依 Email 查詢權限 |
| `/oauth-authorize` | GET/POST | Session | OAuth 授權流程 |

## 安全注意事項

1. **API Key 管理**：每個外部專案使用獨立的 API Key
2. **CORS 設定**：僅允許已知域名
3. **Rate Limiting**：防止 API 濫用
4. **Token 過期**：OAuth Token 預設 1 小時過期

## 相關文件

- [完整資料庫 Schema](./schema.sql)
- [Edge Functions 程式碼](./edge-functions/)
- [SDK 使用文檔](../UNIFIED_MEMBER_SDK.md)
- [API 參考](../ENTITLEMENTS_API.md)
