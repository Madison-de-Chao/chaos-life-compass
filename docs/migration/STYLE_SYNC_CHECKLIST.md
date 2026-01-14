# 會員系統樣式同步清單

> 本文件列出從主專案同步到獨立會員中心所需的完整樣式配置

## 📋 同步總覽

| 類別 | 檔案 | 優先級 |
|------|------|--------|
| CSS 變數 | `src/index.css` | P0 必須 |
| Tailwind 配置 | `tailwind.config.ts` | P0 必須 |
| 字型引入 | Google Fonts | P0 必須 |
| 3D 效果 | 自定義 CSS 類別 | P1 建議 |
| 動畫效果 | Keyframes + Utilities | P1 建議 |
| 文件樣式 | Document Content | P2 可選 |

---

## 🎨 1. CSS 變數（必須同步）

### 1.1 字型引入
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
```

### 1.2 亮色模式 (Light Theme)
```css
:root {
  /* Warm, elegant color palette */
  --background: 40 33% 98%;
  --foreground: 30 10% 15%;

  --card: 40 30% 99%;
  --card-foreground: 30 10% 15%;

  --popover: 40 30% 99%;
  --popover-foreground: 30 10% 15%;

  /* Warm copper/amber primary */
  --primary: 25 80% 45%;
  --primary-foreground: 40 33% 98%;

  /* Soft cream secondary */
  --secondary: 40 25% 92%;
  --secondary-foreground: 30 10% 25%;

  --muted: 40 20% 94%;
  --muted-foreground: 30 8% 45%;

  /* Warm accent */
  --accent: 35 60% 88%;
  --accent-foreground: 25 70% 30%;

  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;

  --border: 35 20% 88%;
  --input: 35 20% 88%;
  --ring: 25 80% 45%;

  --radius: 0.75rem;

  /* Custom gradient tokens */
  --gradient-warm: linear-gradient(135deg, hsl(40, 33%, 98%) 0%, hsl(35, 30%, 94%) 100%);
  --gradient-hero: linear-gradient(180deg, hsl(40, 33%, 98%) 0%, hsl(35, 25%, 92%) 50%, hsl(40, 33%, 98%) 100%);
  --gradient-card: linear-gradient(145deg, hsl(40, 30%, 99%) 0%, hsl(38, 28%, 96%) 100%);
  --gradient-accent: linear-gradient(135deg, hsl(25, 80%, 45%) 0%, hsl(35, 70%, 50%) 100%);
  
  /* Custom shadow tokens */
  --shadow-soft: 0 4px 20px -4px hsl(30 20% 20% / 0.08);
  --shadow-elevated: 0 12px 40px -8px hsl(30 20% 20% / 0.12);
  --shadow-glow: 0 0 40px hsl(25 80% 45% / 0.15);

  /* Font tokens */
  --font-serif: 'Noto Serif TC', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Sidebar tokens */
  --sidebar-background: 40 25% 96%;
  --sidebar-foreground: 30 10% 25%;
  --sidebar-primary: 25 80% 45%;
  --sidebar-primary-foreground: 40 33% 98%;
  --sidebar-accent: 35 25% 90%;
  --sidebar-accent-foreground: 30 10% 25%;
  --sidebar-border: 35 20% 88%;
  --sidebar-ring: 25 80% 45%;
}
```

### 1.3 深色模式 (Dark Theme) - 奢華黑金主題
```css
.dark {
  --background: 30 15% 8%;
  --foreground: 40 20% 92%;

  --card: 30 12% 12%;
  --card-foreground: 40 20% 92%;

  --popover: 30 12% 12%;
  --popover-foreground: 40 20% 92%;

  --primary: 30 70% 55%;
  --primary-foreground: 30 15% 8%;

  --secondary: 30 10% 18%;
  --secondary-foreground: 40 20% 85%;

  --muted: 30 10% 18%;
  --muted-foreground: 35 15% 55%;

  --accent: 30 15% 22%;
  --accent-foreground: 35 60% 70%;

  --destructive: 0 62% 45%;
  --destructive-foreground: 0 0% 100%;

  --border: 30 10% 20%;
  --input: 30 10% 20%;
  --ring: 30 70% 55%;

  /* Dark gradient tokens */
  --gradient-warm: linear-gradient(135deg, hsl(30, 15%, 8%) 0%, hsl(30, 12%, 12%) 100%);
  --gradient-hero: linear-gradient(180deg, hsl(30, 15%, 8%) 0%, hsl(30, 12%, 14%) 50%, hsl(30, 15%, 8%) 100%);
  --gradient-card: linear-gradient(145deg, hsl(30, 12%, 12%) 0%, hsl(30, 10%, 15%) 100%);
  --gradient-accent: linear-gradient(135deg, hsl(30, 70%, 55%) 0%, hsl(35, 65%, 60%) 100%);
  
  --shadow-soft: 0 4px 20px -4px hsl(0 0% 0% / 0.3);
  --shadow-elevated: 0 12px 40px -8px hsl(0 0% 0% / 0.4);
  --shadow-glow: 0 0 40px hsl(30 70% 55% / 0.2);

  /* Sidebar dark tokens */
  --sidebar-background: 30 12% 10%;
  --sidebar-foreground: 40 20% 85%;
  --sidebar-primary: 30 70% 55%;
  --sidebar-primary-foreground: 30 15% 8%;
  --sidebar-accent: 30 10% 16%;
  --sidebar-accent-foreground: 40 20% 85%;
  --sidebar-border: 30 10% 18%;
  --sidebar-ring: 30 70% 55%;
}
```

### 1.4 超烜創意主題 (Chaoxuan Theme)
```css
.theme-chaoxuan {
  --primary: 42 90% 50%;
  --primary-foreground: 30 15% 10%;
  --accent: 42 70% 85%;
  --accent-foreground: 42 80% 25%;
  --ring: 42 90% 50%;
  --gradient-accent: linear-gradient(135deg, hsl(42, 90%, 50%) 0%, hsl(35, 85%, 55%) 100%);
  --shadow-glow: 0 0 40px hsl(42 90% 50% / 0.2);
}

