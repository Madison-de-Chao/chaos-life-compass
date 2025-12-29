# @hongling/member-login-widget

虹靈御所會員登入小工具 - 可嵌入任何 React 專案的統一登入組件

## 安裝

```bash
npm install @hongling/member-login-widget
# or
yarn add @hongling/member-login-widget
# or
pnpm add @hongling/member-login-widget
```

## 快速開始

### 1. 設定 Provider

在應用程式根組件中包裝 `MemberProvider`：

```tsx
import { MemberProvider } from '@hongling/member-login-widget';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

function App() {
  return (
    <MemberProvider supabaseClient={supabase}>
      <YourApp />
    </MemberProvider>
  );
}
```

### 2. 使用登入小工具

```tsx
import { useState } from 'react';
import { MemberLoginWidget } from '@hongling/member-login-widget';
import '@hongling/member-login-widget/dist/styles.css'; // 引入樣式

function LoginPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <button onClick={() => setShowLogin(true)}>
        登入
      </button>

      {showLogin && (
        <div className="modal-overlay">
          <MemberLoginWidget 
            onClose={() => setShowLogin(false)}
            onSuccess={() => setShowLogin(false)}
            redirectTo="/dashboard"
          />
        </div>
      )}
    </>
  );
}
```

### 3. 使用 useMember Hook

```tsx
import { useMember } from '@hongling/member-login-widget';

function UserProfile() {
  const { user, profile, signOut, loading } = useMember();

  if (loading) return <p>載入中...</p>;
  if (!user) return <p>請先登入</p>;

  return (
    <div>
      <p>歡迎，{profile?.display_name || user.email}</p>
      <button onClick={signOut}>登出</button>
    </div>
  );
}
```

## API 參考

### MemberLoginWidget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClose` | `() => void` | - | 關閉按鈕回調，傳入時顯示關閉按鈕 |
| `onSuccess` | `() => void` | - | 登入/註冊成功後的回調 |
| `redirectTo` | `string` | `'/account'` | 成功後導向的路徑 |
| `showTitle` | `boolean` | `true` | 是否顯示標題區塊 |
| `compact` | `boolean` | `false` | 緊湊模式（減少間距） |
| `showGoogleLogin` | `boolean` | `true` | 是否顯示 Google 登入按鈕 |
| `className` | `string` | `''` | 自訂 CSS 類名 |
| `onNavigate` | `(path: string) => void` | - | 自訂導航函數 |
| `onToast` | `(options) => void` | - | 自訂 Toast 通知函數 |

### MemberProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | 子組件 |
| `supabaseClient` | `SupabaseClient` | - | Supabase 客戶端實例 |
| `profilesTable` | `string` | `'profiles'` | Profiles 資料表名稱 |
| `onAuthStateChange` | `(user: User \| null) => void` | - | 認證狀態變更回調 |

### useMember Hook

```typescript
interface MemberContextType {
  user: User | null;           // 當前用戶
  session: Session | null;     // 當前 Session
  profile: Profile | null;     // 用戶資料
  loading: boolean;            // 載入狀態
  
  // 認證方法
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  
  // 資料方法
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

## 自訂樣式

### 方式 1：使用 CSS 變數

```css
.hlw-widget {
  --hlw-primary: #your-color;
  --hlw-primary-dark: #your-darker-color;
  --hlw-bg: rgba(your-bg-color);
  --hlw-border: rgba(your-border-color);
  --hlw-text: #your-text-color;
  --hlw-radius: 1rem;
}
```

### 方式 2：使用 className 覆蓋

```tsx
<MemberLoginWidget className="my-custom-widget" />
```

```css
.my-custom-widget {
  background: white;
  border-radius: 8px;
}

.my-custom-widget .hlw-button-primary {
  background: blue;
}
```

### 方式 3：完全自訂 UI

使用 `useMember` hook 搭配自己的 UI：

```tsx
import { useMember } from '@hongling/member-login-widget';

function CustomLoginForm() {
  const { signIn, signUp } = useMember();
  
  // 使用自己的 UI 組件
  return (
    <YourCustomForm onSubmit={(data) => signIn(data.email, data.password)} />
  );
}
```

## 與 React Router 整合

```tsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <MemberLoginWidget 
      onNavigate={navigate}
      redirectTo="/dashboard"
    />
  );
}
```

## 與其他 Toast 庫整合

### Sonner

```tsx
import { toast } from 'sonner';

<MemberLoginWidget 
  onToast={({ title, description, variant }) => {
    if (variant === 'destructive') {
      toast.error(`${title}: ${description}`);
    } else {
      toast.success(`${title}: ${description}`);
    }
  }}
/>
```

### React Hot Toast

```tsx
import toast from 'react-hot-toast';

<MemberLoginWidget 
  onToast={({ title, description, variant }) => {
    const message = `${title}: ${description}`;
    variant === 'destructive' ? toast.error(message) : toast.success(message);
  }}
/>
```

## Database Schema

需要在 Supabase 中建立 profiles 表：

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## License

MIT © 虹靈御所
