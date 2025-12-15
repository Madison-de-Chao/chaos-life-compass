import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";
import logoHongling from "@/assets/logo-hongling.png";

const navLinks = [
  { label: "超烜創意", href: "/chaoxuan" },
  { label: "虹靈御所", href: "/home" },
  { label: "命理報告", href: "/reports" },
  { label: "命理遊戲", href: "/games" },
  { label: "元壹筆記", href: "/notes" },
  { label: "元壹宇宙", href: "/universe" },
  { label: "關於我們", href: "/about" },
  { label: "默默超", href: "/momo" },
];

const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logos */}
          <Link to="/chaoxuan" className="flex items-center gap-4 group">
            <img 
              src={logoChaoxuan} 
              alt="超烜創意" 
              className="h-10 md:h-12 w-auto animate-fade-in hover:scale-110 transition-transform duration-300"
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
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button asChild variant="outline" size="sm" className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
              <Link to="/auth">登入</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">開啟選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-[#0a0a0a] border-white/10">
              <div className="flex flex-col h-full">
                {/* Mobile Logos */}
                <div className="flex items-center gap-3 py-4 border-b border-white/10">
                  <img 
                    src={logoChaoxuan} 
                    alt="超烜創意" 
                    className="h-8 w-auto"
                  />
                  <div className="h-6 w-px bg-white/20" />
                  <img 
                    src={logoHongling} 
                    alt="虹靈御所" 
                    className="h-8 w-auto"
                  />
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex-1 py-8">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile CTA */}
                <div className="py-4 border-t border-white/10 space-y-3">
                  <Button asChild className="w-full border-white/20 text-white/80 hover:bg-white/10" variant="outline">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      登入
                    </Link>
                  </Button>
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