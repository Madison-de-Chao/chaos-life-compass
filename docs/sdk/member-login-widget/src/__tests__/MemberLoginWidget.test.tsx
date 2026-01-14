import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemberLoginWidget } from '../MemberLoginWidget';
import { MemberProvider } from '../MemberContext';
import { createMockSupabaseClient, mockUser, mockSession } from './mocks/supabase';

describe('MemberLoginWidget', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = createMockSupabaseClient();
  });

  const renderWidget = (props = {}) => {
    return render(
      <MemberProvider supabaseClient={mockClient as any}>
        <MemberLoginWidget {...props} />
      </MemberProvider>
    );
  };

  describe('Rendering', () => {
    it('should render login form by default', () => {
      renderWidget();

      expect(screen.getByRole('button', { name: /登入/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/密碼/i)).toBeInTheDocument();
    });

    it('should show title when showTitle is true', () => {
      renderWidget({ showTitle: true });

      expect(screen.getByText(/會員登入/i)).toBeInTheDocument();
    });

    it('should hide title when showTitle is false', () => {
      renderWidget({ showTitle: false });

      expect(screen.queryByText(/會員登入/i)).not.toBeInTheDocument();
    });

    it('should show close button when onClose is provided', () => {
      const onClose = vi.fn();
      renderWidget({ onClose });

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should not show close button when onClose is not provided', () => {
      renderWidget();

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to registration form', async () => {
      renderWidget();

      const registerTab = screen.getByRole('button', { name: /註冊/i });
      await userEvent.click(registerTab);

      expect(screen.getByPlaceholderText(/暱稱/i)).toBeInTheDocument();
    });

    it('should switch back to login form', async () => {
      renderWidget();

      const registerTab = screen.getByRole('button', { name: /註冊/i });
      await userEvent.click(registerTab);

      const loginTab = screen.getByRole('button', { name: /登入/i });
      await userEvent.click(loginTab);

      expect(screen.queryByPlaceholderText(/暱稱/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for invalid email', async () => {
      const onToast = vi.fn();
      renderWidget({ onToast });

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      const submitButton = screen.getByRole('button', { name: /登入$/ });

      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      expect(onToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });

    it('should show error for short password', async () => {
      const onToast = vi.fn();
      renderWidget({ onToast });

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      const submitButton = screen.getByRole('button', { name: /登入$/ });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, '123');
      await userEvent.click(submitButton);

      expect(onToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });
  });

  describe('Login Flow', () => {
    it('should call signIn with correct credentials', async () => {
      renderWidget();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      const submitButton = screen.getByRole('button', { name: /登入$/ });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should call onSuccess after successful login', async () => {
      const onSuccess = vi.fn();
      renderWidget({ onSuccess });

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      const submitButton = screen.getByRole('button', { name: /登入$/ });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should handle login error', async () => {
      const onToast = vi.fn();
      mockClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', status: 400 },
      });

      renderWidget({ onToast });

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      const submitButton = screen.getByRole('button', { name: /登入$/ });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(onToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'destructive',
          })
        );
      });
    });
  });

  describe('Registration Flow', () => {
    it('should call signUp with correct data', async () => {
      renderWidget();

      // Switch to register tab
      const registerTab = screen.getByRole('button', { name: /註冊/i });
      await userEvent.click(registerTab);

      const displayNameInput = screen.getByPlaceholderText(/暱稱/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      const submitButton = screen.getByRole('button', { name: /註冊$/ });

      await userEvent.type(displayNameInput, 'Test User');
      await userEvent.type(emailInput, 'new@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockClient.auth.signUp).toHaveBeenCalledWith({
          email: 'new@example.com',
          password: 'password123',
          options: {
            data: { display_name: 'Test User' },
          },
        });
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      renderWidget();

      const passwordInput = screen.getByPlaceholderText(/密碼/i);
      expect(passwordInput).toHaveAttribute('type', 'password');

      const toggleButton = screen.getByRole('button', { name: /toggle password/i });
      await userEvent.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');

      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Google Sign In', () => {
    it('should call signInWithOAuth when Google button is clicked', async () => {
      renderWidget();

      const googleButton = screen.getByRole('button', { name: /google/i });
      await userEvent.click(googleButton);

      await waitFor(() => {
        expect(mockClient.auth.signInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: expect.any(Object),
        });
      });
    });
  });

  describe('Close Button', () => {
    it('should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      renderWidget({ onClose });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Logged In State', () => {
    it('should show logged in message when user is authenticated', async () => {
      mockClient.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      renderWidget();

      await waitFor(() => {
        expect(screen.getByText(/您已登入/i)).toBeInTheDocument();
      });
    });
  });
});
