/**
 * 默默超命理報告平台 - Entitlements SDK
 * 
 * 此 SDK 提供外部專案呼叫權限檢查 API 的便捷方法
 * 
 * ============================================
 * 快速設定（適用於外部專案）
 * ============================================
 * 
 * 中央授權系統資訊：
 * - API URL: https://yyzcgxnvtprojutnxisz.supabase.co
 * - Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5emNneG52dHByb2p1dG54aXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2Mzc4NjMsImV4cCI6MjA4MTIxMzg2M30.1MekiqwQCjZ4mWZlBmb7VY-Y2mnqKhHxCaYDJYoqWfw
 * 
 * 你的外部專案（例如 https://mwgxpmcngzwmyluhaltp.supabase.co）需要：
 * 1. 複製此檔案到專案中
 * 2. 使用上方的中央授權系統 URL 和 Anon Key 初始化 client
 * 3. 使用你的專案的 user JWT token 呼叫 API
 * 
 * 重要：用戶必須在中央系統（yyzcgxnvtprojutnxisz）註冊並登入
 *       外部專案的 JWT token 無法直接使用
 * 
 * ============================================
 * 使用方式
 * ============================================
 * 
 * 方案 A：共用帳號系統（推薦）
 * - 外部專案也使用中央 Supabase 做認證
 * - 直接用登入後取得的 access_token 呼叫 API
 * 
 * 方案 B：獨立帳號系統
 * - 外部專案有自己的 Supabase 認證
 * - 需實作 SSO 或帳號連結機制
 * - 使用中央系統發的 token 呼叫 API
 */

// ============================================
// 類型定義
// ============================================

export type EntitlementStatus = 'active' | 'expired' | 'revoked';

export interface Entitlement {
  id: string;
  product_id: string;
  plan_id: string | null;
  status: EntitlementStatus;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
}

export interface EntitlementsResponse {
  user_id: string;
  entitlements: Entitlement[];
}

export interface EntitlementsError {
  error: string;
}

export interface ClientConfig {
  /** API 基礎 URL，例如：https://yyzcgxnvtprojutnxisz.supabase.co */
  baseUrl: string;
  /** Supabase Anon Key */
  anonKey: string;
}

// ============================================
// 產品 ID 常數
// ============================================

export const ProductIds = {
  /** 命理報告閱讀平台 */
  REPORT_PLATFORM: 'report_platform',
  /** 故事工坊 */
  STORY_BUILDER_HUB: 'story_builder_hub',
  /** 尋怪獸 */
  SEEK_MONSTER: 'seek_monster',
} as const;

export type ProductId = typeof ProductIds[keyof typeof ProductIds];

// ============================================
// SDK 主類別
// ============================================

