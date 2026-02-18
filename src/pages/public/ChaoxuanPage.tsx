import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Megaphone, 
  Layers, 
  Lightbulb, 
  Heart, 
  GraduationCap,
  Quote,
  Users,
  Target,
  TrendingUp,
  Award,
  Diamond
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoChaoxuan from "@/assets/logo-maison-de-chao-full.png";
import { useSEO } from "@/hooks/useSEO";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

// Custom hook for scroll animations
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Animated Section Component
const RevealSection = ({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const serviceAreas = [
  {
    icon: Palette,
    title: "超烜·藝術之廊",
    subtitle: "AI 繪圖｜原創 IP 設計｜藝術策展",
    description: "AI 是工具，不是風格。我們用它加速生產，但視覺語言的判斷權在人。產出標準：能不能在三秒內讓人記住你是誰。",
  },
  {
    icon: Megaphone,
    title: "超烜·全能之門",
    subtitle: "整合行銷顧問｜活動策劃",
    description: "行銷的核心不是「讓更多人看到」，是「讓對的人願意留下來」。我們做的是定位、篩選、匹配——不是灑錢買流量。",
  },
  {
    icon: Layers,
    title: "超烜·元素之庭",
    subtitle: "客製化行銷素材｜圖文音樂整合製作",
    description: "素材不是裝飾品。每一張圖、每一段文案、每一個音效都要回答同一個問題：「這對目標受眾有什麼用？」",
  },
  {
    icon: Lightbulb,
    title: "超烜·創意之殿",
    subtitle: "原創 IP 開發｜角色設計｜週邊商品",
    description: "IP 的價值不在於可愛，在於可辨識且可延伸。我們評估的是：這個角色能不能撐起一條產品線，而不只是一張貼紙。",
  },
  {
    icon: Heart,
    title: "超烜·虹靈御所",
    subtitle: "命理解讀｜人生定位｜結構性自我探索",
    description: "不算命、不給答案、不做心靈雞湯。我們翻結構、問問題、給選項。決定權永遠在你自己手上。",
  },
  {
    icon: GraduationCap,
    title: "超烜·養成之苑",
    subtitle: "行銷｜公關｜創新思維課程",
    description: "課程的衡量標準只有一個：上完之後，你能不能自己做。如果上完還是得靠我們，那課程就失敗了。",
  },
];

const brandValues = [
  {
    icon: Target,
    title: "說真話，即使不好聽",
    description: "品牌診斷不是拍馬屁。問題在哪裡就指出來，優勢在哪裡就放大。模糊的讚美比直接的批評更浪費時間。",
  },
  {
    icon: Sparkles,
    title: "文化是材料，不是裝飾",
    description: "在地文化不是貼上去的標籤。要用，就要用到結構裡——影響定位、影響語言、影響產品邏輯，而不只是視覺風格。",
  },
  {
    icon: TrendingUp,
    title: "感性和理性不是二選一",
    description: "藝術直覺負責方向感，數據分析負責驗證。兩個都要有，缺一個都容易翻車。",
  },
  {
    icon: Users,
    title: "對方越來越不需要你，就對了",
    description: "好的合作夥伴會讓你越來越強，而不是越來越依賴。如果合作三年你還離不開我們，那是我們的問題。",
  },
];

const clientLogos = [
  "Samsung", "LINE", "MediaTek", "SEIKO", "DIOR", "COACH", "晶華酒店", "文華東方", "台灣啤酒"
];

const ChaoxuanPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useSEO({
    title: "超烜創意 Maison de Chao | 說真話的品牌整合夥伴",
    description: "超烜創意提供六大服務場域：藝術之廊、全能之門、元素之庭、創意之殿、虹靈御所、養成之苑。不做場面話，只做能落地的品牌策略。",
    keywords: "超烜創意, Maison de Chao, 品牌設計, AI繪圖, 行銷策略, IP開發, 藝術策展, 企業培訓",
    ogTitle: "超烜創意 Maison de Chao - 說真話的品牌整合夥伴",
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0] overflow-x-hidden">
      <PublicHeader />

      {/* Hero Section with Embedded Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c9a962]/8 via-transparent to-transparent" />
        
        {/* Animated gold particles */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a962]/5 rounded-full blur-[120px]"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#c9a962]/3 rounded-full blur-[100px]"
          style={{ transform: `translate(-${scrollY * 0.08}px, ${scrollY * 0.04}px)` }}
        />
        
        {/* Decorative animated lines */}
        <div 
          className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        />
        <div 
          className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
          style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
        />

        <div className="container mx-auto px-4 relative z-10 pt-24">
          <div className="max-w-5xl mx-auto text-center">
            {/* Luxury Badge */}
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#c9a962]/40 rounded-full mb-8 animate-fade-in"
              style={{ 
                opacity: Math.max(0.3, 1 - scrollY / 500),
                transform: `translateY(${scrollY * 0.2}px)` 
              }}
            >
              <Diamond className="h-4 w-4 text-[#c9a962]" />
              <span className="text-xs uppercase tracking-[0.35em] text-[#c9a962] font-light">Maison de Chao</span>
            </div>

            {/* Embedded Video with glow frame */}
            <div 
              className="mb-10 animate-fade-in relative mx-auto max-w-2xl" 
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#c9a962]/20 via-[#c9a962]/40 to-[#c9a962]/20 rounded-2xl blur-md opacity-60" />
              <div className="relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#c9a962]/30 shadow-[0_0_40px_rgba(201,169,98,0.15)]">
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
                  <source src="/videos/chaoxuan-logo.mp4?v=2" type="video/mp4" />
                </video>
              </div>
            </div>

            <h1 
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in tracking-tight"
              style={{ 
                animationDelay: "0.3s",
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: Math.max(0.2, 1 - scrollY / 600),
              }}
            >
              <span className="text-[#c9a962]">超</span>烜創意聖域
            </h1>

            <p 
              className="text-lg md:text-xl text-[#f5f5f0]/50 mb-6 font-light tracking-[0.2em] animate-fade-in uppercase"
              style={{ 
                animationDelay: "0.4s",
                transform: `translateY(${scrollY * 0.08}px)`,
              }}
            >
              Maison de Chao
            </p>

            <div 
              className="w-24 h-px bg-gradient-to-r from-transparent via-[#c9a962] to-transparent mx-auto mb-8 animate-fade-in"
              style={{ animationDelay: "0.45s" }}
            />

            <p 
              className="text-base md:text-lg text-[#f5f5f0]/60 mb-5 max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ 
                animationDelay: "0.5s",
                transform: `translateY(${scrollY * 0.05}px)`,
              }}
            >
              品牌設計、行銷策略、IP 開發、命理定位、企業培訓<br className="hidden md:block" />
              六個場域，各司其職，只做能落地的事
            </p>

            <p 
              className="text-sm text-[#f5f5f0]/40 mb-10 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.55s" }}
            >
              不賣夢想、不灌雞湯。你帶著問題來，我們給結構、給選項、給代價評估。決定權在你。
            </p>

            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <Button asChild size="lg" className="group bg-[#c9a962] hover:bg-[#d4b872] text-[#0a0a0a] font-medium px-10 h-14 text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,98,0.4)]">
                <a href="#services">
                  立即探索
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/10 hover:border-[#c9a962]/50 px-10 h-14 text-base transition-all duration-300">
                <a href="#contact">
                  聯絡我們
                </a>
              </Button>
            </div>

            {/* Scroll indicator */}
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
              style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
            >
              <div className="w-6 h-10 border-2 border-[#c9a962]/30 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-[#c9a962] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 bg-[#0f0f0f] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#c9a962_1px,transparent_1px),linear-gradient(to_bottom,#c9a962_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.015]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <RevealSection className="text-center mb-16">
              <span className="inline-block px-6 py-2.5 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.25em] mb-8">
                品牌願景
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#f5f5f0] leading-tight">
                我們做什麼<br className="md:hidden" />
                <span className="text-[#c9a962]">，</span>不做什麼
              </h2>
            </RevealSection>
            
            <RevealSection delay={200}>
              <div className="space-y-8 text-lg text-[#f5f5f0]/55 leading-[2]">
                <p>
                  超烜創意做的事很簡單：幫你把品牌的核心價值翻譯成市場聽得懂的語言。不是「幫你找到靈魂」這種說法——你的品牌有什麼、缺什麼，我們會直接講。
                </p>
                <p>
                  四個支柱：<span className="text-[#c9a962] font-medium">美學設計</span>負責讓人記住你；<span className="text-[#c9a962] font-medium">策略行銷</span>負責讓對的人找到你；<span className="text-[#c9a962] font-medium">原創 IP</span> 負責讓你有可延伸的資產；<span className="text-[#c9a962] font-medium">命理定位</span>負責讓你在做重大決策前看清結構。四個都可以單獨用，不需要綁在一起。
                </p>
              </div>
            </RevealSection>

            {/* Quote */}
            <RevealSection delay={400}>
              <div className="mt-20 p-12 bg-[#141414] border border-[#c9a962]/20 relative overflow-hidden group hover:border-[#c9a962]/40 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-4 left-12">
                  <Quote className="h-10 w-10 text-[#c9a962]" />
                </div>
                <p className="text-xl md:text-2xl text-[#f5f5f0]/75 italic leading-relaxed pl-6 border-l-2 border-[#c9a962]/40">
                  「好的品牌服務商應該讓你越來越強，而不是越來越依賴。如果合作結束後你還是什麼都不會，那不是服務，是綁架。」
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section id="services" className="py-32 bg-[#0a0a0a] relative">
        <div className="container mx-auto px-4">
          <RevealSection className="text-center mb-24">
            <span className="inline-block px-6 py-2.5 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.25em] mb-8">
              聖域導覽
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#f5f5f0] mb-8">
              六大服務場域
            </h2>
            <p className="text-lg text-[#f5f5f0]/45 max-w-2xl mx-auto leading-relaxed">
              你不需要用全部，只用你需要的<br className="hidden md:block" />
              每個場域獨立運作，解決一個具體問題
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((service, index) => (
              <RevealSection key={service.title} delay={index * 100}>
                <div className="group h-full p-10 bg-[#141414] border border-[#c9a962]/10 hover:border-[#c9a962]/50 transition-all duration-500 relative overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a962]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 border border-[#c9a962]/30 flex items-center justify-center mb-8 group-hover:bg-[#c9a962]/10 group-hover:border-[#c9a962]/50 transition-all duration-500">
                      <service.icon className="h-7 w-7 text-[#c9a962]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#f5f5f0] mb-3 group-hover:text-[#c9a962] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#c9a962]/70 mb-5 tracking-wide">
                      {service.subtitle}
                    </p>
                    <p className="text-[#f5f5f0]/45 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-32 bg-[#0f0f0f] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
        
        <div className="container mx-auto px-4">
          <RevealSection className="text-center mb-24">
            <span className="inline-block px-6 py-2.5 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.25em] mb-8">
              品牌精神
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#f5f5f0]">
              四件我們真正在意的事
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {brandValues.map((value, index) => (
              <RevealSection key={value.title} delay={index * 150}>
                <div className="group flex gap-8 p-10 bg-[#0a0a0a] border border-[#c9a962]/10 hover:border-[#c9a962]/40 transition-all duration-500">
                  <div className="flex-shrink-0 w-14 h-14 border border-[#c9a962]/30 flex items-center justify-center group-hover:bg-[#c9a962]/10 transition-all duration-300">
                    <value.icon className="h-6 w-6 text-[#c9a962]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#f5f5f0] mb-4 group-hover:text-[#c9a962] transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-[#f5f5f0]/45 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <RevealSection className="text-center mb-16">
              <span className="inline-block px-6 py-2.5 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.25em] mb-8">
                關於創辦人
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#f5f5f0] mb-4">
                默默超
              </h2>
              <p className="text-[#f5f5f0]/35 text-xl tracking-widest">
                Weider Chao
              </p>
            </RevealSection>

            <RevealSection delay={200}>
              <div className="space-y-8 text-[#f5f5f0]/55 leading-[2] text-lg">
                <p>
                  16 年品牌行銷、公關策略與策展實戰。不是理論派，是每個案子都親手做過的人。擅長的事：把模糊的品牌概念翻譯成可執行的策略，然後落地。
                </p>
                <p>
                  合作過的品牌包括 Samsung、LINE、MediaTek、SEIKO、DIOR、COACH、晶華酒店、文華東方、台灣啤酒等。這些名字放在這裡不是炫耀——是讓你知道我們處理過什麼量級的問題。
                </p>
              </div>
            </RevealSection>

            {/* Client Logos */}
            <RevealSection delay={300}>
              <div className="mt-20 p-12 bg-[#0f0f0f] border border-[#c9a962]/10">
                <p className="text-xs uppercase tracking-[0.25em] text-[#c9a962]/50 text-center mb-10">合作品牌</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {clientLogos.map((logo, index) => (
                    <span 
                      key={logo}
                      className="px-6 py-3 bg-[#141414] border border-[#c9a962]/10 text-sm text-[#f5f5f0]/45 hover:border-[#c9a962]/30 hover:text-[#f5f5f0]/70 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Founder Quote */}
            <RevealSection delay={400}>
              <div className="mt-16 p-12 bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-[#c9a962]/20 relative overflow-hidden group hover:border-[#c9a962]/40 transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9a962]/50 via-[#c9a962] to-[#c9a962]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-4 left-12">
                  <Quote className="h-10 w-10 text-[#c9a962]" />
                </div>
                <p className="text-xl md:text-2xl text-[#f5f5f0]/75 italic leading-relaxed mb-8">
                  「我不是什麼大師，也不是天選之人。我只是比較固執：做事要有交代，做人要有底線。
                </p>
                <p className="text-xl md:text-2xl text-[#f5f5f0]/75 italic leading-relaxed">
                  當對方越來越不需要你的時候，就代表你做對了。這是我對自己所有工作的唯一衡量標準。」
                </p>
                <p className="text-right mt-10 text-[#c9a962] font-serif font-medium tracking-[0.15em] text-lg">
                  — 默默超
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Name Origin Section */}
      <section className="py-32 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <RevealSection className="text-center mb-16">
              <span className="inline-block px-6 py-2.5 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.25em] mb-8">
                名稱由來
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#f5f5f0]">
                超烜與聖域的深刻意義
              </h2>
            </RevealSection>

            <div className="grid md:grid-cols-2 gap-8">
              <RevealSection delay={100}>
                <div className="p-12 bg-[#0a0a0a] border border-[#c9a962]/20 h-full group hover:border-[#c9a962]/40 transition-all duration-500">
                  <h3 className="font-serif text-3xl font-bold text-[#c9a962] mb-3">
                    「超烜」
                  </h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/35 mb-8">Chāo Xuǎn</p>
                  <p className="text-[#f5f5f0]/55 leading-[2]">
                    「超」是超越，「烜」是光芒。合在一起的意思是：不靠外面的光來照自己，而是讓自己的核心價值本身就會發光。品牌如此，人也如此。
                  </p>
                </div>
              </RevealSection>

              <RevealSection delay={200}>
                <div className="p-12 bg-[#0a0a0a] border border-[#c9a962]/20 h-full group hover:border-[#c9a962]/40 transition-all duration-500">
                  <h3 className="font-serif text-3xl font-bold text-[#c9a962] mb-3">
                    「聖域」
                  </h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/35 mb-8">Shèng Yù</p>
                  <p className="text-[#f5f5f0]/55 leading-[2]">
                    「聖域」不是什麼神聖不可侵犯的地方。它的意思是：在這裡可以說真話、可以犯錯、可以把問題攤開來看，不需要裝。一個能讓你安心拆解問題的空間。
                  </p>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c9a962]/8 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <RevealSection className="max-w-3xl mx-auto text-center">
            <Award className="h-20 w-20 text-[#c9a962] mx-auto mb-10" />
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#f5f5f0] mb-8">
              有問題，就來聊
            </h2>
            <p className="text-lg text-[#f5f5f0]/45 mb-14 leading-relaxed">
              不需要準備好才來。帶著你的問題、你的現狀、你的預算限制<br className="hidden md:block" />
              我們先聊清楚能不能幫、怎麼幫、代價是什麼，再決定要不要開始
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button asChild size="lg" className="group bg-[#c9a962] hover:bg-[#d4b872] text-[#0a0a0a] font-medium px-12 h-14 text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,169,98,0.5)]">
                <Link to="/home">
                  探索虹靈御所
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/10 hover:border-[#c9a962]/50 px-12 h-14 text-base transition-all duration-300">
                <a href="https://main.momo-chao.com/about" target="_blank" rel="noopener noreferrer">
                  了解更多
                </a>
              </Button>
            </div>
          </RevealSection>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ChaoxuanPage;
