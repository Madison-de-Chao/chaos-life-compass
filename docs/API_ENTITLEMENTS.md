# Entitlements API 文件

## 端點

```
GET /functions/v1/entitlements-me
```

## 說明

取得當前登入使用者的產品權限列表。此 API 供外部專案（如 Story Builder Hub、Seek Monster）驗證使用者是否擁有特定產品的存取權限。

## 認證

需要在 Header 中提供有效的 JWT Token：

```
Authorization: Bearer <access_token>
```

## 查詢參數

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `product_id` | string | 否 | 過濾特定產品的權限。可用值：`report_platform`、`story_builder_hub`、`seek_monster` |

## 回應格式

### 成功回應 (200)

```json
{
  "user_id": "uuid",
  "entitlements": [
    {
      "id": "uuid",
      "product_id": "report_platform",
      "plan_id": "uuid | null",
      "status": "active | expired | revoked",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2024-12-31T23:59:59Z | null",
      "is_active": true
    }
  ]
}
```

### 欄位說明

| 欄位 | 說明 |
|------|------|
| `user_id` | 使用者 UUID |
| `entitlements` | 權限陣列 |
| `entitlements[].id` | 權限記錄 UUID |
| `entitlements[].product_id` | 產品 ID |
| `entitlements[].plan_id` | 方案 ID（可選） |
| `entitlements[].status` | 狀態：`active`（有效）、`expired`（過期）、`revoked`（已撤銷） |
| `entitlements[].starts_at` | 權限開始時間 |
| `entitlements[].ends_at` | 權限結束時間（null 表示永久） |
| `entitlements[].is_active` | 計算後的有效狀態（考慮 status 與 ends_at） |

### 錯誤回應

| 狀態碼 | 說明 |
|--------|------|
| 401 | 未提供認證 Token 或 Token 無效 |
| 500 | 伺服器內部錯誤 |

## 使用範例

### JavaScript/TypeScript

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 取得所有權限
const { data, error } = await supabase.functions.invoke('entitlements-me');

// 過濾特定產品
const { data, error } = await supabase.functions.invoke('entitlements-me', {
  body: null,
  headers: {},
});

// 使用 fetch 直接呼叫
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/entitlements-me?product_id=story_builder_hub`,
  {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  }
);
const data = await response.json();
```

### 檢查特定產品權限

```typescript
async function hasProductAccess(productId: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('entitlements-me', {
    body: null,
  });
  
  if (error || !data) return false;
  
  return data.entitlements.some(
    (e: any) => e.product_id === productId && e.is_active
  );
}

// 使用
const canAccessStoryBuilder = await hasProductAccess('story_builder_hub');
```

## 產品 ID 對照

| 產品 | product_id |
|------|------------|
| 報告閱讀平台 | `report_platform` |
| 故事建構中心 | `story_builder_hub` |
| 尋怪物語 | `seek_monster` |

## 會員資料欄位

使用者 Profile 包含以下欄位：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `full_name` | text | 真實姓名 |
| `nickname` | text | 暱稱 |
| `display_name` | text | 顯示名稱 |
| `gender` | text | 性別 |
| `birth_date` | date | 出生年月日 |
| `birth_time` | time | 出生時間 |
| `phone` | text | 手機號碼 |
| `subscription_status` | enum | 訂閱狀態（free/trial/active/cancelled/expired） |
| `total_spent` | numeric | 累計消費金額 |

Email 資訊儲存於 `auth.users.email`，可透過 `supabase.auth.getUser()` 取得。

購買紀錄儲存於 `subscriptions` 資料表，包含：
- `plan_name`: 方案名稱
- `amount`: 金額
- `currency`: 幣別
- `started_at`: 開始時間
- `expires_at`: 到期時間
- `status`: 狀態