export class EntitlementsClient {
  private baseUrl: string;
  private anonKey: string;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除尾部斜線
    this.anonKey = config.anonKey;
  }

  /**
   * 取得使用者的所有權限
   * @param accessToken - 使用者的 JWT Access Token
   * @param productId - 可選，篩選特定產品的權限
   */
  async getEntitlements(
    accessToken: string,
    productId?: ProductId | string
  ): Promise<EntitlementsResponse> {
    const url = new URL(`${this.baseUrl}/functions/v1/entitlements-me`);
    
    if (productId) {
      url.searchParams.set('product_id', productId);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': this.anonKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new EntitlementsApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`
      );
    }

    return response.json();
  }

  /**
   * 檢查使用者是否擁有特定產品的有效權限
   * @param accessToken - 使用者的 JWT Access Token
   * @param productId - 產品 ID
   */
  async hasAccess(accessToken: string, productId: ProductId | string): Promise<boolean> {
    try {
      const result = await this.getEntitlements(accessToken, productId);
      return result.entitlements.some(e => e.is_active);
    } catch (error) {
      if (error instanceof EntitlementsApiError && error.status === 401) {
        return false; // 未授權視為無權限
      }
      throw error;
    }
  }

  /**
   * 取得使用者對特定產品的權限詳情
   * @param accessToken - 使用者的 JWT Access Token
   * @param productId - 產品 ID
   */
  async getProductEntitlement(
    accessToken: string,
    productId: ProductId | string
  ): Promise<Entitlement | null> {
    try {
      const result = await this.getEntitlements(accessToken, productId);
      return result.entitlements.find(e => e.is_active) || null;
    } catch (error) {
      if (error instanceof EntitlementsApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 取得所有有效權限的產品 ID 列表
   * @param accessToken - 使用者的 JWT Access Token
   */
  async getActiveProductIds(accessToken: string): Promise<string[]> {
    const result = await this.getEntitlements(accessToken);
    return result.entitlements
      .filter(e => e.is_active)
      .map(e => e.product_id);
  }
}

// ============================================
// 錯誤類別
// ============================================

export class EntitlementsApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'EntitlementsApiError';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// ============================================
// React Hook（適用於 React 專案）
// ============================================

/**
 * React Hook 範例 - 請依據你的專案調整
 * 
 * 使用方式：
 * ```tsx
 * const { hasAccess, isLoading, error } = useProductAccess('report_platform');
 * 
 * if (isLoading) return <Loading />;
 * if (!hasAccess) return <AccessDenied />;
 * return <ProtectedContent />;
 * ```
 */
export const createUseProductAccess = (client: EntitlementsClient) => {
  // 這是一個工廠函式，返回實際的 hook
  // 需要在你的專案中搭配 React 使用
  return `
// 將以下程式碼複製到你的專案中

import { useState, useEffect } from 'react';
import { EntitlementsClient, ProductId } from './entitlements-sdk';

// 初始化 client（建議放在全域設定檔）
const entitlementsClient = new EntitlementsClient({
  baseUrl: process.env.NEXT_PUBLIC_ENTITLEMENTS_API_URL || 'https://yyzcgxnvtprojutnxisz.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
});

export function useProductAccess(productId: ProductId | string) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        setIsLoading(true);
        // 從你的 auth context 取得 accessToken
        const accessToken = await getAccessToken(); // 實作這個函式
        const result = await entitlementsClient.hasAccess(accessToken, productId);
        setHasAccess(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkAccess();
  }, [productId]);

  return { hasAccess, isLoading, error };
}
`;
};

// ============================================
// 使用範例
// ============================================

export const UsageExamples = {
  basic: `
// 基本使用
import { EntitlementsClient, ProductIds } from './entitlements-sdk';

const client = new EntitlementsClient({
  baseUrl: 'https://yyzcgxnvtprojutnxisz.supabase.co',
  anonKey: 'your-anon-key',
});

// 檢查使用者是否有權限使用報告平台
const accessToken = 'user-jwt-token';
const hasAccess = await client.hasAccess(accessToken, ProductIds.REPORT_PLATFORM);

if (hasAccess) {
  console.log('使用者有權限');
} else {
  console.log('使用者無權限');
}
`,

  withSupabase: `
// 搭配 Supabase Auth 使用
import { createClient } from '@supabase/supabase-js';
import { EntitlementsClient, ProductIds } from './entitlements-sdk';

const supabase = createClient(
  'https://yyzcgxnvtprojutnxisz.supabase.co',
  'your-anon-key'
);

const entitlements = new EntitlementsClient({
  baseUrl: 'https://yyzcgxnvtprojutnxisz.supabase.co',
  anonKey: 'your-anon-key',
});

async function checkUserAccess(productId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return false; // 未登入
  }
  
  return entitlements.hasAccess(session.access_token, productId);
}

// 使用範例
const canAccessReports = await checkUserAccess(ProductIds.REPORT_PLATFORM);
`,

  middleware: `
// Next.js Middleware 範例
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EntitlementsClient, ProductIds } from './entitlements-sdk';

const client = new EntitlementsClient({
  baseUrl: process.env.ENTITLEMENTS_API_URL!,
  anonKey: process.env.SUPABASE_ANON_KEY!,
});

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const hasAccess = await client.hasAccess(token, ProductIds.REPORT_PLATFORM);
    
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/subscribe', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Entitlement check failed:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: '/protected/:path*',
};
`,

  errorHandling: `
// 完整錯誤處理範例
import { 
  EntitlementsClient, 
  EntitlementsApiError,
  ProductIds 
} from './entitlements-sdk';

const client = new EntitlementsClient({
  baseUrl: 'https://yyzcgxnvtprojutnxisz.supabase.co',
  anonKey: 'your-anon-key',
});

async function checkAccessWithRetry(
  accessToken: string, 
  productId: string,
  maxRetries = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.hasAccess(accessToken, productId);
    } catch (error) {
      if (error instanceof EntitlementsApiError) {
        // 401 不需重試
        if (error.isUnauthorized) {
          console.log('Token 無效或已過期');
          return false;
        }
        
        // 伺服器錯誤才重試
        if (error.isServerError && attempt < maxRetries) {
          console.log(\`重試中... (第 \${attempt} 次)\`);
          await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }
      }
      throw error;
    }
  }
  return false;
}
`,
};
