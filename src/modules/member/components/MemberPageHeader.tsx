/**
 * 會員頁面共用 Header 組件
 * 支援返回按鈕、品牌 Logo、頁面標題及右側插槽
 */

import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import logoHongling from "@/assets/logo-hongling.png";
import { Button } from "@/components/ui/button";

export interface MemberPageHeaderProps {
  /** 頁面標題 */
  title: string;
  /** 返回按鈕目標路徑（不設置則不顯示返回按鈕） */
  backTo?: string;
  /** 返回按鈕文字（預設：返回） */
  backLabel?: string;
  /** 是否顯示首頁按鈕（預設：false，僅在無 backTo 時顯示） */
  showHomeButton?: boolean;
  /** 右側插槽內容 */
  rightContent?: React.ReactNode;
  /** 自定義類名 */
  className?: string;
}

/**
 * 會員頁面共用 Header
 * 
 * @example
 * // 基本使用（主頁面，無返回按鈕）
 * <MemberPageHeader title="會員中心" showHomeButton rightContent={<UserMenu />} />
 * 
 * @example
 * // 子頁面（有返回按鈕）
 * <MemberPageHeader title="編輯個人資料" backTo="/account" />
 */
export function MemberPageHeader({
  title,
  backTo,
  backLabel = "返回",
  showHomeButton = false,
  rightContent,
  className = "",
}: MemberPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 ${className}`}>
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 返回按鈕 */}
          {backTo && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(backTo)}
                className="text-slate-400 hover:text-slate-200 px-2"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Button>
              <div className="h-6 w-px bg-slate-700/50" />
            </>
          )}

          {/* 品牌 Logo + 標題 */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img 
              src={logoHongling} 
              alt="虹靈御所" 
              className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block h-6 w-px bg-slate-700/50" />
            <span className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-amber-400 transition-colors">
              {title}
            </span>
          </Link>
        </div>

        {/* 右側內容區 */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* 首頁按鈕（僅在主頁面且無返回按鈕時顯示） */}
          {showHomeButton && !backTo && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-amber-400 h-8 w-8 sm:h-9 sm:w-9"
              title="返回首頁"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
          
          {/* 自定義右側內容 */}
          {rightContent}
        </div>
      </div>
    </header>
  );
}

export default MemberPageHeader;
