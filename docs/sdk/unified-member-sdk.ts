/**
 * 統一會員系統 SDK
 * Unified Member System SDK for External Projects
 * 
 * 用於外部專案接入中央授權系統
 * 
 * @version 1.0.0
 * @license MIT
 */

// ============ 類型定義 ============

export interface ClientConfig {
  /** API Key (格式: mk_xxx...) */
  apiKey: string;
  /** API 基礎 URL */
  baseUrl?: string;
}

export interface Entitlement {
  id: string;
  product_id: string;
  status: 'active' | 'expired' | 'revoked';
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  notes?: string | null;
}

export interface CheckAccessResult {
  hasAccess: boolean;
  found: boolean;
  userId?: string;
  userEmail?: string;
  entitlement?: Entitlement;
  error?: string;
}

export interface UserEntitlements {
  userId: string;
  entitlements: Entitlement[];
}

export interface UserProfile {
  display_name: string | null;
  subscription_status: 'free' | 'trial' | 'active' | 'cancelled' | 'expired';
  birth_date?: string | null;
  birth_time?: string | null;
  birth_place?: string | null;
}

export interface UserLookupResult {
  found: boolean;
  user?: {
    id: string;
    email: string;
  };
  profile?: UserProfile;
  entitlements: Entitlement[];
}

/** 預定義的產品 ID */
export const ProductIds = {
  /** 虹靈御所 - 命理報告平台 */
  REPORT_PLATFORM: 'report_platform',
  /** 四時八字人生兵法 - 命理桌遊系統 */
  STORY_BUILDER_HUB: 'story_builder_hub',
  /** 尋妖記 - 探索遊戲平台 */
  SEEK_MONSTER: 'seek_monster',
  /** 元壹卜卦系統 - 占問與指引 */
  YUANYI_DIVINATION: 'yuanyi_divination',
} as const;

export type ProductId = typeof ProductIds[keyof typeof ProductIds] | string;

// ============ 錯誤類別 ============

export class UnifiedMemberError extends Error {
  public statusCode: number;
  public responseBody?: unknown;

  constructor(message: string, statusCode: number, responseBody?: unknown) {
    super(message);
    this.name = 'UnifiedMemberError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }

  static isUnauthorized(error: unknown): boolean {
    return error instanceof UnifiedMemberError && error.statusCode === 401;
  }

  static isForbidden(error: unknown): boolean {
    return error instanceof UnifiedMemberError && error.statusCode === 403;
  }

  static isNotFound(error: unknown): boolean {
    return error instanceof UnifiedMemberError && error.statusCode === 404;
  }

  static isRateLimited(error: unknown): boolean {
    return error instanceof UnifiedMemberError && error.statusCode === 429;
  }
}

// ============ SDK 主類別 ============

const DEFAULT_BASE_URL = 'https://yyzcgxnvtprojutnxisz.supabase.co/functions/v1';

export class UnifiedMemberClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ClientConfig) {
    if (!config.apiKey) {
      throw new Error('API Key is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  }

  /**
   * 發送 API 請求
   */
  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      params?: Record<string, string>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new UnifiedMemberError(
        errorBody.error || `HTTP ${response.status}`,
        response.status,
        errorBody
      );
    }

    return response.json();
  }

  /**
   * 檢查用戶是否有特定產品的存取權限
   * 
   * @param email - 用戶 Email
   * @param productId - 產品 ID
   * @returns 權限檢查結果
   * 
   * @example
   * ```ts
   * const result = await client.checkAccess('user@example.com', 'yuanyi_divination');
   * if (result.hasAccess) {
   *   console.log('用戶有權限');
   * }
   * ```
   */
  async checkAccess(email: string, productId: ProductId): Promise<CheckAccessResult> {
    try {
      return await this.request<CheckAccessResult>('check-entitlement', {
        params: { email, product_id: productId },
      });
    } catch (error) {
      if (error instanceof UnifiedMemberError) {
        return {
          hasAccess: false,
          found: false,
          error: error.message,
        };
      }
      return {
        hasAccess: false,
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 查詢用戶的所有權限（透過 Email）
   * 
   * @param email - 用戶 Email
   * @param productId - 可選，篩選特定產品
   * @returns 用戶資料與權限列表
   */
  async lookupUser(email: string, productId?: ProductId): Promise<UserLookupResult> {
    return this.request<UserLookupResult>('entitlements-lookup', {
      params: { 
        email, 
        ...(productId && { product_id: productId }),
      },
    });
  }

  /**
   * 使用 JWT Token 查詢當前用戶的權限
   * 
   * @param accessToken - 用戶的 JWT Access Token
   * @param productId - 可選，篩選特定產品
   * @returns 用戶權限列表
   */
  async getMyEntitlements(
    accessToken: string, 
    productId?: ProductId
  ): Promise<UserEntitlements> {
    const url = new URL(`${this.baseUrl}/entitlements-me`);
    if (productId) {
      url.searchParams.set('product_id', productId);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new UnifiedMemberError(
        errorBody.error || `HTTP ${response.status}`,
        response.status,
        errorBody
      );
    }

    return response.json();
  }

  /**
   * 快速檢查：用戶是否有特定產品的權限（布林值）
   */
  async hasAccess(email: string, productId: ProductId): Promise<boolean> {
    const result = await this.checkAccess(email, productId);
    return result.hasAccess;
  }

  /**
   * 快速檢查：用戶是否有任何有效權限
   */
  async hasAnyAccess(email: string): Promise<boolean> {
    try {
      const result = await this.lookupUser(email);
      return result.entitlements.some(e => e.is_active);
    } catch {
      return false;
    }
  }

  /**
   * 取得用戶的所有有效產品 ID
   */
  async getActiveProductIds(email: string): Promise<string[]> {
    try {
      const result = await this.lookupUser(email);
      return result.entitlements
        .filter(e => e.is_active)
        .map(e => e.product_id);
    } catch {
      return [];
    }
  }

  /**
   * 取得用戶的個人資料
   */
  async getUserProfile(email: string): Promise<UserProfile | null> {
    try {
      const result = await this.lookupUser(email);
      return result.profile || null;
    } catch {
      return null;
    }
  }
}

// ============ 單例工廠 ============

let defaultClient: UnifiedMemberClient | null = null;

/**
 * 初始化預設客戶端
 */
export function initializeClient(config: ClientConfig): UnifiedMemberClient {
  defaultClient = new UnifiedMemberClient(config);
  return defaultClient;
}

/**
 * 取得預設客戶端
 */
export function getClient(): UnifiedMemberClient {
  if (!defaultClient) {
    throw new Error('UnifiedMemberClient not initialized. Call initializeClient() first.');
  }
  return defaultClient;
}

// ============ 工具函數 ============

/**
 * 建立統一登入 URL
 */
export function createLoginUrl(options: {
  /** 來源產品 ID */
  from: ProductId;
  /** 登入後的重新導向 URL */
  redirectUrl: string;
  /** 統一登入頁面的基礎 URL */
  loginBaseUrl?: string;
}): string {
  const baseUrl = options.loginBaseUrl || 'https://your-unified-platform.com/auth/login';
  const url = new URL(baseUrl);
  url.searchParams.set('from', options.from);
  url.searchParams.set('redirect', options.redirectUrl);
  return url.toString();
}

/**
 * 遮蔽 Email（用於日誌）
 */
export function maskEmail(email: string): string {
  return email.replace(/(.{2}).*(@.*)/, '$1***$2');
}
