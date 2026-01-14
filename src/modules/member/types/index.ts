/**
 * 會員模組核心型別定義
 * 此檔案定義所有會員系統相關的型別，方便後續遷移至獨立專案
 */

import { User, Session } from "@supabase/supabase-js";

// ==================== Profile Types ====================

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  nickname: string | null;
  display_name: string | null;
  phone: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_place: string | null;
  gender: string | null;
  avatar_url: string | null;
  bio: string | null;
  subscription_status: SubscriptionStatus;
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  total_spent: number | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'cancelled' | 'expired';

// ==================== Entitlement Types ====================

export interface Product {
  id: string;
  name: string;
  description: string | null;
  purchase_type: string;
  price: number | null;
  duration_days: number | null;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  duration_days: number | null;
  created_at: string;
  updated_at: string;
}

export type EntitlementStatus = 'active' | 'expired' | 'revoked';

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  plan_id: string | null;
  status: EntitlementStatus;
  starts_at: string;
  ends_at: string | null;
  granted_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EntitlementWithDetails extends Entitlement {
  product?: Product;
  plan?: Plan;
  user_email?: string;
}

// ==================== Auth Context Types ====================

export interface MemberContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isHelper: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

// ==================== Role Types ====================

export type AppRole = 'admin' | 'user' | 'helper';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// ==================== OAuth Types ====================

export interface OAuthClient {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  redirect_uris: string[];
  allowed_products: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface OAuthAccessToken {
  id: string;
  client_id: string;
  user_id: string;
  token_hash: string;
  scope: string | null;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export interface OAuthAuthorizationCode {
  id: string;
  client_id: string;
  user_id: string;
  code: string;
  redirect_uri: string;
  scope: string | null;
  state: string | null;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

// ==================== API Types ====================

export interface ApiKey {
  id: string;
  key_prefix: string;
  key_hash: string;
  name: string;
  description: string | null;
  permissions: Record<string, unknown> | null;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  usage_count: number;
  created_at: string;
  created_by: string | null;
}

// ==================== SDK Types (for external integration) ====================

export interface CheckAccessResult {
  hasAccess: boolean;
  found: boolean;
  userId?: string;
  email?: string;
  entitlement?: {
    id: string;
    product_id: string;
    plan_id: string | null;
    status: EntitlementStatus;
    starts_at: string;
    ends_at: string | null;
  };
}

export interface UserLookupResult {
  found: boolean;
  user?: {
    id: string;
    email: string;
  };
  profile?: Profile;
  entitlements: Entitlement[];
}

export interface UserEntitlements {
  user_id: string;
  entitlements: Array<Entitlement & { is_active: boolean }>;
}

// ==================== Product Constants ====================

export const PRODUCT_IDS = {
  REPORT_PLATFORM: 'report_platform',
  STORY_BUILDER_HUB: 'story_builder_hub',
  SEEK_MONSTER: 'seek_monster',
  YUANYI_DIVINATION: 'yuanyi_divination',
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS] | string;
