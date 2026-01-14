# 資料遷移指南

本指南說明如何將會員資料從主站遷移至獨立會員中心。

## 前置條件

1. 新會員中心專案已建立
2. 資料庫 Schema 已部署
3. Edge Functions 已部署

## 遷移資料表

### 1. 匯出產品定義

```sql
-- 在主站資料庫執行
SELECT id, name, description, price, duration_days, purchase_type, created_at
FROM products;
```

### 2. 匯出方案定義

```sql
SELECT id, product_id, name, description, price, currency, duration_days, created_at
FROM plans;
```

### 3. 匯出用戶 Profiles

```sql
SELECT 
  user_id,
  display_name,
  full_name,
  nickname,
  avatar_url,
  bio,
  phone,
  gender,
  birth_date,
  birth_time,
  birth_place,
  subscription_status,
  subscription_started_at,
  subscription_expires_at,
  total_spent,
  created_at
FROM profiles;
```

### 4. 匯出用戶角色

```sql
SELECT user_id, role, created_at
FROM user_roles;
```

### 5. 匯出權限記錄

```sql
SELECT 
  user_id,
  product_id,
  plan_id,
  status,
  starts_at,
  ends_at,
  granted_by,
  notes,
  created_at
FROM entitlements;
```

### 6. 匯出 OAuth 客戶端

```sql
SELECT 
  client_id,
  client_secret_hash,
  name,
  description,
  redirect_uris,
  allowed_products,
  is_active,
  created_by,
  created_at
FROM oauth_clients;
```

### 7. 匯出 API Keys

```sql
SELECT 
  name,
  description,
  key_prefix,
  key_hash,
  permissions,
  is_active,
  expires_at,
  created_by,
  created_at
FROM api_keys;
```

## 匯入步驟

### 1. 準備 CSV 檔案

將上述查詢結果匯出為 CSV 格式。

### 2. 處理 auth.users

**重要**：`auth.users` 表無法直接匯入，需要用戶重新註冊。

策略選項：

1. **邀請機制**：發送邀請郵件讓用戶重新註冊
2. **Magic Link**：使用 Magic Link 讓用戶登入時自動遷移
3. **漸進遷移**：用戶首次存取時同步資料

### 3. 匯入產品和方案

```sql
-- 在新會員中心資料庫執行
INSERT INTO products (id, name, description, price, duration_days, purchase_type, created_at)
VALUES 
  ('report_platform', '命理報告平台', '...', null, null, 'one_time', now()),
  -- ... 其他產品
;

INSERT INTO plans (id, product_id, name, description, price, currency, duration_days, created_at)
VALUES
  -- 從 CSV 匯入
;
```

### 4. 建立用戶對照表

由於 `user_id` 是 UUID，需要建立新舊 ID 對照：

```sql
CREATE TABLE temp_user_mapping (
  old_user_id UUID,
  new_user_id UUID,
  email TEXT UNIQUE
);
```

### 5. 遷移用戶 Profiles

當用戶在新系統註冊後，使用 Email 對照更新 Profile：

```sql
UPDATE profiles p
SET 
  display_name = m.display_name,
  full_name = m.full_name,
  -- ... 其他欄位
FROM temp_migrated_profiles m
WHERE p.user_id = (
  SELECT new_user_id 
  FROM temp_user_mapping 
  WHERE email = m.email
);
```

### 6. 遷移權限記錄

```sql
INSERT INTO entitlements (user_id, product_id, plan_id, status, starts_at, ends_at, notes, created_at)
SELECT 
  um.new_user_id,
  me.product_id,
  me.plan_id,
  me.status,
  me.starts_at,
  me.ends_at,
  me.notes,
  me.created_at
FROM temp_migrated_entitlements me
JOIN temp_user_mapping um ON um.email = me.email;
```

## 驗證遷移

### 1. 驗證用戶數量

```sql
SELECT COUNT(*) FROM profiles; -- 應與主站相符
```

### 2. 驗證權限記錄

```sql
SELECT 
  product_id,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
FROM entitlements
GROUP BY product_id;
```

### 3. 測試 API

```bash
# 測試權限檢查
curl -H "X-API-Key: mk_xxx" \
  "https://your-member-center.lovable.app/functions/v1/check-entitlement?product_id=report_platform&email=test@example.com"
```

## 回滾計畫

如遷移失敗，執行以下步驟：

1. 保留主站原有資料不變
2. 清空新會員中心資料
3. 檢查錯誤日誌
4. 修正問題後重新遷移

## 切換策略

### 階段一：雙寫模式
- 主站繼續處理認證
- 同時寫入新會員中心
- 持續 1-2 週

### 階段二：讀取切換
- 主站改為讀取新會員中心 API
- 寫入仍在主站
- 持續 1 週

### 階段三：完全切換
- 所有讀寫指向新會員中心
- 主站僅保留內容相關資料
- 移除主站的會員相關表

## 注意事項

1. **資料完整性**：確保所有關聯資料正確遷移
2. **權限延續**：用戶的有效權限不應中斷
3. **時區處理**：確保時間戳正確轉換
4. **密碼處理**：密碼 Hash 無法遷移，用戶需重設
5. **API Key 更新**：外部專案需更新 API 端點
