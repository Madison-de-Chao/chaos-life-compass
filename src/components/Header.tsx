import { useState } from "react";
import { 
  FileText, Upload, List, LogOut, User, Users, MessageSquare, Menu, 
  BookOpen, Key, StickyNote, LayoutDashboard, ChevronDown, Settings,
  Folder, Shield, Code, Clock
} from "lucide-react";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// 導航項目分組
const navGroups = [
  {
    label: "總覽",
    icon: LayoutDashboard,
    path: "/dashboard",
    items: null, // 直接連結，無子項目
  },
  {
    label: "內容管理",
    icon: Folder,
    items: [
      { path: "/upload", label: "上傳檔案", icon: Upload, description: "上傳新的文件檔案" },
      { path: "/files", label: "檔案管理", icon: List, description: "管理所有已上傳的檔案" },
      { path: "/notes", label: "筆記管理", icon: StickyNote, description: "建立與編輯筆記內容" },
    ],
  },
  {
    label: "用戶管理",
    icon: Users,
    items: [
      { path: "/customers", label: "客戶管理", icon: Users, description: "管理客戶資料與紀錄" },
      { path: "/members", label: "會員管理", icon: User, description: "管理會員帳號與訂閱" },
      { path: "/admin/entitlements", label: "權限管理", icon: Shield, description: "管理產品權限與授權" },
    ],
  },
  {
    label: "開發者工具",
    icon: Code,
    items: [
      { path: "/admin/api-keys", label: "API Keys", icon: Key, description: "管理 API 金鑰" },
      { path: "/admin/api-docs", label: "API 文件", icon: BookOpen, description: "查看 API 使用說明" },
      { path: "/admin/external-api-test", label: "API 測試", icon: FileText, description: "測試外部 API 端點" },
    ],
  },
  {
    label: "系統",
    icon: Settings,
    items: [
      { path: "/feedbacks", label: "意見反饋", icon: MessageSquare, description: "查看用戶回饋與建議" },
      { path: "/admin/pending-changes", label: "變更審核", icon: Clock, description: "審核小幫手提交的變更" },
      { path: "/admin/logs", label: "操作日誌", icon: FileText, description: "追蹤管理員操作記錄" },
      { path: "/guide", label: "使用說明", icon: BookOpen, description: "系統操作指南" },
    ],
  },
];

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;
  
  const isGroupActive = (group: typeof navGroups[0]) => {
    if (group.path) return isActive(group.path);
    return group.items?.some(item => isActive(item.path));
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => 
      prev.includes(label) 
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  // Desktop Navigation with Dropdown Menus
  const DesktopNav = () => (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {navGroups.map((group) => (
          <NavigationMenuItem key={group.label}>
            {group.path ? (
              // 直接連結項目
              <NavigationMenuLink asChild>
                <Link
                  to={group.path}
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    isActive(group.path) && "bg-accent text-accent-foreground"
                  )}
                >
                  <group.icon className="w-4 h-4 mr-2" />
                  {group.label}
                </Link>
              </NavigationMenuLink>
            ) : (
              // 有子選單的項目
              <>
                <NavigationMenuTrigger 
                  className={cn(
                    "h-9 px-4",
                    isGroupActive(group) && "bg-accent text-accent-foreground"
                  )}
                >
                  <group.icon className="w-4 h-4 mr-2" />
                  {group.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-2">
                    {group.items?.map((item) => (
                      <li key={item.path}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-start gap-3 rounded-md p-3 transition-colors",
                              "hover:bg-accent hover:text-accent-foreground",
                              isActive(item.path) && "bg-accent/50"
                            )}
                          >
                            <item.icon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{item.label}</div>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  // Mobile Navigation with Collapsible Groups
  const MobileNav = () => (
    <nav className="flex flex-col gap-1">
      {navGroups.map((group) => (
        <div key={group.label}>
          {group.path ? (
            // 直接連結項目
            <Button
              asChild
              variant={isActive(group.path) ? "secondary" : "ghost"}
              size="lg"
              className="w-full justify-start text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to={group.path}>
                <group.icon className="w-4 h-4 mr-3" />
                {group.label}
              </Link>
            </Button>
          ) : (
            // 有子選單的項目
            <Collapsible
              open={openGroups.includes(group.label)}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant={isGroupActive(group) ? "secondary" : "ghost"}
                  size="lg"
                  className="w-full justify-between text-base"
                >
                  <span className="flex items-center">
                    <group.icon className="w-4 h-4 mr-3" />
                    {group.label}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openGroups.includes(group.label) && "rotate-180"
                    )} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1 space-y-1">
                {group.items?.map((item) => (
                  <Button
                    key={item.path}
                    asChild
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    size="default"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to={item.path}>
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      ))}
    </nav>
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
        {user ? (
          <div className="hidden lg:flex items-center gap-4">
            <DesktopNav />
            <div className="h-6 w-px bg-border" />
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
          </div>
        ) : (
          <Button asChild variant="hero" size="sm" className="hidden lg:flex">
            <Link to="/auth">登入</Link>
          </Button>
        )}

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          {user ? (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="text-left pb-4 border-b border-border mb-4">
                  <SheetTitle className="font-serif">選單</SheetTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                  <MobileNav />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleSignOut}
                    className="w-full justify-start text-base text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    登出
                  </Button>
                </div>
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
