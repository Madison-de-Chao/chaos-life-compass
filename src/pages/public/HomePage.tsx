import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Gamepad2, 
  BookOpen, 
  Sparkles, 
  Building2, 
  User,
  ArrowRight,
  ChevronDown,
  Crown,
  LogIn,
  ExternalLink,
  Volume2,
  VolumeX
} from "lucide-react";
import { MemberLoginWidget } from "@/components/auth/MemberLoginWidget";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";
import { useMember } from "@/hooks/useMember";
import momoPortraitRainbow from "@/assets/momo-portrait-rainbow.jpg";
import momoPortraitCosmic from "@/assets/momo-portrait-cosmic.jpg";

const sections = [
  {
    id: 1,
    title: "默默超全方位命理報告",
    subtitle: "看見自己，是最深的修行",
    description: "一份為你量身打造的命理報告，不是預言，而是一面鏡子——幫助你看清現在，自由選擇未來。",
    icon: FileText,
    href: "/reports",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    id: 2,
    title: "創新命理遊戲網站",
    subtitle: "在遊戲中遇見真實的自己",
    description: "四時八字人生兵法、紫薇戀愛遊戲等，用互動體驗的方式，探索命理的奧秘。",
    icon: Gamepad2,
    href: "/games",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
  },
  {
    id: 3,
    title: "默默超的元壹筆記",
    subtitle: "有關命理，有關做人",
    description: "命盤是一種語言，不是判決。這裡記錄著我對命理與人生的思考與觀察。",
    icon: BookOpen,
    href: "/notes",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    id: 4,
    title: "元壹宇宙 × 默默超思維",
    subtitle: "一套改變世界的文明級生活方法",
    description: "完整性哲學——世界缺乏的並非「正確性」，而是「完整性」。錯誤不是廢棄物，而是材料。",
    icon: Sparkles,
    href: "/universe",
    color: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400",
  },
  {
    id: 5,
    title: "關於虹靈御所",
    subtitle: "知行如一的密法",
    description: "虹靈御所的使命，不是造出完美的故事，而是讓每個人都能在自己的故事裡醒來。",
    icon: Building2,
    href: "https://main.momo-chao.com/about",
    isExternal: true,
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
  {
    id: 6,
    title: "誰是默默超",
    subtitle: "鏡子的守護者",
    description: "我們不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。",
    icon: User,
    href: "https://main.momo-chao.com/about",
    isExternal: true,
    color: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-400",
  },
];

const HomePage = () => {
  const { user, profile } = useMember();
  const [showLoginWidget, setShowLoginWidget] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useSEO({
    title: "虹靈御所 | 看見命盤裡的自己，而非被命運定義",
    description: "虹靈御所提供專業命理報告、創新命理遊戲、元壹筆記等服務。透過紫微斗數、八字、占星、人類圖四大系統，幫助你看清自己，自由選擇未來。",
    keywords: "虹靈御所, 命理報告, 紫微斗數, 八字, 占星, 人類圖, 默默超, 元壹筆記, 命理遊戲",
    ogTitle: "虹靈御所 - 看見自己，是最深的修行",
  });

  const scrollToSections = () => {
    document.getElementById('sections')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      {/* Hero Section with Embedded Video */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 animate-fade-in">
            <span className="text-sm font-medium text-amber-400">Hongling Yusuo</span>
            <span className="text-white/40">×</span>
            <span className="text-sm text-white/60">知行如一的密法</span>
          </div>

          {/* Embedded Video with gold glow frame */}
          <div className="mb-8 animate-fade-in relative mx-auto max-w-xl" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-amber-400/50 to-amber-500/30 rounded-2xl blur-md opacity-60" />
            <div className="relative bg-black rounded-xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(217,161,99,0.2)]">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              >
                <source src="/videos/hongling-logo.mp4?v=2" type="video/mp4" />
              </video>
              {/* Audio Control Button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-3 right-3 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-300 group"
                title={isMuted ? "開啟聲音" : "關閉聲音"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl">虹</span>
            <span className="text-white">靈御所</span>
          </h1>
          
          {/* Tagline */}
          <p className="font-serif text-lg md:text-xl lg:text-2xl text-white/60 mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            鏡子非劇本，真實即命運
          </p>
          
          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm md:text-base text-white/50 mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '0.6s' }}>
            我們不預測未來，只幫你看清現在。<br />
            命盤是一種語言，不是判決。<br />
            你只需要學會聽懂它在對你說什麼。
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button asChild size="lg" className="px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-[0_0_30px_rgba(217,161,99,0.3)]">
              <Link to="/reports">
                探索命理報告
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
              <a href="https://main.momo-chao.com/about" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                認識虹靈御所
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>

          {/* Member Area CTA */}
          {user ? (
            <div className="animate-fade-in mb-8" style={{ animationDelay: '0.9s' }}>
              <Link 
                to="/account" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400 hover:from-amber-500/30 hover:to-amber-600/30 transition-all duration-300 group"
              >
                <Crown className="h-5 w-5" />
                <span className="font-medium">歡迎回來，{profile?.display_name || '會員'}！前往會員專區</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="animate-fade-in mb-8" style={{ animationDelay: '0.9s' }}>
              <button 
                onClick={() => setShowLoginWidget(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 group"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">會員登入 / 註冊</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          {/* Login Widget Modal */}
          {showLoginWidget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md animate-scale-in">
                <MemberLoginWidget 
                  onClose={() => setShowLoginWidget(false)}
                  onSuccess={() => setShowLoginWidget(false)}
                />
              </div>
            </div>
          )}
          
          {/* Scroll indicator */}
          <button 
            onClick={scrollToSections}
            className="animate-float cursor-pointer"
            aria-label="捲動到內容區"
          >
            <ChevronDown className="h-8 w-8 text-amber-500/50 mx-auto" />
          </button>
        </div>
      </section>
      
      {/* Sections Grid */}
      <section id="sections" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              探索虹靈御所
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              每一個入口，都通往自我覺醒的旅程
            </p>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sections.map((section, index) => {
              const cardContent = (
                <>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 mb-6 ${section.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <section.icon className="h-7 w-7" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {section.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-sm text-amber-400/80 mb-4 font-medium">
                      {section.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                      {section.description}
                    </p>
                    
                    {/* Arrow */}
                    <div className="flex items-center text-amber-400 font-medium text-sm">
                      <span>{section.isExternal ? '前往了解' : '進入探索'}</span>
                      {section.isExternal ? (
                        <ExternalLink className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                      )}
                    </div>
                  </div>
                </>
              );

              return section.isExternal ? (
                <a
                  key={section.id}
                  href={section.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-amber-500/30 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {cardContent}
                </a>
              ) : (
                <Link
                  key={section.id}
                  to={section.href}
                  className="group relative bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-amber-500/30 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* MomoChao Portrait Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
              誰是默默超
            </h2>
            <p className="text-white/50 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              一個正在學會凝視自己的人
            </p>
          </div>
          
          {/* Portrait Gallery with Animation */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Rainbow Portrait */}
            <div className="group relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-amber-500/30 transition-all duration-500">
                <img 
                  src={momoPortraitRainbow} 
                  alt="默默超 - 彩虹花田" 
                  className="w-64 h-80 md:w-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="font-serif text-lg font-medium">彩虹花田中的守護者</p>
                  <p className="text-sm text-white/70">用色彩點亮每一次相遇</p>
                </div>
              </div>
            </div>
            
            {/* Cosmic Portrait */}
            <div className="group relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-amber-500/30 transition-all duration-500">
                <img 
                  src={momoPortraitCosmic} 
                  alt="默默超 - 宇宙建構者" 
                  className="w-64 h-80 md:w-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="font-serif text-lg font-medium">思維建築師</p>
                  <p className="text-sm text-white/70">在宇宙的軌道中尋找秩序</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA to external about page */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a 
              href="https://main.momo-chao.com/about" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400 hover:from-amber-500/30 hover:to-amber-600/30 transition-all duration-300 group font-medium"
            >
              認識默默超的故事
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed mb-8">
            「命運從來不是劇本，<br />
            它只是一面鏡子。<br />
            而你，正在學會誠實地凝視自己。」
          </blockquote>
          <p className="text-amber-400/60">—— 默默超</p>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default HomePage;
