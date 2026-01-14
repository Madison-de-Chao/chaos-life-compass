/**
 * 會員保護路由元件
 * 用於保護需要會員登入的頁面
 */

import { Navigate } from "react-router-dom";
import { useMember } from "../context/MemberContext";

interface MemberProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function MemberProtectedRoute({ 
  children, 
  redirectTo = "/auth/login" 
}: MemberProtectedRouteProps) {
  const { user, loading } = useMember();

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
