import { Link } from "react-router-dom";
import logoMaisonDeChao from "@/assets/logo-maison-de-chao-full.png";
import logoHongling from "@/assets/logo-hongling-yusuo.png";

const currentYear = new Date().getFullYear();

const footerLinks = {
  explore: [
    { label: "命理報告", href: "/reports" },
    { label: "超烜遊戲", href: "/games" },
    { label: "元壹筆記", href: "/notes" },
    { label: "元壹宇宙", href: "/universe" },
  ],
  external: [
    { label: "默默超思維訓練系統", href: "https://mmclogic.com/", external: true },
    { label: "元壹占卜系統", href: "https://mirror.yyuniverse.com/", external: true },
    { label: "四時八字人生兵法", href: "https://bazi.rainbow-sanctuary.com/", external: true },
  ],
  about: [
    { label: "關於虹靈御所", href: "/about" },
    { label: "誰是默默超", href: "/momo" },
  ],
};

const PublicFooter = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand with Logos */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/chaoxuan" className="group">
                <img 
                  src={logoMaisonDeChao} 
                  alt="超烜創意 MAISON DE CHAO" 
                  className="h-16 w-auto hover:scale-110 transition-transform duration-300"
                />
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <Link to="/home" className="group">
                <img 
                  src={logoHongling} 
                  alt="虹靈御所" 
                  className="h-12 w-auto hover:scale-110 transition-transform duration-300"
                />
              </Link>
            </div>
            <p className="text-white/50 mb-6 max-w-sm leading-relaxed font-serif text-lg">
              鏡子非劇本，真實即命運。<br />
              我們不預測未來，只幫你看清現在。
            </p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span>超烜創意</span>
              <span>×</span>
              <span>虹靈御所</span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-serif font-bold text-white/90 mb-4">探索</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h4 className="font-serif font-bold text-white/90 mb-4">生態系統</h4>
            <ul className="space-y-3">
              {footerLinks.external.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-serif font-bold text-white/90 mb-4">關於</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40 text-center md:text-left">
              © {currentYear} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
            </p>
            <p className="text-sm text-white/40">
              Based on MomoChao Thinking
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;