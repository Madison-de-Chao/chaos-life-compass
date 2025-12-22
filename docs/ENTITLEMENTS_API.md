# Entitlements API 完整文件

中央授權系統 API 參考文件 - 用於外部專案驗證用戶權限

---

## 連線資訊

| 項目 | 值 |
|------|-----|
| API Base URL | `https://yyzcgxnvtprojutnxisz.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5emNneG52dHByb2p1dG54aXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2Mzc4NjMsImV4cCI6MjA4MTIxMzg2M30.1MekiqwQCjZ4mWZlBmb7VY-Y2mnqKhHxCaYDJYoqWfw` |

> ⚠️ **重要提醒**: API Key 請妥善保管，不要公開在前端程式碼中。建議在伺服器端使用，或透過環境變數設定。

---

## 快速開始

```bash
curl -X GET "https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/check-entitlement?product_id=report_platform&email=user@example.com" \
  -H "X-API-Key: your-api-key"
```

---

## API 端點

### 1. check-entitlement

檢查用戶是否有權限存取指定產品（推薦使用）

**Endpoint**
```
GET https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/check-entitlement
```

**認證方式**

| 方式 | Header | 說明 |
|------|--------|------|
| API Key + Email (推薦) | `X-API-Key: your-api-key` | 適用於外部專案後端呼叫 |
| JWT Token | `Authorization: Bearer <jwt>` | 適用於用戶已登入中央系統 |

**查詢參數**

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| product_id | string | ✅ 必填 | 產品 ID |
| email | string | 選填* | 用戶 email（使用 API Key 時需要） |

**回應格式 - 有權限**
```json
{
  "hasAccess": true,
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "product_id": "story_builder_hub",
  "entitlement": {
    "id": "uuid",
    "plan_id": "uuid",
    "status": "active",
    "starts_at": "2024-01-01T00:00:00Z",
    "ends_at": "2025-01-01T00:00:00Z"
  }
}
```

**回應格式 - 無權限**
```json
{
  "hasAccess": false,
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "product_id": "story_builder_hub",
  "entitlement": null
}
```

**回應格式 - 用戶不存在**
```json
{
  "hasAccess": false,
  "found": false,
  "message": "User not found in central system"
}
```

---

### 2. entitlements-me

取得當前登入用戶的所有權限

**Endpoint**
```
GET https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/entitlements-me
```

**認證方式**

| 方式 | Header | 說明 |
|------|--------|------|
| JWT Token (必須) | `Authorization: Bearer <jwt>` | 用戶登入後的 JWT Token |

**回應格式**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "entitlements": [
    {
      "id": "uuid",
      "product_id": "story_builder_hub",
      "plan_id": "uuid",
      "status": "active",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2025-01-01T00:00:00Z",
      "product": {
        "id": "story_builder_hub",
        "name": "Story Builder Hub"
      },
      "plan": {
        "id": "uuid",
        "name": "Pro Plan"
      }
    }
  ]
}
```

---

### 3. entitlements-lookup

根據 email 查詢用戶權限

**Endpoint**
```
GET https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/entitlements-lookup
```

**認證方式**

| 方式 | Header | 說明 |
|------|--------|------|
| API Key | `X-API-Key: your-api-key` | 適用於外部專案後端呼叫 |
| Service Role Key | `Authorization: Bearer <service-role-key>` | 管理員專用 |

**查詢參數**

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| email | string | ✅ 必填 | 用戶 email |
| product_id | string | 選填 | 篩選特定產品的權限 |

**回應格式**
```json
{
  "found": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "entitlements": [
    {
      "id": "uuid",
      "product_id": "story_builder_hub",
      "status": "active",
      "starts_at": "2024-01-01T00:00:00Z",
      "ends_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## 程式碼範例

### Node.js

```javascript
const checkEntitlement = async (email, productId) => {
  const response = await fetch(
    `https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/check-entitlement?product_id=${productId}&email=${email}`,
    {
      headers: {
        'X-API-Key': process.env.ENTITLEMENTS_API_KEY,
      },
    }
  );
  return response.json();
};

// 使用範例
const result = await checkEntitlement('user@example.com', 'story_builder_hub');
if (result.hasAccess) {
  console.log('用戶有權限');
} else {
  console.log('用戶無權限');
}
```

### Python

```python
import requests
import os

def check_entitlement(email: str, product_id: str) -> dict:
    response = requests.get(
        f"https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/check-entitlement",
        params={"product_id": product_id, "email": email},
        headers={"X-API-Key": os.environ["ENTITLEMENTS_API_KEY"]},
    )
    return response.json()

# 使用範例
result = check_entitlement("user@example.com", "story_builder_hub")
if result["hasAccess"]:
    print("用戶有權限")
else:
    print("用戶無權限")
```

### cURL

```bash
curl -X GET "https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1/check-entitlement?product_id=story_builder_hub&email=user@example.com" \
  -H "X-API-Key: your-api-key"
```

---

## 錯誤處理

| 狀態碼 | 說明 | 建議處理方式 |
|--------|------|--------------|
| 200 | 成功 | 依據回應內容進行後續處理 |
| 400 | 請求參數錯誤 | 檢查必填參數是否提供正確 |
| 401 | 認證失敗 | 檢查 API Key 或 JWT Token 是否正確 |
| 403 | 權限不足 | 確認 API Key 是否有權限存取該資源 |
| 404 | 資源不存在 | 確認 product_id 或用戶是否存在 |
| 500 | 伺服器錯誤 | 稍後重試或聯繫管理員 |

---

## 最佳實踐

1. **快取權限結果**: 對於頻繁檢查的權限，建議在應用層快取結果（建議 5-15 分鐘）
2. **錯誤處理**: 實作完整的錯誤處理邏輯，包括網路錯誤和 API 錯誤
3. **安全性**: 永遠不要在前端暴露 API Key，使用伺服器端呼叫
4. **日誌記錄**: 記錄 API 呼叫結果以便除錯和審計

---

## 聯繫方式

管理員信箱：momo741006@gmail.com

---

*文件版本: 1.0.0*
*最後更新: 2025-12-22*
