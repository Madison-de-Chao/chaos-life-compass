/**
 * 權限管理 Hooks
 * 使用外部會員中心 API 進行權限查詢（含本地快取機制）
 * 管理操作仍使用本地 Supabase
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Product, Plan, Entitlement } from "../types";

// ==================== 快取配置 ====================
const CACHE_KEY_PREFIX = 'entitlements_cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 分鐘快取有效期
const STALE_TTL_MS = 30 * 60 * 1000; // 30 分鐘內可用 stale 資料

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  email: string;
}

function getCacheKey(type: string, email: string): string {
  return `${CACHE_KEY_PREFIX}${type}_${email}`;
}

function setCache<T>(type: string, email: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      email,
    };
    localStorage.setItem(getCacheKey(type, email), JSON.stringify(entry));
  } catch (e) {
    console.warn('Failed to cache entitlements:', e);
  }
}

function getCache<T>(type: string, email: string): { data: T | null; isStale: boolean; isExpired: boolean } {
  try {
    const cached = localStorage.getItem(getCacheKey(type, email));
    if (!cached) return { data: null, isStale: false, isExpired: true };
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const age = Date.now() - entry.timestamp;
    
    // 檢查是否為同一用戶的快取
    if (entry.email !== email) {
      return { data: null, isStale: false, isExpired: true };
    }
    
    return {
      data: entry.data,
      isStale: age > CACHE_TTL_MS,
      isExpired: age > STALE_TTL_MS,
    };
  } catch (e) {
    return { data: null, isStale: false, isExpired: true };
  }
}

function clearUserCache(email: string): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX) && key.endsWith(`_${email}`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.warn('Failed to clear entitlements cache:', e);
  }
}

// ==================== 類型定義 ====================

interface MemberCenterEntitlement {
  id: string;
  status: string;
  starts_at: string;
  ends_at: string | null;
}

interface MemberCenterCheckResponse {
  hasAccess: boolean;
  found: boolean;
  userId?: string;
  email: string;
  productId: string;
  entitlement?: MemberCenterEntitlement;
}

interface MemberCenterLookupResponse {
  userId?: string;
  email: string;
  entitlements: Array<{
    id: string;
    product_id: string;
    status: string;
    starts_at: string;
    ends_at: string | null;
    product?: {
      id: string;
      name: string;
    };
  }>;
}

// ==================== 外部會員中心 API 調用 ====================

async function callMemberCenterProxy(action: string, params: Record<string, string> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const queryParams = new URLSearchParams({ action, ...params });
  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/member-center-proxy`;
  const url = `${baseUrl}?${queryParams.toString()}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  const res = await fetch(url, { headers });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  
  return res.json();
}

// ==================== Query Hooks ====================

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('product_id, name');
      
      if (error) throw error;
      return data as Plan[];
    },
  });
}

/**
 * 從外部會員中心查詢當前用戶的權限（含快取）
 */
export function useMyEntitlements() {
  return useQuery({
    queryKey: ['my-entitlements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return [];

      const cacheType = 'lookup';
      const { data: cachedData, isStale, isExpired } = getCache<Entitlement[]>(cacheType, user.email);

      // 如果快取有效且未過期，直接返回
      if (cachedData && !isStale) {
        return cachedData;
      }

      try {
        const response: MemberCenterLookupResponse = await callMemberCenterProxy(
          'entitlements-lookup',
          { email: user.email }
        );
        
        // Convert to local Entitlement format
        const entitlements = response.entitlements?.map(e => ({
          id: e.id,
          user_id: response.userId || user.id,
          product_id: e.product_id,
          status: e.status as 'active' | 'expired' | 'revoked',
          starts_at: e.starts_at,
          ends_at: e.ends_at,
          plan_id: null,
          granted_by: null,
          notes: null,
          created_at: e.starts_at,
          updated_at: e.starts_at,
        })) || [];

        // 快取成功的結果
        setCache(cacheType, user.email, entitlements);
        return entitlements;
      } catch (error) {
        console.error('Failed to fetch entitlements from member center:', error);
        
        // 如果有 stale 快取，在 API 失敗時使用
        if (cachedData && !isExpired) {
          console.log('Using stale cache due to API failure');
          return cachedData;
        }
        
        // Fallback to local entitlements
        const { data, error: dbError } = await supabase
          .from('entitlements')
          .select('*')
          .eq('user_id', user.id);
        
        if (dbError) throw dbError;
        return data as Entitlement[];
      }
    },
    // React Query 自帶的 stale/cache 設定
    staleTime: CACHE_TTL_MS,
    gcTime: STALE_TTL_MS,
  });
}

/**
 * 管理員查詢所有權限（仍使用本地資料庫）
 */
export function useAllEntitlements() {
  return useQuery({
    queryKey: ['all-entitlements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entitlements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Entitlement[];
    },
  });
}

// ==================== Mutation Hooks ====================

export function useCreateEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entitlement: {
      user_id: string;
      product_id: string;
      plan_id?: string;
      status?: 'active' | 'expired' | 'revoked';
      starts_at?: string;
      ends_at?: string | null;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('entitlements')
        .upsert({
          ...entitlement,
          granted_by: user?.id,
        }, { onConflict: 'user_id,product_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
      toast.success('權限已更新');
    },
    onError: (error) => {
      console.error('Failed to create entitlement:', error);
      toast.error('更新權限失敗');
    },
  });
}

