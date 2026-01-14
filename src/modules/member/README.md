# 會員模組 (Member Module)

此模組包含所有會員相關功能，設計為可獨立遷移至會員中心專案。

## 目錄結構

```
src/modules/member/
├── index.ts              # 主要匯出入口
├── types/
│   └── index.ts          # 所有型別定義
├── context/
│   └── MemberContext.tsx # 認證 Context 和 Provider
├── hooks/
│   └── useEntitlements.ts # 權限相關 Hooks
└── components/
    ├── MemberProtectedRoute.tsx  # 保護路由元件
    └── MemberCardSkeleton.tsx    # 載入骨架元件
```

## 使用方式

### 匯入模組

```tsx
// 推薦：從模組根目錄匯入
import { 
  MemberProvider, 
  useMember, 
  useProducts,
  useMyEntitlements,
  MemberProtectedRoute 
} from '@/modules/member';

// 型別匯入
import type { 
  Profile, 
  Entitlement, 
  Product 
} from '@/modules/member';
```

### 向後兼容

原有的匯入路徑仍然可用，但已標記為 deprecated：

```tsx
// ⚠️ Deprecated - 請改用新路徑
import { useMember } from '@/hooks/useMember';
import { useEntitlements } from '@/hooks/useEntitlements';
```

## 核心功能

### MemberProvider

提供全域會員認證狀態：

```tsx
function App() {
  return (
    <MemberProvider>
      <Router>
        {/* ... */}
      </Router>
    </MemberProvider>
  );
}
```

### useMember Hook

存取會員狀態和操作：

```tsx
function MyComponent() {
  const { 
    user,           // Supabase User
    profile,        // 會員資料
    loading,        // 載入狀態
    isAdmin,        // 是否為管理員
    signIn,         // 登入方法
    signOut,        // 登出方法
    updateProfile,  // 更新資料
  } = useMember();
}
```

### 權限 Hooks

```tsx
// 取得所有產品
const { data: products } = useProducts();

// 取得當前用戶的權限
const { data: entitlements } = useMyEntitlements();

// 檢查特定產品權限
const { data: access } = useProductAccess('report_platform');
if (access?.hasAccess) {
  // 用戶有權限
}
```

### MemberProtectedRoute

保護需要登入的路由：

```tsx
<Route 
  path="/account" 
  element={
    <MemberProtectedRoute>
      <AccountPage />
    </MemberProtectedRoute>
  } 
/>
```

## 遷移至獨立專案

當準備將此模組遷移至獨立的會員中心專案時：

1. **複製整個 `src/modules/member` 目錄**
2. **更新 Supabase 連線設定**（使用新專案的 client）
3. **移除向後兼容層**（`src/hooks/useMember.tsx` 等）
4. **在主站安裝 NPM 套件**或透過 API 整合

詳細遷移計畫請參考：`docs/MEMBER_CENTER_ARCHITECTURE.md`

## 相關文件

- [會員中心架構文件](../../../docs/MEMBER_CENTER_ARCHITECTURE.md)
- [統一會員 SDK](../../../docs/UNIFIED_MEMBER_SDK.md)
- [權限 API 文件](../../../docs/ENTITLEMENTS_API.md)