.dark .theme-chaoxuan {
  --primary: 42 85% 55%;
  --primary-foreground: 30 15% 8%;
  --accent: 42 40% 25%;
  --accent-foreground: 42 70% 75%;
  --ring: 42 85% 55%;
  --gradient-accent: linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(38, 80%, 60%) 100%);
  --shadow-glow: 0 0 40px hsl(42 85% 55% / 0.25);
}
```

---

## ⚙️ 2. Tailwind 配置（必須同步）

### 2.1 字型系統
```typescript
fontFamily: {
  serif: ["'Noto Serif TC'", "Georgia", "serif"],
  sans: ["'Inter'", "system-ui", "sans-serif"],
  display: ["'Cormorant Garamond'", "'Noto Serif TC'", "Georgia", "serif"],
},
```

### 2.2 自訂陰影
```typescript
boxShadow: {
  soft: "var(--shadow-soft)",
  elevated: "var(--shadow-elevated)",
  glow: "var(--shadow-glow)",
},
```

### 2.3 完整動畫 Keyframes
```typescript
keyframes: {
  // 基礎動畫
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  "fade-in": {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  "slide-up": {
    from: { opacity: "0", transform: "translateY(20px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "slide-in-left": {
    from: { opacity: "0", transform: "translateX(-60px)" },
    to: { opacity: "1", transform: "translateX(0)" },
  },
  "slide-in-right": {
    from: { opacity: "0", transform: "translateX(60px)" },
    to: { opacity: "1", transform: "translateX(0)" },
  },
  "scale-in": {
    from: { opacity: "0", transform: "scale(0.9)" },
    to: { opacity: "1", transform: "scale(1)" },
  },
  
  // 頁面翻轉動畫
  "page-flip-in-left": {
    "0%": { opacity: "0", transform: "translateX(-80px) scale(0.95)", filter: "blur(4px)" },
    "100%": { opacity: "1", transform: "translateX(0) scale(1)", filter: "blur(0)" },
  },
  "page-flip-in-right": {
    "0%": { opacity: "0", transform: "translateX(80px) scale(0.95)", filter: "blur(4px)" },
    "100%": { opacity: "1", transform: "translateX(0) scale(1)", filter: "blur(0)" },
  },
  "page-flip-out-left": {
    "0%": { opacity: "1", transform: "translateX(0) scale(1)" },
    "100%": { opacity: "0", transform: "translateX(-80px) scale(0.95)" },
  },
  "page-flip-out-right": {
    "0%": { opacity: "1", transform: "translateX(0) scale(1)" },
    "100%": { opacity: "0", transform: "translateX(80px) scale(0.95)" },
  },
  
  // 封面揭示動畫
  "cover-reveal": {
    "0%": { opacity: "0", transform: "scale(0.6) rotateY(-15deg)", filter: "blur(10px)" },
    "50%": { opacity: "0.8", transform: "scale(1.05) rotateY(5deg)", filter: "blur(0px)" },
    "100%": { opacity: "1", transform: "scale(1) rotateY(0deg)", filter: "blur(0px)" },
  },
  
  // 浮動效果
  "float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-12px)" },
  },
  "float-slow": {
    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
    "50%": { transform: "translateY(-20px) rotate(3deg)" },
  },
  
  // 發光脈衝
  "glow-pulse": {
    "0%, 100%": { boxShadow: "0 0 30px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.15)" },
    "50%": { boxShadow: "0 0 50px hsl(var(--primary) / 0.5), 0 0 100px hsl(var(--primary) / 0.25)" },
  },
  
  // 閃爍效果
  "shimmer": {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
  
  // 呼吸效果
  "breathe": {
    "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
    "50%": { opacity: "0.7", transform: "scale(1.02)" },
  },
  
  // 漸層偏移
  "gradient-shift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  
  // 旋轉效果
  "rotate-slow": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "orbit": {
    "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
    "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
  },
  
  // 環形脈衝
  "pulse-ring": {
    "0%": { transform: "scale(0.8)", opacity: "1" },
    "100%": { transform: "scale(2)", opacity: "0" },
  },
  
  // 輕彈跳
  "bounce-soft": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-8px)" },
  },
  
  // 文字發光
  "text-glow": {
    "0%, 100%": { textShadow: "0 0 20px rgba(251, 191, 36, 0.3)" },
    "50%": { textShadow: "0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3)" },
  },
  
  // 卡片懸停
  "card-hover": {
    "0%": { transform: "translateY(0) scale(1)" },
    "100%": { transform: "translateY(-8px) scale(1.02)" },
  },
  
  // 對話框動畫
  "dialog-enter": {
    "0%": { opacity: "0", transform: "translate(-50%, -48%) scale(0.9)", filter: "blur(4px)" },
    "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)", filter: "blur(0)" },
  },
  "dialog-exit": {
    "0%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)", filter: "blur(0)" },
    "100%": { opacity: "0", transform: "translate(-50%, -48%) scale(0.95)", filter: "blur(4px)" },
  },
  
  // 下滑動畫
  "slide-down": {
    "0%": { opacity: "0", transform: "translateY(-10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
},
```

### 2.4 動畫類別對應
```typescript
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.6s ease-out forwards",
  "slide-up": "slide-up 0.5s ease-out forwards",
  "slide-in-left": "slide-in-left 0.6s ease-out forwards",
  "slide-in-right": "slide-in-right 0.6s ease-out forwards",
  "scale-in": "scale-in 0.5s ease-out forwards",
  "page-flip-in-left": "page-flip-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
  "page-flip-in-right": "page-flip-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
  "page-flip-out-left": "page-flip-out-left 0.3s ease-in forwards",
  "page-flip-out-right": "page-flip-out-right 0.3s ease-in forwards",
  "cover-reveal": "cover-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
  "float": "float 4s ease-in-out infinite",
  "float-slow": "float-slow 6s ease-in-out infinite",
  "glow-pulse": "glow-pulse 3s ease-in-out infinite",
  "shimmer": "shimmer 3s linear infinite",
  "breathe": "breathe 6s ease-in-out infinite",
  "gradient-shift": "gradient-shift 8s ease infinite",
  "rotate-slow": "rotate-slow 20s linear infinite",
  "orbit": "orbit 15s linear infinite",
  "pulse-ring": "pulse-ring 2s ease-out infinite",
  "bounce-soft": "bounce-soft 2s ease-in-out infinite",
  "text-glow": "text-glow 3s ease-in-out infinite",
  "card-hover": "card-hover 0.3s ease-out forwards",
  "dialog-enter": "dialog-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
  "dialog-exit": "dialog-exit 0.25s ease-in forwards",
  "slide-down": "slide-down 0.4s ease-out forwards",
},
```

---

## ✨ 3. 特效類別（建議同步）

### 3.1 3D 卡片效果
```css
/* 3D Card Flip Effects */
.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* 3D Hover Card Effect */
.card-3d {
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
  transform-style: preserve-3d;
}

