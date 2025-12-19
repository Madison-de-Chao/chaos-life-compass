// 訂閱方案定義
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number;
  features: string[];
  is_popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: '免費會員',
    description: '基本會員權益',
    price: 0,
    currency: 'TWD',
    duration_days: 0,
    features: [
      '查看已購買的報告',
      '基本客服支援',
    ],
  },
  {
    id: 'trial',
    name: '試用會員',
    description: '體驗完整功能',
    price: 0,
    currency: 'TWD',
    duration_days: 7,
    features: [
      '7天免費試用',
      '查看所有報告',
      '專屬客服支援',
    ],
  },
  {
    id: 'monthly',
    name: '月費會員',
    description: '按月訂閱',
    price: 299,
    currency: 'TWD',
    duration_days: 30,
    features: [
      '查看所有報告',
      '優先客服支援',
      '專屬會員內容',
      '每月運勢分析',
    ],
    is_popular: true,
  },
  {
    id: 'yearly',
    name: '年費會員',
    description: '年繳享優惠',
    price: 2388,
    currency: 'TWD',
    duration_days: 365,
    features: [
      '所有月費會員權益',
      '年度完整運勢報告',
      '免費追蹤更新',
      '專屬折扣優惠',
    ],
  },
];

export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'cancelled' | 'expired';

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  free: { label: '免費', variant: 'secondary' },
  trial: { label: '試用', variant: 'outline' },
  active: { label: '訂閱中', variant: 'default' },
  cancelled: { label: '已取消', variant: 'destructive' },
  expired: { label: '已過期', variant: 'destructive' },
};

// 計算訂閱到期日
export function calculateExpirationDate(startDate: Date, durationDays: number): Date {
  const expiration = new Date(startDate);
  expiration.setDate(expiration.getDate() + durationDays);
  return expiration;
}

// 檢查訂閱是否即將到期（7天內）
export function isExpiringSoon(expirationDate: Date | string | null): boolean {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiration > 0 && daysUntilExpiration <= 7;
}

// 檢查訂閱是否已過期
export function isSubscriptionExpired(expirationDate: Date | string | null): boolean {
  if (!expirationDate) return false;
  return new Date(expirationDate) < new Date();
}

// 取得剩餘天數
export function getDaysRemaining(expirationDate: Date | string | null): number {
  if (!expirationDate) return 0;
  const expDate = new Date(expirationDate);
  const now = new Date();
  return Math.max(0, Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