export function useUpdateEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Entitlement> & { id: string }) => {
      const { data, error } = await supabase
        .from('entitlements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
      toast.success('權限已更新');
    },
    onError: (error) => {
      console.error('Failed to update entitlement:', error);
      toast.error('更新權限失敗');
    },
  });
}

export function useDeleteEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('entitlements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
      toast.success('權限已刪除');
    },
    onError: (error) => {
      console.error('Failed to delete entitlement:', error);
      toast.error('刪除權限失敗');
    },
  });
}

// ==================== Utility Hooks ====================

export function useSearchUsers(email: string) {
  return useQuery({
    queryKey: ['search-users', email],
    queryFn: async () => {
      if (!email || email.length < 3) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .ilike('display_name', `%${email}%`)
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: email.length >= 3,
  });
}

/**
 * 從外部會員中心檢查當前用戶對特定產品的權限（含快取）
 */
export function useProductAccess(productId: string) {
  return useQuery({
    queryKey: ['product-access', productId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return { hasAccess: false, entitlement: null };

      const cacheType = `check_${productId}`;
      const { data: cachedData, isStale, isExpired } = getCache<{ hasAccess: boolean; entitlement: Entitlement | null }>(cacheType, user.email);

      // 如果快取有效且未過期，直接返回
      if (cachedData && !isStale) {
        return cachedData;
      }

      try {
        const response: MemberCenterCheckResponse = await callMemberCenterProxy(
          'check-entitlement',
          { 
            email: user.email,
            product_id: productId 
          }
        );
        
        let result: { hasAccess: boolean; entitlement: Entitlement | null };
        
        if (response.hasAccess && response.entitlement) {
          result = {
            hasAccess: true,
            entitlement: {
              id: response.entitlement.id,
              user_id: response.userId || user.id,
              product_id: response.productId,
              status: response.entitlement.status as 'active' | 'expired' | 'revoked',
              starts_at: response.entitlement.starts_at,
              ends_at: response.entitlement.ends_at,
              plan_id: null,
              granted_by: null,
              notes: null,
              created_at: response.entitlement.starts_at,
              updated_at: response.entitlement.starts_at,
            } as Entitlement
          };
        } else {
          result = { hasAccess: false, entitlement: null };
        }
        
        // 快取成功的結果
        setCache(cacheType, user.email, result);
        return result;
      } catch (error) {
        console.error('Failed to check product access from member center:', error);
        
        // 如果有 stale 快取，在 API 失敗時使用
        if (cachedData && !isExpired) {
          console.log('Using stale cache due to API failure');
          return cachedData;
        }
        
        // Fallback to local check
        const { data, error: dbError } = await supabase
          .from('entitlements')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('status', 'active')
          .maybeSingle();
        
        if (dbError) throw dbError;
        
        if (data && data.ends_at) {
          const isExpired = new Date(data.ends_at) < new Date();
          if (isExpired) {
            return { hasAccess: false, entitlement: data };
          }
        }
        
        return { 
          hasAccess: !!data, 
          entitlement: data as Entitlement | null 
        };
      }
    },
    enabled: !!productId,
    staleTime: CACHE_TTL_MS,
    gcTime: STALE_TTL_MS,
  });
}

/**
 * 從外部會員中心獲取當前用戶的所有有效產品 ID（含快取）
 */
export function useActiveProductIds() {
  return useQuery({
    queryKey: ['active-product-ids'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return [];

      const cacheType = 'active_products';
      const { data: cachedData, isStale, isExpired } = getCache<string[]>(cacheType, user.email);

      // 如果快取有效且未過期，直接返回
      if (cachedData && !isStale) {
        return cachedData;
      }

      try {
        const response: MemberCenterLookupResponse = await callMemberCenterProxy(
          'entitlements-lookup',
          { email: user.email }
        );
        
        const now = new Date();
        const activeProductIds = response.entitlements
          ?.filter(e => e.status === 'active' && (!e.ends_at || new Date(e.ends_at) > now))
          .map(e => e.product_id) || [];

        // 快取成功的結果
        setCache(cacheType, user.email, activeProductIds);
        return activeProductIds;
      } catch (error) {
        console.error('Failed to fetch active product IDs from member center:', error);
        
        // 如果有 stale 快取，在 API 失敗時使用
        if (cachedData && !isExpired) {
          console.log('Using stale cache due to API failure');
          return cachedData;
        }
        
        // Fallback to local
        const { data, error: dbError } = await supabase
          .from('entitlements')
          .select('product_id, ends_at')
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        if (dbError) throw dbError;
        
        const now = new Date();
        return data
          .filter(e => !e.ends_at || new Date(e.ends_at) > now)
          .map(e => e.product_id);
      }
    },
    staleTime: CACHE_TTL_MS,
    gcTime: STALE_TTL_MS,
  });
}

/**
 * 清除當前用戶的權限快取（用於登出或權限變更時）
 */
export function useClearEntitlementsCache() {
  const queryClient = useQueryClient();
  
  return async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      clearUserCache(user.email);
    }
    // 同時清除 React Query 快取
    queryClient.invalidateQueries({ queryKey: ['my-entitlements'] });
    queryClient.invalidateQueries({ queryKey: ['product-access'] });
    queryClient.invalidateQueries({ queryKey: ['active-product-ids'] });
  };
}
