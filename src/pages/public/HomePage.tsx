import { Link } from "react-router-dom";
import { 
  FileText, 
  Gamepad2, 
  BookOpen, 
  Sparkles, 
  Building2, 
  User,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const sections = [
  {
    id: 1,
    title: "默默超全方位命理報告",
    subtitle: "看見自己，是最深的修行",
    description: "一份為你量身打造的命理報告，不是預言，而是一面鏡子——幫助你看清現在，自由選擇未來。",
    icon: FileText,
    href: "/reports",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-600",
  },
  {
    id: 2,
    title: "創新命理遊戲網站",
    subtitle: "在遊戲中遇見真實的自己",
    description: "四時八字人生兵法、紫薇戀愛遊戲等，用互動體驗的方式，探索命理的奧秘。",
    icon: Gamepad2,
    href: "/games",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-600",
  },
  {
    id: 3,
    title: "默默超的元壹筆記",
    subtitle: "有關命理，有關做人",
    description: "命盤是一種語言，不是判決。這裡記錄著我對命理與人生的思考與觀察。",
    icon: BookOpen,
    href: "/notes",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-600",
  },
  {
    id: 4,
    title: "元壹宇宙 × 默默超思維",
    subtitle: "一套改變世界的文明級生活方法",
    description: "完整性哲學——世界缺乏的並非「正確性」，而是「完整性」。錯誤不是廢棄物，而是材料。",
    icon: Sparkles,
    href: "/universe",
    color: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-600",
  },
  {
    id: 5,
    title: "關於虹靈御所",
    subtitle: "知行如一的密法",
    description: "虹靈御所的使命，不是造出完美的故事，而是讓每個人都能在自己的故事裡醒來。",
    icon: Building2,
    href: "/about",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-600",
  },
  {
    id: 6,
    title: "誰是默默超",
    subtitle: "鏡子的守護者",
    description: "我們不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。",
    icon: User,
    href: "/momo",
    color: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-600",
  },
];

const HomePage = () => {
  useSEO({
    title: "虹靈御所 | 看見命盤裡的自己，而非被命運定義",
    description: "虹靈御所提供專業命理報告、創新命理遊戲、元壹筆記等服務。透過紫微斗數、八字、占星、人類圖四大系統，幫助你看清自己，自由選擇未來。",
    keywords: "虹靈御所, 命理報告, 紫微斗數, 八字, 占星, 人類圖, 默默超, 元壹筆記, 命理遊戲",
    ogTitle: "虹靈御所 - 看見自己，是最深的修行",
  });

  const scrollToSections = () => {
    document.getElementById('sections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-parchment">
      <PublicHeader />
      
      {/* Hero Section with Embedded Video */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background parchment hero effect */}
        <div className="absolute inset-0 bg-parchment-hero" />
        {/* Subtle warm glow accents */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="text-sm font-medium text-primary">Hongling Yusuo</span>
            <span className="text-muted-foreground">×</span>
            <span className="text-sm text-muted-foreground">知行如一的密法</span>
          </div>

          {/* Embedded Video with warm glow frame */}
          <div className="mb-8 animate-fade-in relative mx-auto max-w-xl" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-2xl blur-md opacity-60" />
            <div className="relative bg-background rounded-xl overflow-hidden border border-primary/30 shadow-[0_0_40px_rgba(var(--primary),0.15)]">
              <video
                autoPlay
                loop
                playsInline
                className="w-full h-auto cursor-pointer"
                onClick={(e) => {
                  const video = e.currentTarget;
                  video.muted = !video.muted;
                }}
                title="點擊開啟/關閉聲音"
              >
                <source src="/videos/hongling-logo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-primary text-5xl md:text-6xl lg:text-7xl">虹</span>靈御所
          </h1>
          
          {/* Tagline */}
          <p className="font-serif text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            鏡子非劇本，真實即命運
          </p>
          
          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground/80 mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '0.6s' }}>
            我們不預測未來，只幫你看清現在。<br />
            命盤是一種語言，不是判決。<br />
            你只需要學會聽懂它在對你說什麼。
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button asChild size="lg" className="px-8 shadow-glow">
              <Link to="/reports">
                探索命理報告
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/about">
                認識虹靈御所
              </Link>
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <button 
            onClick={scrollToSections}
            className="animate-float cursor-pointer"
            aria-label="捲動到內容區"
          >
            <ChevronDown className="h-8 w-8 text-primary/50 mx-auto" />
          </button>
        </div>
      </section>
      
      {/* Sections Grid */}
      <section id="sections" className="py-24 px-4">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              探索虹靈御所
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              每一個入口，都通往自我覺醒的旅程
            </p>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sections.map((section, index) => (
              <Link
                key={section.id}
                to={section.href}
                className="group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-primary/30 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-background shadow-soft mb-6 ${section.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <section.icon className="h-7 w-7" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-sm text-primary/80 mb-4 font-medium">
                    {section.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {section.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center text-primary font-medium text-sm">
                    <span>進入探索</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Darker parchment edge effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl text-center">
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8">
            「命運從來不是劇本，<br />
            它只是一面鏡子。<br />
            而你，正在學會誠實地凝視自己。」
          </blockquote>
          <p className="text-muted-foreground">—— 默默超</p>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default HomePage;
