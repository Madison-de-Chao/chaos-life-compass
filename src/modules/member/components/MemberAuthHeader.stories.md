# MemberAuthHeader 共享認證表頭

可換膚、可配置的會員認證表頭組件，設計供所有生態系統專案共用。

## 功能特點

- ✅ **可換膚** - 透過 theme 屬性自定義顏色、背景、按鈕樣式
- ✅ **可配置路由** - 自定義登入、會員中心、管理後台路徑
- ✅ **角色感知** - 自動識別管理員/小幫手並顯示對應入口
- ✅ **插槽設計** - 支援 Logo 和額外導航項目插入
- ✅ **響應式** - 桌面/移動端自適應佈局

## 基本使用

```tsx
import { MemberAuthHeader } from '@/modules/member';

function MyHeader() {
  return (
    <header className="flex justify-between items-center p-4">
      <Logo />
      <MemberAuthHeader />
    </header>
  );
}
```

## 自定義主題

```tsx
<MemberAuthHeader 
  theme={{
    background: 'bg-black',
    textColor: 'text-amber-100',
    buttonVariant: 'ghost',
    avatarBorder: 'ring-2 ring-amber-500/50',
    dropdownBackground: 'bg-zinc-900',
  }}
/>
```

## 自定義路由配置

```tsx
<MemberAuthHeader 
  config={{
    loginPath: '/login',
    dashboardPath: '/my-account',
    profilePath: '/my-account/settings',
    logoutRedirect: '/goodbye',
    showAdminEntry: false, // 隱藏管理員入口
  }}
/>
```

## 帶 Logo 使用

```tsx
<MemberAuthHeader 
  logo={
    <Link to="/" className="flex items-center gap-2">
      <img src="/logo.png" alt="Logo" className="h-8" />
      <span>我的品牌</span>
    </Link>
  }
/>
```

## 帶額外導航項目

```tsx
<MemberAuthHeader 
  extraNavItems={
    <nav className="flex gap-4 mr-4">
      <Link to="/products">產品</Link>
      <Link to="/about">關於</Link>
    </nav>
  }
/>
```

## 主題屬性說明

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `background` | string | `bg-background/95 backdrop-blur-sm` | 背景顏色類 |
| `textColor` | string | `text-foreground` | 文字顏色類 |
| `buttonVariant` | string | `outline` | 登入按鈕變體 |
| `avatarBorder` | string | `ring-2 ring-primary/20` | 頭像邊框樣式 |
| `dropdownBackground` | string | `bg-popover` | 下拉選單背景 |

## 配置屬性說明

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `loginPath` | string | `/auth/login` | 登入頁路徑 |
| `dashboardPath` | string | `/account` | 會員中心路徑 |
| `profilePath` | string | `/account/profile` | 個人資料路徑 |
| `logoutRedirect` | string | `/` | 登出後重導向 |
| `showAdminEntry` | boolean | `true` | 是否顯示管理員入口 |
| `adminPath` | string | `/dashboard` | 管理後台路徑 |

## 外部專案使用範例

```tsx
// 在獨立的遊戲專案中使用
import { MemberProvider, MemberAuthHeader } from '@hongling/member-sdk';

function GameApp() {
  return (
    <MemberProvider supabaseUrl="..." supabaseKey="...">
      <header className="bg-game-header">
        <MemberAuthHeader 
          theme={{
            background: 'bg-transparent',
            buttonVariant: 'default',
          }}
          config={{
            // 重導向回會員中心的絕對 URL
            dashboardPath: 'https://member.momo-chao.com/account',
            profilePath: 'https://member.momo-chao.com/account/profile',
          }}
          logo={<GameLogo />}
        />
      </header>
      <GameContent />
    </MemberProvider>
  );
}
```
