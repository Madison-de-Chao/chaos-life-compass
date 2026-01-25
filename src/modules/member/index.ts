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
  useClearEntitlementsCache,
} from './hooks/useEntitlements';
export { useLocalDocumentStats } from './hooks/useLocalDocumentStats';
export type { LocalDocumentStats } from './hooks/useLocalDocumentStats';

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
export { MemberAuthHeader } from './components/MemberAuthHeader';
export type { 
  MemberAuthHeaderProps, 
  MemberAuthHeaderTheme, 
  MemberAuthHeaderConfig 
} from './components/MemberAuthHeader';
export { MemberStatusBar } from './components/MemberStatusBar';
export type { MemberStatusBarProps } from './components/MemberStatusBar';
export { default as OAuthAuthorizePage } from './components/OAuthAuthorizePage';

// ==================== Pages ====================
export { UnifiedAuthPage, UnifiedDashboard, UnifiedProfilePage } from './pages';
