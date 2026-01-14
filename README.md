# DocShow - 文件展示平台

<div align="center">

**將 Word 文件轉換為精美的網頁展示，支援密碼保護分享與檔案追蹤**

[English](#english) | [繁體中文](#繁體中文)

</div>

---

## 繁體中文

### 📖 專案簡介

DocShow 是一個現代化的文件展示平台，專為將 Word 文件（.docx）轉換成美觀、互動式的網頁展示而設計。無論是商業提案、技術文件或教學材料，DocShow 都能幫助您以專業且優雅的方式線上分享文件。

### ✨ 核心功能

- **📄 文件上傳與解析**
  - 支援 .docx 格式的 Word 文件上傳
  - 智能解析文件結構，保留格式與樣式
  - 自動生成目錄結構（TOC）

- **🔐 安全分享機制**
  - 密碼保護功能，確保文件安全
  - 可設定分享連結的過期時間
  - 公開/私密連結控制

- **📊 檔案追蹤與統計**
  - 檢視次數統計
  - 檔案管理儀表板
  - 儲存空間使用量追蹤

- **👥 客戶管理系統**
  - 客戶資料管理（姓名、性別、生日、聯絡方式）
  - 與文件關聯客戶資訊
  - 客戶備註功能

- **💬 意見回饋系統**
  - 收集使用者意見
  - 回饋管理介面
  - 意見追蹤與分類

- **📝 線上文件編輯**
  - 支援線上編輯文件內容
  - 即時預覽
  - 版本控制

- **🎨 優雅的閱讀體驗**
  - 分頁式文件閱讀器
  - 響應式設計，支援各種裝置
  - 列印友善介面

### 🛠 技術架構

#### 前端技術
- **框架**: React 18.3
- **語言**: TypeScript
- **建置工具**: Vite 5.4
- **路由**: React Router DOM 6.30
- **狀態管理**: TanStack React Query 5.83
- **UI 元件庫**: shadcn/ui（基於 Radix UI）
- **樣式**: Tailwind CSS 3.4
- **表單處理**: React Hook Form + Zod
- **圖表**: Recharts 2.15
- **文件解析**: Mammoth.js

#### 後端服務
- **BaaS**: Supabase
  - 認證系統
  - PostgreSQL 資料庫
  - 檔案儲存
  - 即時訂閱

#### 開發工具
- **程式碼檢查**: ESLint 9
- **型別檢查**: TypeScript 5.8
- **圖示**: Lucide React

### 📦 安裝與設定

#### 環境需求
- Node.js 18+ 或 Bun
- npm 或 pnpm 或 bun

#### 安裝步驟

1. **克隆專案**
```bash
git clone <YOUR_GIT_URL>
cd chaos-life-compass
```

2. **安裝依賴**
```bash
npm install
# 或使用 bun
bun install
```

3. **設定環境變數**

在專案根目錄建立 `.env` 檔案：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. **啟動開發伺服器**
```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

### 🚀 使用指南

#### 基本流程

1. **註冊/登入**
   - 訪問 `/auth` 路徑進行認證
   - 使用 Email 註冊或登入

2. **上傳文件**
   - 在首頁拖放或選擇 .docx 檔案
   - 系統自動解析並儲存文件

3. **管理文件**
   - 在 `/files` 頁面查看所有上傳的文件
   - 編輯、分享或刪除文件
   - 查看統計資訊

4. **分享文件**
   - 點擊「分享」按鈕
   - 設定密碼（選填）
   - 設定過期時間（選填）
   - 複製分享連結

5. **檢視分享文件**
   - 訪問 `/view/:shareLink`
   - 輸入密碼（如有設定）
   - 閱讀文件內容

### 📁 專案結構

```
chaos-life-compass/
├── src/
│   ├── components/          # React 元件
│   │   ├── ui/             # shadcn/ui 基礎元件
│   │   ├── Header.tsx      # 頁首元件
│   │   ├── FileUploadZone.tsx  # 檔案上傳區
│   │   ├── PagedDocumentReader.tsx  # 文件閱讀器
│   │   └── ...
│   ├── modules/            # 功能模組（可獨立遷移）
│   │   └── member/         # 會員模組
│   │       ├── types/      # 型別定義
│   │       ├── context/    # 認證 Context
│   │       ├── hooks/      # 權限 Hooks
│   │       ├── utils/      # 驗證邏輯
│   │       ├── components/ # UI 元件
│   │       └── pages/      # 會員頁面
│   ├── pages/              # 頁面元件
│   │   ├── Index.tsx       # 首頁（上傳）
│   │   ├── FilesPage.tsx   # 檔案管理
│   │   ├── ViewPage.tsx    # 文件檢視
│   │   ├── CustomersPage.tsx   # 客戶管理
│   │   ├── FeedbacksPage.tsx   # 意見回饋
│   │   └── ...
│   ├── hooks/              # 自訂 Hooks
│   │   ├── useAuth.tsx     # 認證 Hook
│   │   ├── useDocuments.tsx    # 文件管理 Hook
│   │   └── ...
│   ├── lib/                # 工具函式
│   │   ├── parseDocx.ts    # Word 文件解析
│   │   └── utils.ts        # 通用工具
│   ├── integrations/       # 第三方整合
│   │   └── supabase/       # Supabase 設定
│   ├── types/              # TypeScript 型別定義
│   ├── App.tsx             # 主應用元件
│   └── main.tsx            # 應用入口點
├── supabase/               # Supabase 設定與遷移
│   ├── functions/          # Edge Functions
│   ├── migrations/         # 資料庫遷移檔案
│   └── config.toml         # Supabase 設定
├── docs/                   # 技術文檔
│   ├── migration/          # 會員中心遷移資源
│   ├── sdk/                # SDK 文檔與範例
│   ├── MEMBER_CENTER_ARCHITECTURE.md
│   ├── UNIFIED_MEMBER_SDK.md
│   └── ENTITLEMENTS_API.md
├── public/                 # 靜態資源
├── index.html              # HTML 範本
├── package.json            # 專案依賴
├── vite.config.ts          # Vite 設定
├── tailwind.config.ts      # Tailwind CSS 設定
└── tsconfig.json           # TypeScript 設定
```

### 🔧 開發指令

```bash
# 開發模式
npm run dev

# 建置專案
npm run build

# 建置（開發模式）
npm run build:dev

# 程式碼檢查
npm run lint

# 預覽建置結果
npm run preview
```

### 📝 資料庫結構

主要資料表：
- `documents` - 文件資料
- `customers` - 客戶資料
- `feedbacks` - 意見回饋
- `profiles` - 會員資料
- `user_roles` - 用戶角色
- `products` - 產品定義
- `plans` - 方案定義
- `entitlements` - 權限記錄
- `oauth_clients` - OAuth 客戶端
- `api_keys` - API 金鑰

### 🔒 安全性考量

- 使用 Supabase Row Level Security (RLS) 保護資料
- 密碼加密儲存（pgcrypto）
- 分享連結唯一性驗證
- 檔案上傳大小限制
- XSS 防護（使用 DOMPurify）
- API Key 驗證機制
- OAuth 2.0 授權流程

### 👤 會員模組架構

會員系統採用模組化設計，位於 `src/modules/member/`，支援未來獨立遷移至專屬會員中心專案。

#### 模組結構

```
src/modules/member/
├── index.ts              # 統一匯出入口
├── README.md             # 模組使用說明
├── types/
│   └── index.ts          # Profile、Entitlement、OAuth 等型別
├── context/
│   └── MemberContext.tsx # 認證狀態管理 Provider
├── hooks/
│   └── useEntitlements.ts # 權限查詢與管理 Hooks
├── utils/
│   └── validation.ts      # Zod 表單驗證邏輯
├── components/
│   ├── MemberProtectedRoute.tsx  # 保護路由
│   ├── MemberCardSkeleton.tsx    # 載入骨架
│   ├── MemberLoginWidget.tsx     # 登入元件
│   └── OAuthAuthorizePage.tsx    # OAuth 授權頁
└── pages/
    ├── UnifiedAuthPage.tsx       # 統一登入頁
    ├── UnifiedDashboard.tsx      # 會員儀表板
    └── UnifiedProfilePage.tsx    # 個人資料頁
```

#### 使用方式

```tsx
// 從模組根目錄匯入
import { 
  MemberProvider, 
  useMember, 
  useProducts,
  useMyEntitlements,
  MemberProtectedRoute,
  validateLoginForm,
} from '@/modules/member';

// 型別匯入
import type { Profile, Entitlement, Product } from '@/modules/member';
```

#### 核心功能

| 功能 | 說明 |
|------|------|
| 認證管理 | Email/Google 登入、密碼重設 |
| 權限系統 | 多產品權限、時效控制、管理介面 |
| OAuth Provider | 提供外部專案授權登入 |
| API 驗證 | API Key 機制供外部專案呼叫 |

### 🔮 會員中心遷移計畫

會員模組設計為可獨立遷移至專屬會員中心專案，實現品牌生態系的統一身份認證。

#### 架構願景

```
┌─────────────────────────────────────────────────────────┐
│                    會員中心 (獨立專案)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   認證系統   │  │   權限系統   │  │  OAuth 2.0  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                         │                                │
│                    REST API                              │
└─────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │  主站     │        │  遊戲站   │        │  卜卦站   │
    │ DocShow  │        │ 命理遊戲  │        │ 元壹宇宙  │
    └──────────┘        └──────────┘        └──────────┘
```

#### 遷移資源

| 文件 | 說明 |
|------|------|
| `docs/MEMBER_CENTER_ARCHITECTURE.md` | 完整架構設計文檔 |
| `docs/migration/MEMBER_CENTER_MIGRATION.md` | 遷移步驟指南 |
| `docs/migration/schema.sql` | 資料庫 Schema |
| `docs/migration/edge-functions/` | Edge Functions 程式碼 |
| `docs/migration/DATA_MIGRATION.md` | 資料遷移指南 |
| `docs/UNIFIED_MEMBER_SDK.md` | SDK 整合文檔 |
| `docs/ENTITLEMENTS_API.md` | API 參考文檔 |

#### 遷移階段

1. **準備階段**（已完成）
   - ✅ 會員模組化重構
   - ✅ API 端點設計
   - ✅ 遷移文檔準備

2. **建立階段**
   - 在 Lovable 建立新專案
   - 部署資料庫 Schema
   - 部署 Edge Functions

3. **遷移階段**
   - 匯出現有會員資料
   - 建立用戶對照表
   - 匯入至新會員中心

4. **整合階段**
   - 主站改用 API 驗證
   - 更新外部專案整合
   - 雙寫模式過渡

5. **切換階段**
   - 完全切換至新會員中心
   - 移除主站會員相關表
   - 監控與優化

### 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

1. Fork 本專案
2. 建立您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 📄 授權

本專案採用 MIT 授權條款

---

## English

### 📖 Project Overview

DocShow is a modern document display platform designed to convert Word documents (.docx) into beautiful, interactive web presentations. Whether it's business proposals, technical documentation, or educational materials, DocShow helps you share documents online in a professional and elegant manner.

### ✨ Key Features

- **📄 Document Upload & Parsing**
  - Support for .docx Word document uploads
  - Intelligent document structure parsing with preserved formatting
  - Automatic Table of Contents (TOC) generation

- **🔐 Secure Sharing**
  - Password protection for document security
  - Configurable link expiration dates
  - Public/private link control

- **📊 File Tracking & Analytics**
  - View count statistics
  - File management dashboard
  - Storage usage tracking

- **👥 Customer Management**
  - Customer data management (name, gender, birth date, contact info)
  - Associate customers with documents
  - Customer notes functionality

- **💬 Feedback System**
  - Collect user feedback
  - Feedback management interface
  - Feedback tracking and categorization

- **📝 Online Document Editing**
  - Support for online content editing
  - Real-time preview
  - Version control

- **🎨 Elegant Reading Experience**
  - Paginated document reader
  - Responsive design for all devices
  - Print-friendly interface

### 🛠 Technology Stack

#### Frontend
- **Framework**: React 18.3
- **Language**: TypeScript
- **Build Tool**: Vite 5.4
- **Routing**: React Router DOM 6.30
- **State Management**: TanStack React Query 5.83
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS 3.4
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts 2.15
- **Document Parsing**: Mammoth.js

#### Backend
- **BaaS**: Supabase
  - Authentication
  - PostgreSQL Database
  - File Storage
  - Real-time Subscriptions

#### Development Tools
- **Linting**: ESLint 9
- **Type Checking**: TypeScript 5.8
- **Icons**: Lucide React

### 📦 Installation & Setup

#### Prerequisites
- Node.js 18+ or Bun
- npm or pnpm or bun

#### Installation Steps

1. **Clone the Repository**
```bash
git clone <YOUR_GIT_URL>
cd chaos-life-compass
```

2. **Install Dependencies**
```bash
npm install
# or using bun
bun install
```

3. **Configure Environment Variables**

Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. **Start Development Server**
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 🚀 Usage Guide

#### Basic Workflow

1. **Register/Login**
   - Visit `/auth` route for authentication
   - Register or login with Email

2. **Upload Documents**
   - Drag and drop or select .docx files on the homepage
   - System automatically parses and stores documents

3. **Manage Documents**
   - View all uploaded documents on `/files` page
   - Edit, share, or delete documents
   - View statistics

4. **Share Documents**
   - Click "Share" button
   - Set password (optional)
   - Set expiration date (optional)
   - Copy share link

5. **View Shared Documents**
   - Visit `/view/:shareLink`
   - Enter password (if set)
   - Read document content

### 📁 Project Structure

```
chaos-life-compass/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── Header.tsx      # Header component
│   │   ├── FileUploadZone.tsx  # File upload zone
│   │   ├── PagedDocumentReader.tsx  # Document reader
│   │   └── ...
│   ├── modules/            # Feature modules (independently migratable)
│   │   └── member/         # Member module
│   │       ├── types/      # Type definitions
│   │       ├── context/    # Auth Context
│   │       ├── hooks/      # Entitlement Hooks
│   │       ├── utils/      # Validation logic
│   │       ├── components/ # UI components
│   │       └── pages/      # Member pages
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Homepage (upload)
│   │   ├── FilesPage.tsx   # File management
│   │   ├── ViewPage.tsx    # Document view
│   │   ├── CustomersPage.tsx   # Customer management
│   │   ├── FeedbacksPage.tsx   # Feedback management
│   │   └── ...
│   ├── hooks/              # Custom Hooks
│   │   ├── useAuth.tsx     # Authentication Hook
│   │   ├── useDocuments.tsx    # Document management Hook
│   │   └── ...
│   ├── lib/                # Utility functions
│   │   ├── parseDocx.ts    # Word document parser
│   │   └── utils.ts        # Common utilities
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase configuration
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── supabase/               # Supabase config & migrations
│   ├── functions/          # Edge Functions
│   ├── migrations/         # Database migration files
│   └── config.toml         # Supabase configuration
├── docs/                   # Technical documentation
│   ├── migration/          # Member center migration resources
│   ├── sdk/                # SDK documentation & examples
│   ├── MEMBER_CENTER_ARCHITECTURE.md
│   ├── UNIFIED_MEMBER_SDK.md
│   └── ENTITLEMENTS_API.md
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

### 🔧 Development Commands

```bash
# Development mode
npm run dev

# Build project
npm run build

# Build (development mode)
npm run build:dev

# Lint code
npm run lint

# Preview build
npm run preview
```

### 📝 Database Schema

Main Tables:
- `documents` - Document data
- `customers` - Customer data
- `feedbacks` - User feedback
- `profiles` - Member profiles
- `user_roles` - User roles
- `products` - Product definitions
- `plans` - Plan definitions
- `entitlements` - Entitlement records
- `oauth_clients` - OAuth clients
- `api_keys` - API keys

### 🔒 Security Considerations

- Supabase Row Level Security (RLS) for data protection
- Encrypted password storage (pgcrypto)
- Unique share link validation
- File upload size limits
- XSS protection (using DOMPurify)
- API Key authentication mechanism
- OAuth 2.0 authorization flow

### 👤 Member Module Architecture

The member system is designed with a modular architecture located at `src/modules/member/`, supporting future migration to an independent member center project.

#### Module Structure

```
src/modules/member/
├── index.ts              # Unified export entry
├── README.md             # Module usage guide
├── types/
│   └── index.ts          # Profile, Entitlement, OAuth types
├── context/
│   └── MemberContext.tsx # Auth state management Provider
├── hooks/
│   └── useEntitlements.ts # Entitlement query & management Hooks
├── utils/
│   └── validation.ts      # Zod form validation logic
├── components/
│   ├── MemberProtectedRoute.tsx  # Protected routes
│   ├── MemberCardSkeleton.tsx    # Loading skeleton
│   ├── MemberLoginWidget.tsx     # Login widget
│   └── OAuthAuthorizePage.tsx    # OAuth authorization page
└── pages/
    ├── UnifiedAuthPage.tsx       # Unified login page
    ├── UnifiedDashboard.tsx      # Member dashboard
    └── UnifiedProfilePage.tsx    # Profile page
```

#### Usage

```tsx
// Import from module root
import { 
  MemberProvider, 
  useMember, 
  useProducts,
  useMyEntitlements,
  MemberProtectedRoute,
  validateLoginForm,
} from '@/modules/member';

// Type imports
import type { Profile, Entitlement, Product } from '@/modules/member';
```

#### Core Features

| Feature | Description |
|---------|-------------|
| Auth Management | Email/Google login, password reset |
| Entitlement System | Multi-product entitlements, time-based access, management UI |
| OAuth Provider | Provides authorization for external projects |
| API Authentication | API Key mechanism for external project calls |

### 🔮 Member Center Migration Plan

The member module is designed to be independently migrated to a dedicated Member Center project, enabling unified identity authentication across the brand ecosystem.

#### Architecture Vision

```
┌─────────────────────────────────────────────────────────┐
│                 Member Center (Independent Project)      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │    Auth     │  │ Entitlement │  │  OAuth 2.0  │      │
│  │   System    │  │   System    │  │             │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                         │                                │
│                    REST API                              │
└─────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ Main Site│        │  Games   │        │Divination│
    │ DocShow  │        │  Site    │        │  Site    │
    └──────────┘        └──────────┘        └──────────┘
```

#### Migration Resources

| Document | Description |
|----------|-------------|
| `docs/MEMBER_CENTER_ARCHITECTURE.md` | Complete architecture design |
| `docs/migration/MEMBER_CENTER_MIGRATION.md` | Migration steps guide |
| `docs/migration/schema.sql` | Database schema |
| `docs/migration/edge-functions/` | Edge Functions code |
| `docs/migration/DATA_MIGRATION.md` | Data migration guide |
| `docs/UNIFIED_MEMBER_SDK.md` | SDK integration documentation |
| `docs/ENTITLEMENTS_API.md` | API reference documentation |

#### Migration Phases

1. **Preparation Phase** (Completed)
   - ✅ Member module refactoring
   - ✅ API endpoint design
   - ✅ Migration documentation

2. **Setup Phase**
   - Create new project in Lovable
   - Deploy database schema
   - Deploy Edge Functions

3. **Migration Phase**
   - Export existing member data
   - Create user mapping table
   - Import to new member center

4. **Integration Phase**
   - Switch main site to API authentication
   - Update external project integrations
   - Dual-write mode transition

5. **Cutover Phase**
   - Fully switch to new member center
   - Remove member-related tables from main site
   - Monitoring & optimization

### 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License
