/**
 * 會員模組主要匯出入口
 * 此模組包含所有會員相關功能，設計為可獨立遷移至會員中心專案
 */

// ==================== Types ====================
export * from './types';

// ==================== Context ====================
export { MemberProvider, useMember, MemberContext } from './context/MemberContext';
export type { MemberProviderProps } from './context/MemberContext';

// ==================== Hooks ====================
export {
  useProducts,
  usePlans,
  useMyEntitlements,
  useAllEntitlements,
  useCreateEntitlement,
  useUpdateEntitlement,
  useDeleteEntitlement,
  useSearchUsers,
  useProductAccess,
  useActiveProductIds,
} from './hooks/useEntitlements';

// ==================== Utils ====================
export {
  emailSchema,
  passwordSchema,
  displayNameSchema,
  loginFormSchema,
  signupFormSchema,
  resetPasswordSchema,
  validateLoginForm,
  validateSignupForm,
  validateEmail,
  validatePassword,
} from './utils/validation';
export type {
  LoginFormData,
  SignupFormData,
  ResetPasswordData,
  ValidationResult,
} from './utils/validation';

// ==================== Components ====================
export { MemberProtectedRoute } from './components/MemberProtectedRoute';
export { 
  MemberCardSkeleton,
  MemberListSkeleton,
  StatsCardSkeleton,
} from './components/MemberCardSkeleton';
export { MemberLoginWidget } from './components/MemberLoginWidget';
export type { MemberLoginWidgetProps } from './components/MemberLoginWidget';
