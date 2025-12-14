import { FileText, Upload, List, LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            DocShow
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                asChild
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                className={cn(isActive("/") && "shadow-soft")}
              >
                <Link to="/">
                  <Upload className="w-4 h-4 mr-2" />
                  上傳
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/files") ? "secondary" : "ghost"}
                size="sm"
                className={cn(isActive("/files") && "shadow-soft")}
              >
                <Link to="/files">
                  <List className="w-4 h-4 mr-2" />
                  檔案管理
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/customers") ? "secondary" : "ghost"}
                size="sm"
                className={cn(isActive("/customers") && "shadow-soft")}
              >
                <Link to="/customers">
                  <Users className="w-4 h-4 mr-2" />
                  客戶管理
                </Link>
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">登入</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
