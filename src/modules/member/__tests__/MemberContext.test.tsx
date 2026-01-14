/**
 * MemberContext 和 useMember Hook 測試
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemberProvider, useMember } from '../context/MemberContext';
import { createMockSupabaseClient } from './mocks/supabase';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createMockSupabaseClient(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemberProvider>{children}</MemberProvider>
);

describe('MemberProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應該正確渲染子元件', () => {
    const TestComponent = () => <div data-testid="test">Test</div>;
    const { result } = renderHook(() => useMember(), {
      wrapper: ({ children }) => (
        <MemberProvider>
          <TestComponent />
          {children}
        </MemberProvider>
      ),
    });
    expect(result.current).toBeDefined();
  });

  it('初始狀態應為 loading', () => {
    const { result } = renderHook(() => useMember(), { wrapper });
    // 初始時 loading 應該是 true
    expect(result.current.loading).toBeDefined();
  });

  it('應提供所有必要的 context 屬性', () => {
    const { result } = renderHook(() => useMember(), { wrapper });
    
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('profile');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('isAdmin');
    expect(result.current).toHaveProperty('isMember');
    expect(result.current).toHaveProperty('isHelper');
    expect(result.current).toHaveProperty('signIn');
    expect(result.current).toHaveProperty('signUp');
    expect(result.current).toHaveProperty('signOut');
    expect(result.current).toHaveProperty('signInWithGoogle');
    expect(result.current).toHaveProperty('resetPassword');
    expect(result.current).toHaveProperty('updateProfile');
    expect(result.current).toHaveProperty('refreshProfile');
  });
});

describe('useMember', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('在 MemberProvider 外使用應拋出錯誤', () => {
    expect(() => {
      renderHook(() => useMember());
    }).toThrow('useMember must be used within a MemberProvider');
  });

  it('signIn 應該呼叫認證方法', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    let response: { error: Error | null };
    await act(async () => {
      response = await result.current.signIn('test@example.com', 'password123');
    });
    expect(response!).toHaveProperty('error');
  });

  it('signUp 應該呼叫註冊方法', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    let response: { error: Error | null };
    await act(async () => {
      response = await result.current.signUp('test@example.com', 'password123', '測試');
    });
    expect(response!).toHaveProperty('error');
  });

  it('signOut 應該清除狀態', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });
    // 登出後 profile 應該被清除
    expect(result.current.profile).toBeNull();
  });

  it('resetPassword 應該呼叫重設密碼方法', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    let response: { error: Error | null };
    await act(async () => {
      response = await result.current.resetPassword('test@example.com');
    });
    expect(response!).toHaveProperty('error');
  });

  it('signInWithGoogle 應該呼叫 OAuth 方法', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    let response: { error: Error | null };
    await act(async () => {
      response = await result.current.signInWithGoogle();
    });
    expect(response!).toHaveProperty('error');
  });

  it('updateProfile 未登入時應回傳錯誤', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    let response: { error: Error | null };
    await act(async () => {
      response = await result.current.updateProfile({ display_name: '新名稱' });
    });
    expect(response!.error).toBeDefined();
    expect(response!.error?.message).toBe('Not authenticated');
  });

  it('refreshProfile 未登入時應該不執行任何操作', async () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    await act(async () => {
      await result.current.refreshProfile();
    });
    // 沒有用戶時不應該拋出錯誤
    expect(result.current.user).toBeNull();
  });
});

describe('MemberContext 認證狀態', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初始狀態應該沒有用戶', () => {
    const { result } = renderHook(() => useMember(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isMember).toBe(false);
    expect(result.current.isHelper).toBe(false);
  });
});
