import { useState } from "react";
import { FileText, Upload, List, LogOut, User, Users, MessageSquare, Menu, X, BookOpen, Key, StickyNote, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: "/dashboard", label: "總覽", icon: LayoutDashboard },
    { path: "/upload", label: "上傳", icon: Upload },
    { path: "/files", label: "檔案管理", icon: List },
    { path: "/notes", label: "筆記", icon: StickyNote },
    { path: "/customers", label: "客戶管理", icon: Users },
    { path: "/members", label: "會員管理", icon: Users },
    { path: "/admin/entitlements", label: "權限管理", icon: Key },
    { path: "/admin/api-keys", label: "API Keys", icon: Key },
    { path: "/admin/api-docs", label: "API 文件", icon: BookOpen },
    { path: "/admin/external-api-test", label: "API 測試", icon: FileText },
    { path: "/feedbacks", label: "反饋", icon: MessageSquare },
    { path: "/guide", label: "說明", icon: BookOpen },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          asChild
          variant={isActive(item.path) ? "secondary" : "ghost"}
          size={mobile ? "lg" : "sm"}
          className={cn(
            isActive(item.path) && "shadow-soft",
            mobile && "w-full justify-start text-base"
          )}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Link to={item.path}>
            <item.icon className={cn("w-4 h-4", mobile ? "mr-3" : "mr-2")} />
            {item.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            DocShow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLinks />
              <div className="h-6 w-px bg-border mx-2" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {user ? (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader className="text-left pb-6 border-b border-border mb-6">
                  <SheetTitle className="font-serif">選單</SheetTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  <NavLinks mobile />
                  <div className="h-px bg-border my-4" />
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleSignOut}
                    className="w-full justify-start text-base text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    登出
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">登入</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