.card-3d:hover {
  transform: rotateY(8deg) rotateX(5deg) translateZ(30px);
}
```

### 3.2 發光邊框動畫
```css
@keyframes glow-border {
  0%, 100% {
    box-shadow: 
      0 0 5px rgba(251, 191, 36, 0.3),
      0 0 10px rgba(251, 191, 36, 0.2),
      0 0 20px rgba(251, 191, 36, 0.1),
      inset 0 0 5px rgba(251, 191, 36, 0.05);
  }
  50% {
    box-shadow: 
      0 0 10px rgba(251, 191, 36, 0.5),
      0 0 20px rgba(251, 191, 36, 0.4),
      0 0 40px rgba(251, 191, 36, 0.2),
      inset 0 0 10px rgba(251, 191, 36, 0.1);
  }
}

.glow-border-amber {
  animation: glow-border 2s ease-in-out infinite;
}
```

### 3.3 光澤掃過效果
```css
@keyframes shine-sweep {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}

.shine-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%) skewX(-15deg);
  z-index: 10;
  pointer-events: none;
}

.shine-effect:hover::before {
  animation: shine-sweep 0.8s ease-out;
}
```

### 3.4 脈衝發光效果
```css
@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.7));
  }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### 3.5 霓虹閃爍效果
```css
@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow: 
      0 0 4px #fff,
      0 0 11px #fff,
      0 0 19px #fff,
      0 0 40px #fbbf24,
      0 0 80px #fbbf24;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}
```

