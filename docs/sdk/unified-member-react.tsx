/**
 * React Hooks for Unified Member System
 * 
 * 用於 React 專案的權限驗證 Hooks
 */

import { useState, useEffect, useCallback, createContext, useContext, useMemo, ReactNode } from 'react';
import { 
  UnifiedMemberClient, 
  ClientConfig, 
  ProductId, 
  Entitlement,
  CheckAccessResult,
  UserEntitlements,
} from './unified-member-sdk';

// ============ Context ============

interface UnifiedMemberContextValue {
  client: UnifiedMemberClient;
}

const UnifiedMemberContext = createContext<UnifiedMemberContextValue | null>(null);

interface ProviderProps {
  config: ClientConfig;
  children: ReactNode;
}

/**
 * 統一會員系統 Provider
 * 
 * @example
 * ```tsx
 * <UnifiedMemberProvider config={{ apiKey: 'mk_xxx' }}>
 *   <App />
 * </UnifiedMemberProvider>
 * ```
 */
export function UnifiedMemberProvider({ config, children }: ProviderProps) {
  const client = useMemo(() => new UnifiedMemberClient(config), [config.apiKey, config.baseUrl]);

  return (
    <UnifiedMemberContext.Provider value={{ client }}>
      {children}
    </UnifiedMemberContext.Provider>
  );
}

/**
 * 取得統一會員系統客戶端
 */
export function useUnifiedMember(): UnifiedMemberContextValue {
  const context = useContext(UnifiedMemberContext);
  if (!context) {
    throw new Error('useUnifiedMember must be used within UnifiedMemberProvider');
  }
  return context;
}

// ============ Hooks ============

interface UseProductAccessOptions {
  /** SDK 客戶端（可選，如果在 Provider 內可自動取得） */
  client?: UnifiedMemberClient;
  /** 產品 ID */
  productId: ProductId;
  /** 用戶 Email（使用 API Key 認證時） */
  userEmail?: string;
  /** 用戶 JWT Access Token（使用 JWT 認證時） */
  accessToken?: string;
  /** 是否自動檢查 */
  enabled?: boolean;
}

interface UseProductAccessResult {
  /** 是否有權限 */
  hasAccess: boolean;
  /** 是否載入中 */
  isLoading: boolean;
  /** 錯誤訊息 */
  error: string | null;
  /** 權限詳情 */
  entitlement: Entitlement | null;
  /** 重新檢查 */
  refetch: () => Promise<void>;
}

/**
 * 檢查用戶是否有特定產品的權限
 * 
 * @example
 * ```tsx
 * function ProtectedFeature() {
 *   const { hasAccess, isLoading } = useProductAccess({
 *     productId: 'yuanyi_divination',
 *     userEmail: 'user@example.com',
 *   });
 * 
 *   if (isLoading) return <Loading />;
 *   if (!hasAccess) return <NoAccess />;
 *   return <Feature />;
 * }
 * ```
 */
export function useProductAccess(options: UseProductAccessOptions): UseProductAccessResult {
  const contextClient = useContext(UnifiedMemberContext)?.client;
  const client = options.client || contextClient;

  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);

  const checkAccess = useCallback(async () => {
    if (!client) {
      setError('No client available. Provide client prop or use UnifiedMemberProvider.');
      setIsLoading(false);
      return;
    }

    if (options.enabled === false) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (options.accessToken) {
        // 使用 JWT 查詢
        const result = await client.getMyEntitlements(options.accessToken, options.productId);
        const ent = result.entitlements.find(
          e => e.product_id === options.productId && e.is_active
        );
        setHasAccess(!!ent);
        setEntitlement(ent || null);
      } else if (options.userEmail) {
        // 使用 API Key + Email 查詢
        const result = await client.checkAccess(options.userEmail, options.productId);
        setHasAccess(result.hasAccess);
        setEntitlement(result.entitlement || null);
        if (result.error) {
          setError(result.error);
        }
      } else {
        setHasAccess(false);
        setError('No userEmail or accessToken provided');
      }
    } catch (err) {
      setHasAccess(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [client, options.productId, options.userEmail, options.accessToken, options.enabled]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return {
    hasAccess,
    isLoading,
    error,
    entitlement,
    refetch: checkAccess,
  };
}

interface UseAllEntitlementsOptions {
  client?: UnifiedMemberClient;
  userEmail?: string;
  accessToken?: string;
  enabled?: boolean;
}

interface UseAllEntitlementsResult {
  entitlements: Entitlement[];
  activeProductIds: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 取得用戶的所有權限
 */
export function useAllEntitlements(options: UseAllEntitlementsOptions): UseAllEntitlementsResult {
  const contextClient = useContext(UnifiedMemberContext)?.client;
  const client = options.client || contextClient;

  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntitlements = useCallback(async () => {
    if (!client) {
      setError('No client available');
      setIsLoading(false);
      return;
    }

    if (options.enabled === false) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (options.accessToken) {
        const result = await client.getMyEntitlements(options.accessToken);
        setEntitlements(result.entitlements);
      } else if (options.userEmail) {
        const result = await client.lookupUser(options.userEmail);
        setEntitlements(result.entitlements);
      } else {
        setEntitlements([]);
        setError('No userEmail or accessToken provided');
      }
    } catch (err) {
      setEntitlements([]);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [client, options.userEmail, options.accessToken, options.enabled]);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  const activeProductIds = useMemo(
    () => entitlements.filter(e => e.is_active).map(e => e.product_id),
    [entitlements]
  );

  return {
    entitlements,
    activeProductIds,
    isLoading,
    error,
    refetch: fetchEntitlements,
  };
}

// ============ Higher-Order Components ============

interface WithProductAccessProps {
  productId: ProductId;
  userEmail?: string;
  accessToken?: string;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
}

/**
 * 建立受保護的元件 HOC
 * 
 * @example
 * ```tsx
 * const ProtectedDivination = withProductAccess(DivinationPage, {
 *   productId: 'yuanyi_divination',
 *   fallback: <NoAccessPage />,
 * });
 * ```
 */
export function withProductAccess<P extends object>(
  Component: React.ComponentType<P>,
  options: WithProductAccessProps
) {
  return function ProtectedComponent(props: P) {
    const { hasAccess, isLoading, error } = useProductAccess({
      productId: options.productId,
      userEmail: options.userEmail,
      accessToken: options.accessToken,
    });

    if (isLoading) {
      return options.loadingComponent || <div>檢查權限中...</div>;
    }

    if (!hasAccess) {
      return options.fallback || <div>您沒有此功能的使用權限</div>;
    }

    return <Component {...props} />;
  };
}
