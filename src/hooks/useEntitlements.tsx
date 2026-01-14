/**
 * @deprecated 請改用 '@/modules/member' 模組
 * 此檔案為向後兼容層，將在未來版本移除
 */

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
} from '@/modules/member';

export type {
  Product,
  Plan,
  Entitlement,
  EntitlementWithDetails,
} from '@/modules/member';
