import { Navigate } from "react-router-dom";
import { useMember } from "@/modules/member";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 後台管理路由保護：要求登入且具備 admin 角色
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useMember();

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