### 3.6 彩虹邊框動畫
```css
@keyframes rainbow-border {
  0% { border-color: rgba(251, 191, 36, 0.5); }
  25% { border-color: rgba(168, 85, 247, 0.5); }
  50% { border-color: rgba(59, 130, 246, 0.5); }
  75% { border-color: rgba(16, 185, 129, 0.5); }
  100% { border-color: rgba(251, 191, 36, 0.5); }
}
```

---

## 📄 4. 基礎樣式設定

### 4.1 全域基礎
```css
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: var(--font-sans);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
  }
}
```

### 4.2 漸層輔助類別
```css
.gradient-warm {
  background: var(--gradient-warm);
}

.gradient-hero {
  background: var(--gradient-hero);
}

.gradient-card {
  background: var(--gradient-card);
}

.gradient-accent {
  background: var(--gradient-accent);
}
```

### 4.3 陰影輔助類別
```css
.shadow-soft {
  box-shadow: var(--shadow-soft);
}

.shadow-elevated {
  box-shadow: var(--shadow-elevated);
}

.shadow-glow {
  box-shadow: var(--shadow-glow);
}
```

### 4.4 字型輔助類別
```css
.font-serif {
  font-family: var(--font-serif);
}

.font-sans {
  font-family: var(--font-sans);
}
```

---

## 🔧 5. 快速同步指令

### 完整同步
```bash
# 從主專案複製完整樣式檔案
cp src/index.css ../member-center/src/index.css
cp tailwind.config.ts ../member-center/tailwind.config.ts
```

### 驗證清單
- [ ] Google Fonts 已正確引入
- [ ] 亮色模式 CSS 變數完整
- [ ] 深色模式 CSS 變數完整
- [ ] Tailwind 字型配置正確
- [ ] 所有 keyframes 已複製
- [ ] 所有 animation 類別已對應
- [ ] 3D 效果類別已加入
- [ ] 發光效果已同步
- [ ] 漸層輔助類別可用
- [ ] 陰影輔助類別可用

---

## 📦 6. 必要依賴

確保新專案已安裝：
```json
{
  "dependencies": {
    "tailwindcss-animate": "^1.0.7"
  }
}
```

Tailwind plugins 設定：
```typescript
plugins: [require("tailwindcss-animate")],
```

---

## 🎯 7. 會員頁面專用樣式

### UnifiedAuthPage 關鍵樣式
- 背景：`bg-[#080808]` (深黑底色)
- 金色強調：`#c9a962` / `amber-500`
- 噪點紋理覆蓋層
- 浮動粒子動畫
- 產品輪播動畫

### MemberAuthHeader 關鍵樣式
```typescript
// 奢華黑金主題配置
const luxuryBlackGoldTheme = {
  background: "bg-black/80 backdrop-blur-xl border-b border-amber-500/20",
  textColor: "text-white",
  buttonVariant: "outline" as const,
  buttonClassName: "border-amber-500/50 text-amber-400 hover:bg-amber-500/10",
  avatarBorder: "ring-2 ring-amber-500/50",
};
```

---

*文件版本：v1.0*
*最後更新：2026-01-14*
