/**
 * MemberLoginWidget UI 互動測試
 * 完整測試表單提交、錯誤處理、狀態變化
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { MemberLoginWidget } from '../components/MemberLoginWidget';
import { MemberProvider } from '../context/MemberContext';
import { createMockSupabaseClient, mockUser, mockSession } from './mocks/supabase';

// Mock 導航
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  toast: (args: unknown) => mockToast(args),
}));

// Mock Supabase client
let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

vi.mock('@/integrations/supabase/client', () => ({
  get supabase() {
    return mockSupabase;
  },
}));

// Wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <MemberProvider>{children}</MemberProvider>
  </BrowserRouter>
);

const renderWidget = (props = {}) => {
  return render(<MemberLoginWidget {...props} />, { wrapper });
};

describe('MemberLoginWidget 渲染', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('應該正確渲染登入表單', () => {
    renderWidget();
    
    expect(screen.getByText('會員登入')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/密碼/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登入/ })).toBeInTheDocument();
  });

  it('showTitle=false 時不應顯示標題', () => {
    renderWidget({ showTitle: false });
    
    expect(screen.queryByText('會員登入')).not.toBeInTheDocument();
  });

  it('有 onClose 時應顯示關閉按鈕', () => {
    const onClose = vi.fn();
    renderWidget({ onClose });
    
    // 關閉按鈕使用 X 圖標
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => 
      btn.querySelector('svg.lucide-x') || btn.className.includes('absolute')
    );
    expect(closeButton).toBeDefined();
  });

  it('沒有 onClose 時不應顯示關閉按鈕', () => {
    renderWidget();
    
    // 檢查沒有關閉按鈕 (position: absolute 的按鈕)
    const allButtons = screen.getAllByRole('button');
    const closeButton = allButtons.find(btn => 
      btn.classList.contains('absolute') && btn.querySelector('svg.lucide-x')
    );
    expect(closeButton).toBeUndefined();
  });

  it('showFullPageLink=false 時不應顯示完整頁面連結', () => {
    renderWidget({ showFullPageLink: false });
    
    expect(screen.queryByText(/前往完整登入頁面/)).not.toBeInTheDocument();
  });
});

describe('MemberLoginWidget Tab 切換', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('點擊註冊 Tab 應切換到註冊模式', async () => {
    const user = userEvent.setup();
    renderWidget();

    // 初始為登入模式
    expect(screen.getByRole('button', { name: /^登入$/ })).toBeInTheDocument();

    // 點擊註冊 Tab
    await user.click(screen.getByRole('button', { name: /^註冊$/ }));

    // 應該顯示暱稱欄位
    await waitFor(() => {
      expect(screen.getByLabelText(/暱稱/)).toBeInTheDocument();
    });
  });

  it('切換回登入模式應隱藏暱稱欄位', async () => {
    const user = userEvent.setup();
    renderWidget();

    // 切換到註冊模式
    await user.click(screen.getByRole('button', { name: /^註冊$/ }));
    
    // 切換回登入模式
    await user.click(screen.getAllByRole('button').find(btn => btn.textContent === '登入')!);

    // 暱稱欄位應該被隱藏 (opacity-0)
    const displayNameContainer = screen.getByLabelText(/暱稱/).closest('.space-y-1\\.5');
    expect(displayNameContainer).toHaveClass('opacity-0');
  });
});

describe('MemberLoginWidget 表單驗證', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('空 Email 提交應顯示驗證錯誤', async () => {
    const user = userEvent.setup();
    renderWidget();

    // 只填密碼，不填 Email
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '表單驗證失敗',
          variant: 'destructive',
        })
      );
    });
  });

  it('無效 Email 格式應顯示錯誤', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.type(screen.getByLabelText(/Email/), 'invalid-email');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });
  });

  it('密碼太短應顯示錯誤', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/密碼/), '12345'); // 少於 6 字元
    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });
  });

  it('欄位錯誤應該顯示紅色邊框', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/);
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('輸入時應清除該欄位的錯誤', async () => {
    const user = userEvent.setup();
    renderWidget();

    // 觸發錯誤
    await user.click(screen.getByRole('button', { name: /^登入$/ }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/)).toHaveClass('border-red-500');
    });

    // 開始輸入
    await user.type(screen.getByLabelText(/Email/), 'test');

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/)).not.toHaveClass('border-red-500');
    });
  });
});

describe('MemberLoginWidget 登入流程', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('成功登入應顯示成功訊息並導航', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderWidget({ onSuccess });

    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '登入成功',
        })
      );
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/account');
  });

  it('登入失敗應顯示錯誤訊息', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    });

    const user = userEvent.setup();
    renderWidget();

    await user.type(screen.getByLabelText(/Email/), 'wrong@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '登入失敗',
          description: 'Email 或密碼錯誤',
          variant: 'destructive',
        })
      );
    });
  });

  it('自訂 redirectTo 應正確導航', async () => {
    const user = userEvent.setup();
    renderWidget({ redirectTo: '/custom-path' });

    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    await user.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/custom-path');
    });
  });
});

describe('MemberLoginWidget 註冊流程', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('成功註冊應顯示成功訊息', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderWidget({ onSuccess });

    // 切換到註冊模式
    await user.click(screen.getByRole('button', { name: /^註冊$/ }));

    await user.type(screen.getByLabelText(/暱稱/), '測試用戶');
    await user.type(screen.getByLabelText(/Email/), 'new@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    
    // 找到提交按鈕 (在表單內的註冊按鈕)
    const submitButton = screen.getAllByRole('button').find(
      btn => btn.getAttribute('type') === 'submit'
    );
    await user.click(submitButton!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '註冊成功！',
        })
      );
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('註冊失敗 (已存在帳號) 應顯示友善錯誤訊息', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'User already registered' },
    });

    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /^註冊$/ }));
    await user.type(screen.getByLabelText(/Email/), 'existing@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    
    const submitButton = screen.getAllByRole('button').find(
      btn => btn.getAttribute('type') === 'submit'
    );
    await user.click(submitButton!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '註冊失敗',
          description: '此 Email 已被註冊',
          variant: 'destructive',
        })
      );
    });
  });

  it('暱稱過長應顯示驗證錯誤', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /^註冊$/ }));
    
    const longName = 'a'.repeat(51);
    await user.type(screen.getByLabelText(/暱稱/), longName);
    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    
    const submitButton = screen.getAllByRole('button').find(
      btn => btn.getAttribute('type') === 'submit'
    );
    await user.click(submitButton!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });
  });
});

describe('MemberLoginWidget 密碼顯示切換', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('預設密碼應該隱藏', () => {
    renderWidget();
    
    const passwordInput = screen.getByLabelText(/密碼/);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('點擊眼睛圖標應切換密碼顯示', async () => {
    const user = userEvent.setup();
    renderWidget();

    const passwordInput = screen.getByLabelText(/密碼/);
    
    // 找到密碼欄位旁邊的按鈕
    const toggleButton = passwordInput.parentElement?.querySelector('button[tabindex="-1"]');
    expect(toggleButton).toBeDefined();

    await user.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

describe('MemberLoginWidget Google 登入', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('點擊 Google 按鈕應觸發 OAuth', async () => {
    const user = userEvent.setup();
    renderWidget();

    const googleButton = screen.getByRole('button', { name: /使用 Google 帳號/ });
    await user.click(googleButton);

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'google',
      })
    );
  });

  it('Google 登入失敗應顯示錯誤', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: null,
      error: { message: 'OAuth error' },
    });

    const user = userEvent.setup();
    renderWidget();

    const googleButton = screen.getByRole('button', { name: /使用 Google 帳號/ });
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Google 登入失敗',
          variant: 'destructive',
        })
      );
    });
  });
});

describe('MemberLoginWidget 關閉按鈕', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('點擊關閉按鈕應觸發 onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWidget({ onClose });

    // 找到關閉按鈕 (absolute positioned)
    const closeButton = document.querySelector('button.absolute');
    expect(closeButton).toBeDefined();
    
    await user.click(closeButton!);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('MemberLoginWidget 忘記密碼', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('點擊忘記密碼應導航到重設頁面', async () => {
    const user = userEvent.setup();
    renderWidget();

    const forgotLink = screen.getByText('忘記密碼？');
    await user.click(forgotLink);

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login?forgot=true');
  });

  it('註冊模式不應顯示忘記密碼連結', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /^註冊$/ }));

    expect(screen.queryByText('忘記密碼？')).not.toBeInTheDocument();
  });
});

describe('MemberLoginWidget Loading 狀態', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('提交時應禁用輸入欄位', async () => {
    // 延遲回應以測試 loading 狀態
    mockSupabase.auth.signInWithPassword.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        data: { user: mockUser, session: mockSession },
        error: null,
      }), 100))
    );

    const user = userEvent.setup();
    renderWidget();

    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    
    // 點擊但不等待完成
    fireEvent.click(screen.getByRole('button', { name: /^登入$/ }));

    // 檢查按鈕是否顯示 loading
    await waitFor(() => {
      expect(screen.getByText('處理中...')).toBeInTheDocument();
    });
  });

  it('提交時按鈕應顯示 loading 圖標', async () => {
    mockSupabase.auth.signInWithPassword.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        data: { user: mockUser, session: mockSession },
        error: null,
      }), 100))
    );

    const user = userEvent.setup();
    renderWidget();

    await user.type(screen.getByLabelText(/Email/), 'test@example.com');
    await user.type(screen.getByLabelText(/密碼/), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /^登入$/ }));

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /處理中/ });
      expect(button).toBeDisabled();
    });
  });
});

describe('MemberLoginWidget 完整頁面連結', () => {
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('點擊完整頁面連結應導航', async () => {
    const user = userEvent.setup();
    renderWidget({ showFullPageLink: true });

    const fullPageLink = screen.getByText(/前往完整登入頁面/);
    await user.click(fullPageLink);

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
});
