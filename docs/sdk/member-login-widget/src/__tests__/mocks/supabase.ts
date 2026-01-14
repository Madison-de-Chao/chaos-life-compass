import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';

// Mock User
export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00.000Z',
};

// Mock Session
export const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
};

// Mock Profile
export const mockProfile = {
  id: 'profile-id',
  user_id: 'test-user-id',
  display_name: 'Test User',
  full_name: 'Test User Full Name',
  avatar_url: null,
  phone: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

// Create mock Supabase client
export const createMockSupabaseClient = () => {
  const authStateChangeCallback = vi.fn();

  return {
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
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: { url: 'https://oauth.example.com', provider: 'google' },
        error: null,
      }),
      onAuthStateChange: vi.fn((callback) => {
        authStateChangeCallback.mockImplementation(callback);
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          })),
        })),
      })),
    })),
    _triggerAuthStateChange: (event: string, session: Session | null) => {
      authStateChangeCallback(event, session);
    },
  };
};

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
