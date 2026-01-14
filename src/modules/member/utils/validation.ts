/**
 * 登入表單驗證 Schema
 * 集中管理所有會員認證相關的驗證邏輯
 */

import { z } from 'zod';

// ==================== 基礎驗證 Schema ====================

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email 不能為空" })
  .email({ message: "請輸入有效的 Email 地址" })
  .max(255, { message: "Email 長度不能超過 255 字元" });

export const passwordSchema = z
  .string()
  .min(6, { message: "密碼至少需要 6 個字元" })
  .max(72, { message: "密碼長度不能超過 72 字元" });

export const displayNameSchema = z
  .string()
  .trim()
  .max(50, { message: "暱稱長度不能超過 50 字元" })
  .optional();

// ==================== 表單驗證 Schema ====================

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// ==================== 型別匯出 ====================

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

// ==================== 驗證輔助函數 ====================

export interface ValidationResult {
  success: boolean;
  errors: Record<string, string>;
}

export function validateLoginForm(data: { email: string; password: string }): ValidationResult {
  const result = loginFormSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, errors: {} };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });
  
  return { success: false, errors };
}

export function validateSignupForm(data: { 
  email: string; 
  password: string; 
  displayName?: string 
}): ValidationResult {
  const result = signupFormSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, errors: {} };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });
  
  return { success: false, errors };
}

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const result = emailSchema.safeParse(email);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, message: result.error.issues[0]?.message };
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  const result = passwordSchema.safeParse(password);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, message: result.error.issues[0]?.message };
}
