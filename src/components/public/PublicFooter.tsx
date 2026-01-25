import { Link } from "react-router-dom";
import { useState } from "react";
import { Instagram, Youtube, Facebook, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logoMaisonDeChao from "@/assets/logo-maison-de-chao-full.png";
import logoHongling from "@/assets/logo-hongling-yusuo.png";

const currentYear = new Date().getFullYear();

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/momo_chao_/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/momochao.tw", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@momochao", label: "YouTube" },
];

const footerLinks = {
  explore: [
    { label: "命理報告", href: "/reports" },
    { label: "超烜遊戲", href: "/games" },
    { label: "元壹筆記", href: "/notes-public" },
    { label: "元壹宇宙", href: "/universe" },
  ],
  external: [
    { label: "元壹宇宙", href: "https://www.yyuniverse.com/", external: true },
    { label: "默默超思維訓練系統", href: "https://mmclogic.com/", external: true },
    { label: "元壹占卜系統", href: "https://mirror.yyuniverse.com/", external: true },
    { label: "四時八字人生兵法", href: "https://bazi.rainbow-sanctuary.com/", external: true },
  ],
  about: [
    { label: "關於默默超", href: "/about" },
    { label: "隱私政策", href: "/privacy" },
    { label: "使用條款", href: "/terms" },
  ],
};

const PublicFooter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("請輸入電子郵件地址");
      return;
    }
    
    setIsSubscribing(true);
    // Simulate subscription (can be connected to actual API later)
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("訂閱成功！感謝您的支持");
    setEmail("");
    setIsSubscribing(false);
  };

  return (
    <footer className="border-t border-white/10" style={{ background: "linear-gradient(135deg, rgba(5,5,5,1) 0%, rgba(15,15,15,1) 25%, rgba(8,8,8,1) 50%, rgba(18,18,18,1) 75%, rgba(5,5,5,1) 100%), url(\"data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='5' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='20' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23080808'/%3E%3Ccircle cx='50' cy='50' r='80' fill='%23151515' opacity='0.3'/%3E%3Ccircle cx='150' cy='150' r='100' fill='%23101010' opacity='0.2'/%3E%3Crect width='100%25' height='100%25' filter='url(%23marble)' opacity='0.1'/%3E%3C/svg%3E\")" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand with Logos */}
          <div className="lg:col-span-2">
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
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

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

          {/* Newsletter & About */}
          <div>
            <h4 className="font-serif font-bold text-white/90 mb-4">關於</h4>
            <ul className="space-y-3 mb-6">
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

            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="font-serif font-bold text-white/90 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                訂閱電子報
              </h4>
              <p className="text-white/40 text-sm mb-3">
                獲取最新命理洞見與活動資訊
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-400/50 h-10"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isSubscribing}
                  className="bg-amber-600 hover:bg-amber-500 text-white h-10 w-10 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40 text-center md:text-left">
              © {currentYear} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
            </p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors">
                隱私政策
              </Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-amber-400 transition-colors">
                使用條款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;