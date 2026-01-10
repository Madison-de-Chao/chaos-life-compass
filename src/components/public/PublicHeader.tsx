import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, User, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useMember } from "@/hooks/useMember";
import logoMaisonDeChao from "@/assets/logo-maison-de-chao-full.png";
import logoHongling from "@/assets/logo-hongling-yusuo.png";

const navLinks = [
  { label: "超烜創意", href: "/chaoxuan" },
  { label: "虹靈御所", href: "/home" },
  { label: "命理報告", href: "/reports" },
  { label: "超烜遊戲", href: "/games" },
  { label: "元壹筆記", href: "/notes" },
  { label: "關於我們", href: "/about" },
  { label: "默默超", href: "/momo" },
];

const ecosystemLinks = [
  { label: "元壹宇宙", href: "https://www.yyuniverse.com/", subtitle: "生命哲學" },
  { label: "默默超思維訓練系統", href: "https://mmclogic.com/", subtitle: "元壹宇宙" },
  { label: "元壹占卜系統", href: "https://mirror.yyuniverse.com/", subtitle: "元壹宇宙" },
  { label: "四時八字人生兵法", href: "https://bazi.rainbow-sanctuary.com/", subtitle: "虹靈御所" },
];

const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, loading } = useMember();

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logos */}
          <Link to="/chaoxuan" className="flex items-center gap-4 group">
            <img 
              src={logoMaisonDeChao} 
              alt="超烜創意 MAISON DE CHAO" 
              className="h-12 md:h-14 w-auto animate-fade-in hover:scale-110 transition-transform duration-300"
            />
            <div className="h-8 w-px bg-white/20" />
            <img 
              src={logoHongling} 
              alt="虹靈御所" 
              className="h-10 md:h-12 w-auto animate-fade-in hover:scale-110 transition-transform duration-300"
              style={{ animationDelay: "0.1s" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Ecosystem Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-1">
                  生態系統
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-[#1a1a1a] border-white/10">
                {ecosystemLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="cursor-pointer text-white/80 hover:text-white focus:text-white flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{link.label}</div>
                        <div className="text-xs text-white/40">{link.subtitle}</div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-white/40" />
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-20 bg-white/10 rounded animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.display_name || '會員'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-white/10">
                  <DropdownMenuItem asChild>
                    <Link to="/member" className="cursor-pointer text-white/80 hover:text-white focus:text-white">
                      <User className="h-4 w-4 mr-2" />
                      會員專區
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/member/profile" className="cursor-pointer text-white/80 hover:text-white focus:text-white">
                      個人資料
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300">
                    <LogOut className="h-4 w-4 mr-2" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
                <Link to="/member/auth">會員登入</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 min-h-[44px] min-w-[44px]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">開啟選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-[#0a0a0a] border-white/10">
              <div className="flex flex-col h-full">
                {/* Mobile Logos */}
                <div className="flex items-center gap-3 py-4 border-b border-white/10">
                  <img 
                    src={logoMaisonDeChao} 
                    alt="超烜創意 MAISON DE CHAO" 
                    className="h-10 w-auto"
                  />
                  <div className="h-6 w-px bg-white/20" />
                  <img 
                    src={logoHongling} 
                    alt="虹靈御所" 
                    className="h-8 w-auto"
                  />
                </div>

                {/* Mobile Nav Links - Touch Optimized */}
                <nav className="flex-1 py-6 overflow-y-auto">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg text-base font-medium transition-colors active:scale-[0.98] ${
                          isActive(link.href)
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Ecosystem Links */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="px-4 py-2 text-xs text-white/40 uppercase tracking-wider">生態系統</div>
                    <div className="space-y-1">
                      {ecosystemLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between min-h-[48px] px-4 py-3 rounded-lg text-base font-medium text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 active:scale-[0.98] transition-colors"
                        >
                          <div>
                            <div>{link.label}</div>
                            <div className="text-xs text-white/40">{link.subtitle}</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-white/40" />
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>

                {/* Mobile CTA - Touch Optimized */}
                <div className="py-4 border-t border-white/10 space-y-3">
                  {loading ? (
                    <div className="h-12 w-full bg-white/10 rounded animate-pulse" />
                  ) : user ? (
                    <>
                      <Button asChild className="w-full min-h-[48px] border-amber-500/30 text-amber-400 hover:bg-amber-500/10 active:scale-[0.98]" variant="outline">
                        <Link to="/member" onClick={() => setIsOpen(false)}>
                          <User className="h-5 w-5 mr-2" />
                          會員專區
                        </Link>
                      </Button>
                      <Button 
                        onClick={handleSignOut} 
                        variant="ghost" 
                        className="w-full min-h-[48px] text-red-400 hover:text-red-300 hover:bg-red-500/10 active:scale-[0.98]"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        登出
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="w-full min-h-[48px] border-white/20 text-white/80 hover:bg-white/10 active:scale-[0.98]" variant="outline">
                      <Link to="/member/auth" onClick={() => setIsOpen(false)}>
                        會員登入
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;