import { Navigate } from "react-router-dom";
import { useMember } from "@/hooks/useMember";

interface MemberProtectedRouteProps {
  children: React.ReactNode;
}

export function MemberProtectedRoute({ children }: MemberProtectedRouteProps) {
  const { user, loading } = useMember();

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/member/auth" replace />;
  }

  return <>{children}</>;
}
