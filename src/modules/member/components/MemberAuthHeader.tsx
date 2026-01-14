/**
 * 可共享的認證表頭組件
 * 設計為可換膚、可配置，供所有生態系統專案使用
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Shield, LayoutDashboard } from 'lucide-react';
import { useMember } from '../context/MemberContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export interface MemberAuthHeaderTheme {
  /** 背景顏色類 */
  background?: string;
  /** 文字顏色類 */
  textColor?: string;
  /** 按鈕變體 */
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  /** 頭像邊框顏色 */
  avatarBorder?: string;
  /** 下拉選單背景 */
  dropdownBackground?: string;
}

export interface MemberAuthHeaderConfig {
  /** 登入頁路徑 */
  loginPath?: string;
  /** 會員中心路徑 */
  dashboardPath?: string;
  /** 個人資料路徑 */
  profilePath?: string;
  /** 登出後重導向路徑 */
  logoutRedirect?: string;
  /** 是否顯示管理員入口（僅對管理員顯示） */
  showAdminEntry?: boolean;
  /** 管理後台路徑 */
  adminPath?: string;
}

export interface MemberAuthHeaderProps {
  /** 主題配置 */
  theme?: MemberAuthHeaderTheme;
  /** 路由配置 */
  config?: MemberAuthHeaderConfig;
  /** Logo 組件（可選） */
  logo?: React.ReactNode;
  /** 額外的導航項目（可選） */
  extraNavItems?: React.ReactNode;
  /** 自定義類名 */
  className?: string;
}

const defaultTheme: MemberAuthHeaderTheme = {
  background: 'bg-background/95 backdrop-blur-sm',
  textColor: 'text-foreground',
  buttonVariant: 'outline',
  avatarBorder: 'ring-2 ring-primary/20',
  dropdownBackground: 'bg-popover',
};

const defaultConfig: MemberAuthHeaderConfig = {
  loginPath: '/auth/login',
  dashboardPath: '/account',
  profilePath: '/account/profile',
  logoutRedirect: '/',
  showAdminEntry: true,
  adminPath: '/dashboard',
};

/**
 * 可共享的會員認證表頭組件
 * 
 * @example
 * // 基本使用
 * <MemberAuthHeader />
 * 
 * @example
 * // 自定義主題
 * <MemberAuthHeader 
 *   theme={{ 
 *     background: 'bg-black', 
 *     textColor: 'text-amber-100' 
 *   }} 
 * />
 * 
 * @example
 * // 自定義路由配置
 * <MemberAuthHeader 
 *   config={{ 
 *     loginPath: '/login', 
 *     dashboardPath: '/my-account' 
 *   }} 
 * />
 */
export function MemberAuthHeader({
  theme = {},
  config = {},
  logo,
  extraNavItems,
  className = '',
}: MemberAuthHeaderProps) {
  const navigate = useNavigate();
  const { user, profile, loading, isAdmin, isHelper, signOut } = useMember();
  
  const mergedTheme = { ...defaultTheme, ...theme };
  const mergedConfig = { ...defaultConfig, ...config };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('已登出');
      navigate(mergedConfig.logoutRedirect || '/');
    } catch (error) {
      toast.error('登出失敗，請重試');
    }
  };

  const getDisplayName = () => {
    if (profile?.nickname) return profile.nickname;
    if (profile?.display_name) return profile.display_name;
    if (user?.email) return user.email.split('@')[0];
    return '會員';
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const showAdminButton = mergedConfig.showAdminEntry && (isAdmin || isHelper);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo 插槽 */}
      {logo}

      {/* 額外導航項目插槽 */}
      {extraNavItems}

      {/* 認證狀態區域 */}
      {loading ? (
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      ) : user ? (
        <div className="flex items-center gap-2">
          {/* 管理員/小幫手快捷入口 */}
          {showAdminButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(mergedConfig.adminPath || '/dashboard')}
              className="hidden sm:flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs">{isAdmin ? '管理後台' : '小幫手'}</span>
            </Button>
          )}

          {/* 用戶下拉選單 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`relative h-10 w-10 rounded-full ${mergedTheme.avatarBorder}`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={profile?.avatar_url || undefined} 
                    alt={getDisplayName()} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={`w-56 ${mergedTheme.dropdownBackground}`}
            >
              {/* 用戶資訊 */}
              <div className="px-3 py-2 border-b border-border/50">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>

              {/* 會員中心 */}
              <DropdownMenuItem asChild>
                <Link 
                  to={mergedConfig.dashboardPath || '/account'}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  會員中心
                </Link>
              </DropdownMenuItem>

              {/* 個人資料 */}
              <DropdownMenuItem asChild>
                <Link 
                  to={mergedConfig.profilePath || '/account/profile'}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  個人資料
                </Link>
              </DropdownMenuItem>

              {/* 管理後台（僅管理員/小幫手） */}
              {showAdminButton && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link 
                      to={mergedConfig.adminPath || '/dashboard'}
                      className="flex items-center gap-2 cursor-pointer text-amber-500"
                    >
                      <Shield className="h-4 w-4" />
                      {isAdmin ? '管理後台' : '小幫手後台'}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />

              {/* 登出 */}
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          variant={mergedTheme.buttonVariant}
          size="sm"
          onClick={() => navigate(mergedConfig.loginPath || '/auth/login')}
          className="whitespace-nowrap"
        >
          登入 / 註冊
        </Button>
      )}
    </div>
  );
}

export default MemberAuthHeader;
