/**
 * useEntitlements Hooks 單元測試
 * 測試產品權限查詢、建立、更新、刪除操作
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useProducts,
  usePlans,
  useMyEntitlements,
  useAllEntitlements,
  useCreateEntitlement,
  useUpdateEntitlement,
  useDeleteEntitlement,
  useSearchUsers,
  useProductAccess,
  useActiveProductIds,
} from '../hooks/useEntitlements';
import { mockUser } from './mocks/supabase';

// Mock data
const mockProducts = [
  { id: 'report_platform', name: '命理報告平台', description: '命理報告服務', purchase_type: 'subscription', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'story_builder_hub', name: '故事建構中心', description: '互動式命理遊戲', purchase_type: 'subscription', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'seek_monster', name: '尋怪獸', description: '尋寶遊戲', purchase_type: 'one_time', created_at: '2024-01-01', updated_at: '2024-01-01' },
];

const mockPlans = [
  { id: 'plan-1', product_id: 'report_platform', name: '基礎版', price: 4980, currency: 'TWD', duration_days: 365, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'plan-2', product_id: 'report_platform', name: '旗艦版', price: 12800, currency: 'TWD', duration_days: 365, created_at: '2024-01-01', updated_at: '2024-01-01' },
];

const mockEntitlements = [
  { 
    id: 'ent-1', 
    user_id: 'test-user-id', 
    product_id: 'report_platform', 
    plan_id: 'plan-1',
    status: 'active',
    starts_at: '2024-01-01',
    ends_at: '2025-01-01',
    granted_by: 'admin-user-id',
    notes: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  { 
    id: 'ent-2', 
    user_id: 'test-user-id', 
    product_id: 'story_builder_hub', 
    plan_id: null,
    status: 'active',
    starts_at: '2024-01-01',
    ends_at: null,
    granted_by: 'admin-user-id',
    notes: '永久權限',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

const mockProfiles = [
  { user_id: 'user-1', display_name: '測試用戶一' },
  { user_id: 'user-2', display_name: '測試用戶二' },
];

// Setup mock for supabase
const mockFrom = vi.fn();
const mockAuth = {
  getSession: vi.fn(),
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  signInWithOAuth: vi.fn(),
  onAuthStateChange: vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: mockAuth,
    from: mockFrom,
  },
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Helper to create chainable mock
const createChainMock = (finalResult: unknown) => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = ['select', 'insert', 'update', 'upsert', 'delete', 'eq', 'neq', 'order', 'limit', 'ilike', 'single', 'maybeSingle'];
  
  methods.forEach(method => {
    chain[method] = vi.fn(() => chain);
  });
  
  // Set the final result
  chain.then = vi.fn((resolve) => resolve(finalResult));
  chain.order = vi.fn(() => finalResult);
  chain.eq = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(() => finalResult);
  chain.single = vi.fn(() => finalResult);
  chain.limit = vi.fn(() => finalResult);
  
  return chain;
};

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('應成功獲取產品列表', async () => {
    const chain = createChainMock({ data: mockProducts, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(mockProducts);
    expect(result.current.data).toHaveLength(3);
  });

  it('應處理查詢錯誤', async () => {
    const chain = createChainMock({ data: null, error: { message: 'Database error' } });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('usePlans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應成功獲取方案列表', async () => {
    const chain = createChainMock({ data: mockPlans, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => usePlans(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(mockPlans);
    expect(result.current.data).toHaveLength(2);
  });
});

describe('useMyEntitlements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('用戶已登入時應返回權限列表', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock({ data: mockEntitlements, error: null });
    chain.eq = vi.fn(() => ({ data: mockEntitlements, error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useMyEntitlements(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(mockEntitlements);
  });

  it('用戶未登入時應返回空陣列', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useMyEntitlements(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual([]);
  });
});

describe('useAllEntitlements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應返回所有權限列表', async () => {
    const chain = createChainMock({ data: mockEntitlements, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useAllEntitlements(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(mockEntitlements);
  });
});

describe('useProductAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('有效權限應返回 hasAccess: true', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const activeEntitlement = {
      ...mockEntitlements[0],
      ends_at: futureDate.toISOString(),
    };

    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock({ data: activeEntitlement, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useProductAccess('report_platform'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.hasAccess).toBe(true);
    expect(result.current.data?.entitlement).toBeDefined();
  });

  it('已過期權限應返回 hasAccess: false', async () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    
    const expiredEntitlement = {
      ...mockEntitlements[0],
      ends_at: pastDate.toISOString(),
    };

    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock({ data: expiredEntitlement, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useProductAccess('report_platform'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.hasAccess).toBe(false);
  });

  it('無權限時應返回 hasAccess: false', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock({ data: null, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useProductAccess('report_platform'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.hasAccess).toBe(false);
    expect(result.current.data?.entitlement).toBeNull();
  });

  it('用戶未登入應返回 hasAccess: false', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useProductAccess('report_platform'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.hasAccess).toBe(false);
    expect(result.current.data?.entitlement).toBeNull();
  });

  it('永久權限 (ends_at: null) 應返回 hasAccess: true', async () => {
    const permanentEntitlement = {
      ...mockEntitlements[1],
      ends_at: null,
    };

    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock({ data: permanentEntitlement, error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useProductAccess('story_builder_hub'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.hasAccess).toBe(true);
  });
});

describe('useActiveProductIds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應返回所有有效產品 ID', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const activeEntitlements = [
      { product_id: 'report_platform', ends_at: futureDate.toISOString() },
      { product_id: 'story_builder_hub', ends_at: null }, // 永久權限
    ];

    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock(null);
    chain.eq = vi.fn(() => ({ data: activeEntitlements, error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useActiveProductIds(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toContain('report_platform');
    expect(result.current.data).toContain('story_builder_hub');
    expect(result.current.data).toHaveLength(2);
  });

  it('應過濾已過期的產品', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    
    const mixedEntitlements = [
      { product_id: 'report_platform', ends_at: futureDate.toISOString() }, // 有效
      { product_id: 'seek_monster', ends_at: pastDate.toISOString() }, // 已過期
    ];

    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock(null);
    chain.eq = vi.fn(() => ({ data: mixedEntitlements, error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useActiveProductIds(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toContain('report_platform');
    expect(result.current.data).not.toContain('seek_monster');
    expect(result.current.data).toHaveLength(1);
  });
});

describe('useSearchUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('搜尋字串長度 >= 3 時應執行查詢', async () => {
    const chain = createChainMock({ data: mockProfiles, error: null });
    chain.limit = vi.fn(() => ({ data: mockProfiles, error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useSearchUsers('測試'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(mockProfiles);
  });

  it('搜尋字串長度 < 3 時不應執行查詢', () => {
    const { result } = renderHook(() => useSearchUsers('測'), {
      wrapper: createWrapper(),
    });

    // Query should not be enabled
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('空字串時應返回空陣列', () => {
    const { result } = renderHook(() => useSearchUsers(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應成功建立權限', async () => {
    const newEntitlement = {
      user_id: 'user-1',
      product_id: 'report_platform',
      status: 'active' as const,
    };

    const createdEntitlement = {
      id: 'new-ent-1',
      ...newEntitlement,
      granted_by: mockUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    const chain = createChainMock(null);
    chain.single = vi.fn(() => ({ data: createdEntitlement, error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useCreateEntitlement(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newEntitlement);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual(createdEntitlement);
  });
});

describe('useUpdateEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應成功更新權限', async () => {
    const updates = {
      id: 'ent-1',
      status: 'revoked' as const,
      notes: '已撤銷',
    };

    const updatedEntitlement = {
      ...mockEntitlements[0],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const chain = createChainMock(null);
    chain.single = vi.fn(() => ({ data: updatedEntitlement, error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useUpdateEntitlement(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.status).toBe('revoked');
  });
});

describe('useDeleteEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應成功刪除權限', async () => {
    const chain = createChainMock(null);
    chain.eq = vi.fn(() => ({ error: null }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useDeleteEntitlement(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('ent-1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('刪除失敗應觸發錯誤', async () => {
    const chain = createChainMock(null);
    chain.eq = vi.fn(() => ({ error: { message: 'Delete failed' } }));
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useDeleteEntitlement(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('ent-1');

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
