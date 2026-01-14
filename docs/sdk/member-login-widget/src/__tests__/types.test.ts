import { describe, it, expect } from 'vitest';
import type { Profile, SignUpOptions, AuthResponse, AuthError } from '../types';

describe('Type Definitions', () => {
  describe('Profile type', () => {
    it('should allow valid profile object', () => {
      const profile: Profile = {
        id: 'profile-123',
        user_id: 'user-123',
        display_name: 'Test User',
        full_name: 'Test User Full Name',
        avatar_url: 'https://example.com/avatar.jpg',
        phone: '+1234567890',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      expect(profile.id).toBe('profile-123');
      expect(profile.display_name).toBe('Test User');
    });

    it('should allow null values for optional fields', () => {
      const profile: Profile = {
        id: 'profile-123',
        user_id: 'user-123',
        display_name: null,
        full_name: null,
        avatar_url: null,
        phone: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      expect(profile.display_name).toBeNull();
      expect(profile.avatar_url).toBeNull();
    });
  });

  describe('SignUpOptions type', () => {
    it('should allow empty options object', () => {
      const options: SignUpOptions = {};
      expect(options.displayName).toBeUndefined();
    });

    it('should allow display name', () => {
      const options: SignUpOptions = {
        displayName: 'New User',
      };
      expect(options.displayName).toBe('New User');
    });

    it('should allow metadata', () => {
      const options: SignUpOptions = {
        metadata: {
          source: 'web',
          referrer: 'homepage',
        },
      };
      expect(options.metadata?.source).toBe('web');
    });

    it('should allow both displayName and metadata', () => {
      const options: SignUpOptions = {
        displayName: 'New User',
        metadata: {
          source: 'mobile',
        },
      };
      expect(options.displayName).toBe('New User');
      expect(options.metadata?.source).toBe('mobile');
    });
  });

  describe('AuthResponse type', () => {
    it('should allow null error for success', () => {
      const response: AuthResponse = {
        error: null,
      };
      expect(response.error).toBeNull();
    });
  });

  describe('Type guards and utilities', () => {
    it('should check for profile existence', () => {
      const hasProfile = (profile: Profile | null): profile is Profile => {
        return profile !== null;
      };

      const validProfile: Profile = {
        id: 'profile-123',
        user_id: 'user-123',
        display_name: 'Test',
        full_name: null,
        avatar_url: null,
        phone: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      expect(hasProfile(validProfile)).toBe(true);
      expect(hasProfile(null)).toBe(false);
    });

    it('should extract display name from profile', () => {
      const getDisplayName = (profile: Profile | null): string => {
        return profile?.display_name || profile?.full_name || 'Anonymous';
      };

      const profileWithDisplayName: Profile = {
        id: '1',
        user_id: '1',
        display_name: 'Display Name',
        full_name: 'Full Name',
        avatar_url: null,
        phone: null,
        created_at: '',
        updated_at: '',
      };

      const profileWithOnlyFullName: Profile = {
        id: '1',
        user_id: '1',
        display_name: null,
        full_name: 'Only Full Name',
        avatar_url: null,
        phone: null,
        created_at: '',
        updated_at: '',
      };

      expect(getDisplayName(profileWithDisplayName)).toBe('Display Name');
      expect(getDisplayName(profileWithOnlyFullName)).toBe('Only Full Name');
      expect(getDisplayName(null)).toBe('Anonymous');
    });
  });
});
