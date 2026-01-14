/**
 * Supabase Mock 物件
 * 模擬 Supabase 客戶端和資料
 */

import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';

// Mock User 物件
export const mockUser: User = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: null,
  confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    display_name: '測試用戶',
  },
  identities: [],
  factors: [],
};

// Mock Session 物件
export const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: mockUser,
};

// Mock Profile 物件
export const mockProfile = {
  id: 'profile-id-123',
  user_id: 'test-user-id-123',
  display_name: '測試用戶',
  full_name: '測試用戶全名',
  nickname: '小測',
  avatar_url: null,
  bio: '這是一個測試帳號',
  phone: null,
  gender: null,
  birth_date: null,
  birth_time: null,
  birth_place: null,
  subscription_status: 'free',
  subscription_started_at: null,
  subscription_expires_at: null,
  total_spent: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock User Roles
export const mockUserRoles = [
  { role: 'user' as const },
];

export const mockAdminRoles = [
  { role: 'admin' as const },
  { role: 'user' as const },
];

// 建立 Mock Supabase Client
export function createMockSupabaseClient() {
  let authStateCallback: ((event: string, session: Session | null) => void) | null = null;

  const mockClient = {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({
        error: null,
      }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({
        data: {},
        error: null,
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: { provider: 'google', url: 'https://google.com/auth' },
        error: null,
      }),
      onAuthStateChange: vi.fn((callback: (event: string, session: Session | null) => void) => {
        authStateCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }),
    },
    from: vi.fn((tableName: string) => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: tableName === 'profiles' ? mockProfile : null,
        error: null,
      }),
      maybeSingle: vi.fn().mockResolvedValue({
        data: tableName === 'profiles' ? mockProfile : null,
        error: null,
      }),
      then: vi.fn().mockResolvedValue({
        data: tableName === 'user_roles' ? mockUserRoles : [],
        error: null,
      }),
    })),
    // 測試輔助方法
    _triggerAuthStateChange: (event: string, session: Session | null) => {
      if (authStateCallback) {
        authStateCallback(event, session);
      }
    },
  };

  return mockClient;
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
