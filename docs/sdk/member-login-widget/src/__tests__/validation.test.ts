import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Inline validation schemas matching the widget's validation logic
const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email 不能為空' })
  .email({ message: '請輸入有效的 Email 地址' })
  .max(255, { message: 'Email 長度不能超過 255 字元' });

const passwordSchema = z
  .string()
  .min(6, { message: '密碼至少需要 6 個字元' })
  .max(72, { message: '密碼長度不能超過 72 字元' });

const displayNameSchema = z
  .string()
  .trim()
  .max(50, { message: '暱稱長度不能超過 50 字元' })
  .optional();

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should accept valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should accept email with subdomain', () => {
      const result = emailSchema.safeParse('user@mail.example.com');
      expect(result.success).toBe(true);
    });

    it('should reject empty string', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email 不能為空');
      }
    });

    it('should reject invalid email format', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('請輸入有效的 Email 地址');
      }
    });

    it('should reject email without domain', () => {
      const result = emailSchema.safeParse('user@');
      expect(result.success).toBe(false);
    });

    it('should reject email without @', () => {
      const result = emailSchema.safeParse('userexample.com');
      expect(result.success).toBe(false);
    });

    it('should trim whitespace', () => {
      const result = emailSchema.safeParse('  test@example.com  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test@example.com');
      }
    });

    it('should reject email exceeding max length', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = emailSchema.safeParse(longEmail);
      expect(result.success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('should accept valid password', () => {
      const result = passwordSchema.safeParse('password123');
      expect(result.success).toBe(true);
    });

    it('should accept password at minimum length', () => {
      const result = passwordSchema.safeParse('123456');
      expect(result.success).toBe(true);
    });

    it('should reject password below minimum length', () => {
      const result = passwordSchema.safeParse('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('密碼至少需要 6 個字元');
      }
    });

    it('should reject empty password', () => {
      const result = passwordSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should accept password at maximum length', () => {
      const result = passwordSchema.safeParse('a'.repeat(72));
      expect(result.success).toBe(true);
    });

    it('should reject password exceeding max length', () => {
      const result = passwordSchema.safeParse('a'.repeat(73));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('密碼長度不能超過 72 字元');
      }
    });

    it('should accept password with special characters', () => {
      const result = passwordSchema.safeParse('P@ssw0rd!#$%');
      expect(result.success).toBe(true);
    });

    it('should accept password with unicode characters', () => {
      const result = passwordSchema.safeParse('密碼測試123');
      expect(result.success).toBe(true);
    });
  });

  describe('displayNameSchema', () => {
    it('should accept valid display name', () => {
      const result = displayNameSchema.safeParse('Test User');
      expect(result.success).toBe(true);
    });

    it('should accept empty string (optional)', () => {
      const result = displayNameSchema.safeParse('');
      expect(result.success).toBe(true);
    });

    it('should accept undefined (optional)', () => {
      const result = displayNameSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should trim whitespace', () => {
      const result = displayNameSchema.safeParse('  Test User  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Test User');
      }
    });

    it('should accept display name at max length', () => {
      const result = displayNameSchema.safeParse('a'.repeat(50));
      expect(result.success).toBe(true);
    });

    it('should reject display name exceeding max length', () => {
      const result = displayNameSchema.safeParse('a'.repeat(51));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('暱稱長度不能超過 50 字元');
      }
    });

    it('should accept Chinese characters', () => {
      const result = displayNameSchema.safeParse('測試用戶');
      expect(result.success).toBe(true);
    });

    it('should accept special characters', () => {
      const result = displayNameSchema.safeParse('User_Name-123');
      expect(result.success).toBe(true);
    });
  });

  describe('Combined Form Validation', () => {
    const loginFormSchema = z.object({
      email: emailSchema,
      password: passwordSchema,
    });

    const signupFormSchema = z.object({
      email: emailSchema,
      password: passwordSchema,
      displayName: displayNameSchema,
    });

    it('should validate complete login form', () => {
      const result = loginFormSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject login form with invalid email', () => {
      const result = loginFormSchema.safeParse({
        email: 'invalid',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should validate complete signup form', () => {
      const result = signupFormSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('should validate signup form without display name', () => {
      const result = signupFormSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should collect all validation errors', () => {
      const result = loginFormSchema.safeParse({
        email: '',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(2);
      }
    });
  });
});
