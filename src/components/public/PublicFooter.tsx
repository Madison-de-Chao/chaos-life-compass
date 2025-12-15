import { Link } from "react-router-dom";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";
import logoHongling from "@/assets/logo-hongling.png";

const currentYear = new Date().getFullYear();

const footerLinks = {
  explore: [
    { label: "命理報告", href: "/reports" },
    { label: "命理遊戲", href: "/games" },
    { label: "元壹筆記", href: "/notes" },
    { label: "元壹宇宙", href: "/universe" },
  ],
  about: [
    { label: "關於虹靈御所", href: "/about" },
    { label: "誰是默默超", href: "/momo" },
  ],
};

const PublicFooter = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand with Logos */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/chaoxuan" className="group">
                <img 
                  src={logoChaoxuan} 
                  alt="超烜創意" 
                  className="h-12 w-auto hover:scale-110 transition-transform duration-300"
                />
              </Link>
              <div className="h-8 w-px bg-border/50" />
              <Link to="/home" className="group">
                <img 
                  src={logoHongling} 
                  alt="虹靈御所" 
                  className="h-12 w-auto hover:scale-110 transition-transform duration-300"
                />
              </Link>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              鏡子非劇本，真實即命運。<br />
              我們不預測未來，只幫你看清現在。
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>超烜創意</span>
              <span>×</span>
              <span>虹靈御所</span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-4">探索</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-4">關於</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
            </p>
            <p className="text-sm text-muted-foreground">
              Based on MomoChao Thinking
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
