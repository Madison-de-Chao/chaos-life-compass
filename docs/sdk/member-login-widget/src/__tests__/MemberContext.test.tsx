import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import { MemberProvider, useMember } from '../MemberContext';
import { createMockSupabaseClient, mockUser, mockSession, mockProfile } from './mocks/supabase';

// Test component to access context
const TestConsumer: React.FC = () => {
  const context = useMember();
  return (
    <div>
      <span data-testid="loading">{context.loading.toString()}</span>
      <span data-testid="user">{context.user?.email || 'no-user'}</span>
      <span data-testid="profile">{context.profile?.display_name || 'no-profile'}</span>
    </div>
  );
};

describe('MemberContext', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = createMockSupabaseClient();
  });

  describe('MemberProvider', () => {
    it('should render children', () => {
      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <div data-testid="child">Hello</div>
        </MemberProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should start with loading state', () => {
      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <TestConsumer />
        </MemberProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('true');
    });

    it('should initialize with no user when not authenticated', async () => {
      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <TestConsumer />
        </MemberProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should load user profile when session exists', async () => {
      mockClient.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <TestConsumer />
        </MemberProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email!);
    });

    it('should call onAuthStateChange callback', async () => {
      const onAuthStateChange = vi.fn();

      render(
        <MemberProvider 
          supabaseClient={mockClient as any}
          onAuthStateChange={onAuthStateChange}
        >
          <TestConsumer />
        </MemberProvider>
      );

      await waitFor(() => {
        expect(mockClient.auth.onAuthStateChange).toHaveBeenCalled();
      });
    });
  });

  describe('useMember hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useMember must be used within a MemberProvider');

      consoleError.mockRestore();
    });

    it('should provide signIn method', async () => {
      const SignInTest: React.FC = () => {
        const { signIn } = useMember();
        const handleSignIn = async () => {
          await signIn('test@example.com', 'password123');
        };
        return <button onClick={handleSignIn}>Sign In</button>;
      };

      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <SignInTest />
        </MemberProvider>
      );

      await act(async () => {
        screen.getByText('Sign In').click();
      });

      expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should provide signUp method', async () => {
      const SignUpTest: React.FC = () => {
        const { signUp } = useMember();
        const handleSignUp = async () => {
          await signUp('new@example.com', 'password123', 'New User');
        };
        return <button onClick={handleSignUp}>Sign Up</button>;
      };

      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <SignUpTest />
        </MemberProvider>
      );

      await act(async () => {
        screen.getByText('Sign Up').click();
      });

      expect(mockClient.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: { display_name: 'New User' },
        },
      });
    });

    it('should provide signOut method', async () => {
      mockClient.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const SignOutTest: React.FC = () => {
        const { signOut } = useMember();
        return <button onClick={signOut}>Sign Out</button>;
      };

      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <SignOutTest />
        </MemberProvider>
      );

      await act(async () => {
        screen.getByText('Sign Out').click();
      });

      expect(mockClient.auth.signOut).toHaveBeenCalled();
    });

    it('should provide resetPassword method', async () => {
      const ResetTest: React.FC = () => {
        const { resetPassword } = useMember();
        const handleReset = async () => {
          await resetPassword('test@example.com');
        };
        return <button onClick={handleReset}>Reset</button>;
      };

      render(
        <MemberProvider supabaseClient={mockClient as any}>
          <ResetTest />
        </MemberProvider>
      );

      await act(async () => {
        screen.getByText('Reset').click();
      });

      expect(mockClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(Object)
      );
    });
  });
});
