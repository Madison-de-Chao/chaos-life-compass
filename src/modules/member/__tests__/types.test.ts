/**
 * 型別定義測試
 * 確保型別定義正確且可用
 */

import { describe, it, expect } from 'vitest';
import type { Profile, MemberContextType } from '../types';

describe('Profile 型別', () => {
  it('應該符合預期的結構', () => {
    const profile: Profile = {
      id: 'test-id',
      user_id: 'user-id',
      display_name: '測試用戶',
      full_name: '測試全名',
      nickname: '小測',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: '這是簡介',
      phone: '0912345678',
      gender: 'male',
      birth_date: '1990-01-01',
      birth_time: '12:00',
      birth_place: '台北',
      subscription_status: 'active',
      subscription_started_at: '2024-01-01',
      subscription_expires_at: '2025-01-01',
      total_spent: 1000,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    expect(profile.id).toBe('test-id');
    expect(profile.user_id).toBe('user-id');
    expect(profile.display_name).toBe('測試用戶');
    expect(profile.subscription_status).toBe('active');
  });

  it('應該允許可選欄位為 null', () => {
    const profile: Profile = {
      id: 'test-id',
      user_id: 'user-id',
      display_name: null,
      full_name: null,
      nickname: null,
      avatar_url: null,
      bio: null,
      phone: null,
      gender: null,
      birth_date: null,
      birth_time: null,
      birth_place: null,
      subscription_status: 'free',
      subscription_started_at: null,
      subscription_expires_at: null,
      total_spent: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    expect(profile.display_name).toBeNull();
    expect(profile.avatar_url).toBeNull();
    expect(profile.subscription_status).toBe('free');
  });
});

describe('MemberContextType 型別', () => {
  it('應該定義所有必要的屬性', () => {
    // 這是一個型別檢查測試，主要在編譯時驗證
    const contextTypeCheck: MemberContextType = {
      user: null,
      session: null,
      profile: null,
      loading: false,
      isAdmin: false,
      isMember: false,
      isHelper: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signInWithGoogle: async () => ({ error: null }),
      resetPassword: async () => ({ error: null }),
      signOut: async () => {},
      updateProfile: async () => ({ error: null }),
      refreshProfile: async () => {},
    };

    expect(contextTypeCheck.user).toBeNull();
    expect(contextTypeCheck.loading).toBe(false);
    expect(typeof contextTypeCheck.signIn).toBe('function');
    expect(typeof contextTypeCheck.signUp).toBe('function');
    expect(typeof contextTypeCheck.signOut).toBe('function');
    expect(typeof contextTypeCheck.signInWithGoogle).toBe('function');
    expect(typeof contextTypeCheck.resetPassword).toBe('function');
    expect(typeof contextTypeCheck.updateProfile).toBe('function');
    expect(typeof contextTypeCheck.refreshProfile).toBe('function');
  });

  it('應該正確處理角色布林值', () => {
    const adminContext: Partial<MemberContextType> = {
      isAdmin: true,
      isMember: true,
      isHelper: false,
    };

    expect(adminContext.isAdmin).toBe(true);
    expect(adminContext.isMember).toBe(true);
    expect(adminContext.isHelper).toBe(false);
  });
});

describe('ValidationResult 型別', () => {
  it('應該正確表示成功結果', () => {
    interface ValidationResult {
      success: boolean;
      errors: Record<string, string>;
    }

    const successResult: ValidationResult = {
      success: true,
      errors: {},
    };

    expect(successResult.success).toBe(true);
    expect(Object.keys(successResult.errors)).toHaveLength(0);
  });

  it('應該正確表示失敗結果', () => {
    interface ValidationResult {
      success: boolean;
      errors: Record<string, string>;
    }

    const failureResult: ValidationResult = {
      success: false,
      errors: {
        email: 'Email 不能為空',
        password: '密碼至少需要 6 個字元',
      },
    };

    expect(failureResult.success).toBe(false);
    expect(failureResult.errors.email).toBe('Email 不能為空');
    expect(failureResult.errors.password).toBe('密碼至少需要 6 個字元');
  });
});
