# Contributing to DocShow Platform

感謝您對 DocShow 專案的興趣！本文件說明如何參與貢獻。

Thank you for your interest in contributing to DocShow! This document explains how to contribute.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Security Guidelines](#security-guidelines)

---

## Code of Conduct

### 行為準則

- 尊重所有參與者，保持專業和友善的溝通
- 接受建設性批評，專注於改進程式碼品質
- 保護使用者隱私和資料安全

### Behavioral Guidelines

- Respect all participants and maintain professional, friendly communication
- Accept constructive criticism and focus on improving code quality
- Protect user privacy and data security

---

## Getting Started

### 環境設置 / Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd docshow-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### 專案結構 / Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── modules/        # Feature modules (e.g., member/)
├── pages/          # Route pages
├── lib/            # Utility libraries
└── integrations/   # External service integrations
```

---

## Development Workflow

### 分支策略 / Branch Strategy

| Branch Type | Naming Convention | Purpose |
|-------------|-------------------|---------|
| Feature | `feature/description` | New features |
| Bugfix | `fix/description` | Bug fixes |
| Hotfix | `hotfix/description` | Urgent production fixes |
| Refactor | `refactor/description` | Code improvements |

### 開發流程 / Development Flow

1. 從 `main` 分支建立新分支
2. 開發並測試變更
3. 提交 Pull Request
4. 通過 Code Review 後合併

---

## Code Standards

### TypeScript 規範

```typescript
// ✅ Good: 明確的類型定義
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
}

// ❌ Bad: 使用 any
const user: any = fetchUser();
```

### React 元件規範

```tsx
// ✅ Good: 使用函數元件和 TypeScript
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  children, 
  onClick 
}) => {
  return (
    <button 
      className={cn(buttonVariants({ variant }))} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Tailwind CSS 規範

```tsx
// ✅ Good: 使用設計系統 tokens
<div className="bg-background text-foreground border-border">

// ❌ Bad: 硬編碼顏色值
<div className="bg-white text-black border-gray-200">
```

### 檔案命名規範 / File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `UserTypes.ts` |
| Pages | PascalCase with `Page` suffix | `DashboardPage.tsx` |

### 目錄結構規範 / Directory Structure

```
src/modules/feature-name/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── pages/          # Feature pages
├── types/          # Type definitions
├── utils/          # Utility functions
└── index.ts        # Public exports
```

---

## Commit Guidelines

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型

| Type | Description |
|------|-------------|
| `feat` | 新功能 |
| `fix` | Bug 修復 |
| `docs` | 文件更新 |
| `style` | 程式碼格式（不影響邏輯） |
| `refactor` | 重構（不新增功能或修復 bug） |
| `perf` | 效能優化 |
| `test` | 測試相關 |
| `chore` | 建構/工具變更 |

### 範例

```bash
feat(member): add OAuth authorization page

- Implement OAuth 2.0 authorization flow
- Add consent UI for scope permissions
- Support redirect with authorization code

Closes #123
```

---

## Pull Request Process

### PR Checklist

- [ ] 程式碼符合專案規範
- [ ] 已新增/更新相關測試
- [ ] 已更新文件（如需要）
- [ ] 已更新 CHANGELOG.md
- [ ] 通過所有 CI 檢查

### PR 標題格式

```
[Type] Brief description

Examples:
[Feature] Add member dashboard entitlements view
[Fix] Resolve OAuth token expiration issue
[Docs] Update API documentation
```

### Code Review 注意事項

1. **安全性**: 檢查是否有潛在安全漏洞
2. **效能**: 確認沒有不必要的重複渲染或計算
3. **可讀性**: 程式碼是否易於理解
4. **可維護性**: 是否遵循 DRY 原則

---

## Security Guidelines

### 敏感資料處理

```typescript
// ✅ Good: 使用環境變數
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ Bad: 硬編碼敏感資訊
const apiKey = 'sk-1234567890';
```

### RLS 政策

所有資料表都必須啟用 Row Level Security (RLS) 並設定適當的政策。

### 輸入驗證

```typescript
// ✅ Good: 使用 Zod 驗證
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### XSS 防護

```typescript
// ✅ Good: 使用 DOMPurify 清理 HTML
import DOMPurify from 'dompurify';

const sanitizedHtml = DOMPurify.sanitize(userInput);
```

---

## 版本發布 / Release Process

1. 更新 `CHANGELOG.md` 中的版本號和日期
2. 執行版本更新腳本：`npm run version:update`
3. 建立 Release PR
4. 合併後建立 Git Tag

### 版本號規則 (Semantic Versioning)

- **MAJOR**: 不相容的 API 變更
- **MINOR**: 向後相容的新功能
- **PATCH**: 向後相容的 bug 修復

---

## 問題回報 / Issue Reporting

### Bug Report 模板

```markdown
**描述 / Description**
簡短描述問題

**重現步驟 / Steps to Reproduce**
1. 前往 '...'
2. 點擊 '...'
3. 看到錯誤

**預期行為 / Expected Behavior**
描述預期應該發生什麼

**實際行為 / Actual Behavior**
描述實際發生了什麼

**環境 / Environment**
- 瀏覽器: [e.g., Chrome 120]
- 作業系統: [e.g., macOS 14]
```

---

## 聯絡方式 / Contact

如有任何問題，請透過以下方式聯繫：

- 提交 GitHub Issue
- 發送郵件至專案維護者

---

感謝您的貢獻！ / Thank you for contributing! 🙏
