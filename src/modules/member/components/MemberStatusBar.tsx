/**
 * 會員狀態導航列組件
 * 顯示訂閱狀態、權限徽章、快速入口和消費積分
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  FileText, 
  Gamepad2, 
  BookOpen, 
  Compass,
  Wallet,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react';
import { useMember } from '../context/MemberContext';
import { useMyEntitlements, useActiveProductIds } from '../hooks/useEntitlements';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

// 產品配置
const PRODUCTS = {
  report_platform: {
    id: 'report_platform',
    name: '命理報告',
    icon: FileText,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  story_builder_hub: {
    id: 'story_builder_hub',
    name: '超烜遊戲',
    icon: Gamepad2,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  seek_monster: {
    id: 'seek_monster',
    name: '尋獸記',
    icon: Compass,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  yuanyi_divination: {
    id: 'yuanyi_divination',
    name: '元壹筆記',
    icon: BookOpen,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
} as const;

// 訂閱狀態配置
const SUBSCRIPTION_STATUS = {
  free: { label: '免費會員', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  trial: { label: '試用中', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  active: { label: 'Premium', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  cancelled: { label: '已取消', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  expired: { label: '已過期', color: 'text-muted-foreground', bgColor: 'bg-muted' },
} as const;

export interface MemberStatusBarProps {
  /** 是否顯示快速入口 */
  showQuickLinks?: boolean;
  /** 是否顯示消費積分 */
  showSpending?: boolean;
  /** 是否顯示權限徽章 */
  showEntitlements?: boolean;
  /** 是否收合模式（僅顯示圖標） */
  compact?: boolean;
  /** 自定義類名 */
  className?: string;
}

export function MemberStatusBar({
  showQuickLinks = true,
  showSpending = true,
  showEntitlements = true,
  compact = false,
  className,
}: MemberStatusBarProps) {
  const { user, profile, loading: memberLoading } = useMember();
  const { data: activeProductIds = [], isLoading: productsLoading } = useActiveProductIds();
  const { data: entitlements = [], isLoading: entitlementsLoading } = useMyEntitlements();

  const isLoading = memberLoading || productsLoading || entitlementsLoading;

  // 未登入時不顯示
  if (!user) return null;

  const subscriptionStatus = profile?.subscription_status || 'free';
  const statusConfig = SUBSCRIPTION_STATUS[subscriptionStatus as keyof typeof SUBSCRIPTION_STATUS] 
    || SUBSCRIPTION_STATUS.free;
  
  // 計算到期時間
  const expiresAt = profile?.subscription_expires_at 
    ? new Date(profile.subscription_expires_at) 
    : null;
  const isExpiringSoon = expiresAt && expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  // 獲取總消費
  const totalSpent = profile?.total_spent || 0;

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1.5", className)}>
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-16" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className={cn(
          "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-full",
          "bg-black/40 backdrop-blur-md border border-amber-500/20",
          className
        )}
      >
        {/* 訂閱狀態 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-full",
              statusConfig.bgColor
            )}>
              {subscriptionStatus === 'active' || subscriptionStatus === 'trial' ? (
                <Crown className={cn("h-3.5 w-3.5", statusConfig.color)} />
              ) : (
                <Star className={cn("h-3.5 w-3.5", statusConfig.color)} />
              )}
              {!compact && (
                <span className={cn("text-xs font-medium", statusConfig.color)}>
                  {statusConfig.label}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p className="font-medium">{statusConfig.label}</p>
            {expiresAt && (
              <p className={cn("text-muted-foreground", isExpiringSoon && "text-amber-400")}>
                {isExpiringSoon && <Clock className="inline h-3 w-3 mr-1" />}
                到期：{format(expiresAt, 'yyyy/MM/dd', { locale: zhTW })}
              </p>
            )}
          </TooltipContent>
        </Tooltip>

        {/* 分隔符 */}
        {showEntitlements && activeProductIds.length > 0 && (
          <div className="w-px h-4 bg-amber-500/30" />
        )}

        {/* 權限徽章 */}
        {showEntitlements && activeProductIds.length > 0 && (
          <div className="flex items-center gap-1">
            {activeProductIds.slice(0, compact ? 2 : 4).map((productId) => {
              const product = PRODUCTS[productId as keyof typeof PRODUCTS];
              if (!product) return null;
              
              const Icon = product.icon;
              return (
                <Tooltip key={productId}>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full",
                      product.bgColor
                    )}>
                      <Icon className={cn("h-3.5 w-3.5", product.color)} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-emerald-400">✓ 已授權</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {activeProductIds.length > (compact ? 2 : 4) && (
              <Badge variant="secondary" className="h-6 px-1.5 text-xs">
                +{activeProductIds.length - (compact ? 2 : 4)}
              </Badge>
            )}
          </div>
        )}

        {/* 分隔符 */}
        {showSpending && totalSpent > 0 && (
          <div className="w-px h-4 bg-amber-500/30" />
        )}

        {/* 消費積分 */}
        {showSpending && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10">
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                {!compact && (
                  <span className="text-xs font-medium text-emerald-400">
                    ${totalSpent.toLocaleString()}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p className="font-medium">累計消費</p>
              <p className="text-emerald-400">NT$ {totalSpent.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* 分隔符 */}
        {showQuickLinks && (
          <div className="w-px h-4 bg-amber-500/30" />
        )}

        {/* 快速入口 */}
        {showQuickLinks && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://member.momo-chao.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full",
                  "bg-amber-500/10 hover:bg-amber-500/20 transition-colors",
                  "text-amber-400 hover:text-amber-300"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {!compact && (
                  <>
                    <span className="text-xs font-medium">會員中心</span>
                    <ChevronRight className="h-3 w-3" />
                  </>
                )}
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              前往會員中心管理訂閱
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

export default MemberStatusBar;
