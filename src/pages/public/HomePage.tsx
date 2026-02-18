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
import { OptimizedImage } from "@/components/ui/optimized-image";
import momoPortraitRainbow from "@/assets/momo-portrait-rainbow.jpg";
import momoPortraitCosmic from "@/assets/momo-portrait-cosmic.jpg";

const sections = [
  {
    id: 1,
    title: "默默超命理報告",
    subtitle: "翻結構、問問題、給選項",
    description: "旗艦版個人報告＋感情／商業／親子合盤。四系統交叉驗證，10 章完整交付，每個判斷都有回驗機制。不給答案，給你做決定的材料。",
    icon: FileText,
    href: "/reports",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    id: 2,
    title: "元壹系統生態",
    subtitle: "六站各司其職，用你需要的就好",
    description: "占卜做決策支援、八字看長期結構、神話占星翻潛意識、思維訓練練邏輯、療癒體驗處理情緒、企業應用解決團隊問題。不綁套餐。",
    icon: Gamepad2,
    href: "/games",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
  },
  {
    id: 3,
    title: "默默超的元壹筆記",
    subtitle: "不是雞湯，是觀察紀錄",
    description: "命盤是一種語言，不是判決。這裡寫的是實際案例的反思、方法論的迭代、以及「為什麼很多命理師不敢講的事」。",
    icon: BookOpen,
    href: "/notes",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    id: 4,
    title: "元壹宇宙 × 默默超思維",
    subtitle: "四維運作系統",
    description: "情緒、行動、心智、價值——四個維度拆開來看，找到卡住的那一個。錯誤是材料，不是懲罰。完整不是沒有缺口，是不再害怕缺口。",
    icon: Sparkles,
    href: "/universe",
    color: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400",
  },
  {
    id: 5,
    title: "關於虹靈御所",
    subtitle: "Care & Truth",
    description: "Care 負責讓你願意打開，Truth 負責讓你看清楚。前者是態度，後者是能力。兩個都少一個就不是我們。",
    icon: Building2,
    href: "https://main.momo-chao.com/about",
    isExternal: true,
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
  {
    id: 6,
    title: "誰是默默超",
    subtitle: "一個把思考做成工具的人",
    description: "16 年實戰，不是學霸，不是天選之人。固執的地方：做事要有交代，說話要有根據，合作要讓對方越來越強。",
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
    title: "虹靈御所 | 翻結構、問問題、給選項的命理平台",
    description: "虹靈御所提供旗艦版命理報告、感情／商業／親子合盤解讀。四系統交叉驗證，不算命、不給答案，給你做決定的材料。",
    keywords: "虹靈御所, 命理報告, 合盤解讀, 紫微斗數, 八字, 占星, 人類圖, 默默超, 感情合盤, 商業合盤, 親子合盤",
    ogTitle: "虹靈御所 - 翻結構、問問題、給選項",
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
            <span className="text-sm font-medium text-amber-400">Rainbow Sanctuary</span>
            <span className="text-white/40">×</span>
            <span className="text-sm text-white/60">不算命，給你做決定的材料</span>
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
            翻結構、問問題、給選項
          </p>
          
          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm md:text-base text-white/50 mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '0.6s' }}>
            不算命、不給答案、不做心靈雞湯。<br />
            四系統交叉驗證，每個判斷都有根據。<br />
            你帶著問題來，我們給結構、給選項、給代價評估。
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
              每個入口解決一個具體問題，用你需要的就好
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
              做事要有交代，說話要有根據
            </p>
          </div>
          
          {/* Portrait Gallery with Animation */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Rainbow Portrait */}
            <div className="group relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-amber-500/30 transition-all duration-500">
                <OptimizedImage 
                  src={momoPortraitRainbow} 
                  alt="默默超 - 彩虹花田" 
                  className="w-64 h-80 md:w-72 md:h-96 transition-transform duration-700 group-hover:scale-105"
                  aspectRatio="3/4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="font-serif text-lg font-medium">思考夥伴，不是導師</p>
                  <p className="text-sm text-white/70">你的問題你決定，我負責把結構翻給你看</p>
                </div>
              </div>
            </div>
            
            {/* Cosmic Portrait */}
            <div className="group relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-amber-500/30 transition-all duration-500">
                <OptimizedImage 
                  src={momoPortraitCosmic} 
                  alt="默默超 - 宇宙建構者" 
                  className="w-64 h-80 md:w-72 md:h-96 transition-transform duration-700 group-hover:scale-105"
                  aspectRatio="3/4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="font-serif text-lg font-medium">16 年實戰的結構翻譯者</p>
                  <p className="text-sm text-white/70">把模糊的困惑翻譯成可操作的選項</p>
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
            「命盤是鏡子，不是劇本。<br />
            我的工作是幫你把鏡子擦乾淨，<br />
            看不看、怎麼看，你自己決定。」
          </blockquote>
          <p className="text-amber-400/60">—— 默默超</p>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default HomePage;
