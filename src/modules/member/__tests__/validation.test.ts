/**
 * 驗證工具函數測試
 */

import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  displayNameSchema,
  loginFormSchema,
  signupFormSchema,
  validateLoginForm,
  validateSignupForm,
  validateEmail,
  validatePassword,
} from '../utils/validation';

describe('emailSchema', () => {
  it('應接受有效的 email', () => {
    const result = emailSchema.safeParse('test@example.com');
    expect(result.success).toBe(true);
  });

  it('應拒絕空字串', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email 不能為空');
    }
  });

  it('應拒絕無效的 email 格式', () => {
    const result = emailSchema.safeParse('not-an-email');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('請輸入有效的 Email 地址');
    }
  });

  it('應自動修剪空白', () => {
    const result = emailSchema.safeParse('  test@example.com  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('test@example.com');
    }
  });

  it('應拒絕過長的 email', () => {
    const longEmail = 'a'.repeat(250) + '@test.com';
    const result = emailSchema.safeParse(longEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email 長度不能超過 255 字元');
    }
  });
});

describe('passwordSchema', () => {
  it('應接受有效的密碼 (6-72 字元)', () => {
    const result = passwordSchema.safeParse('password123');
    expect(result.success).toBe(true);
  });

  it('應拒絕過短的密碼', () => {
    const result = passwordSchema.safeParse('12345');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('密碼至少需要 6 個字元');
    }
  });

  it('應拒絕過長的密碼', () => {
    const longPassword = 'a'.repeat(73);
    const result = passwordSchema.safeParse(longPassword);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('密碼長度不能超過 72 字元');
    }
  });

  it('應接受剛好 6 個字元的密碼', () => {
    const result = passwordSchema.safeParse('123456');
    expect(result.success).toBe(true);
  });

  it('應接受剛好 72 個字元的密碼', () => {
    const result = passwordSchema.safeParse('a'.repeat(72));
    expect(result.success).toBe(true);
  });
});

describe('displayNameSchema', () => {
  it('應接受有效的暱稱', () => {
    const result = displayNameSchema.safeParse('測試用戶');
    expect(result.success).toBe(true);
  });

  it('應接受空值 (optional)', () => {
    const result = displayNameSchema.safeParse(undefined);
    expect(result.success).toBe(true);
  });

  it('應接受空字串', () => {
    const result = displayNameSchema.safeParse('');
    expect(result.success).toBe(true);
  });

  it('應拒絕過長的暱稱', () => {
    const longName = 'a'.repeat(51);
    const result = displayNameSchema.safeParse(longName);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('暱稱長度不能超過 50 字元');
    }
  });

  it('應自動修剪空白', () => {
    const result = displayNameSchema.safeParse('  測試用戶  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('測試用戶');
    }
  });
});

describe('loginFormSchema', () => {
  it('應接受有效的登入表單', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('應拒絕無效的 email', () => {
    const result = loginFormSchema.safeParse({
      email: 'not-valid',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('應拒絕過短的密碼', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('signupFormSchema', () => {
  it('應接受有效的註冊表單', () => {
    const result = signupFormSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      displayName: '測試用戶',
    });
    expect(result.success).toBe(true);
  });

  it('應接受沒有暱稱的註冊表單', () => {
    const result = signupFormSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('應拒絕無效資料', () => {
    const result = signupFormSchema.safeParse({
      email: 'invalid',
      password: '12',
      displayName: 'a'.repeat(60),
    });
    expect(result.success).toBe(false);
  });
});

describe('validateLoginForm', () => {
  it('應回傳成功結果', () => {
    const result = validateLoginForm({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('應回傳錯誤訊息', () => {
    const result = validateLoginForm({
      email: 'invalid',
      password: '12',
    });
    expect(result.success).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });
});

describe('validateSignupForm', () => {
  it('應回傳成功結果', () => {
    const result = validateSignupForm({
      email: 'test@example.com',
      password: 'password123',
      displayName: '測試',
    });
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('應回傳多個錯誤', () => {
    const result = validateSignupForm({
      email: '',
      password: '',
      displayName: 'a'.repeat(60),
    });
    expect(result.success).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });
});

describe('validateEmail', () => {
  it('應回傳有效結果', () => {
    const result = validateEmail('test@example.com');
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it('應回傳無效結果和錯誤訊息', () => {
    const result = validateEmail('invalid');
    expect(result.valid).toBe(false);
    expect(result.message).toBeDefined();
  });
});

describe('validatePassword', () => {
  it('應回傳有效結果', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it('應回傳無效結果和錯誤訊息', () => {
    const result = validatePassword('12');
    expect(result.valid).toBe(false);
    expect(result.message).toBeDefined();
  });
});
