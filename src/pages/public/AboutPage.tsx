import { Link } from "react-router-dom";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Heart, Eye, Flame, Sparkles, Target, Users, ArrowRight, BookOpen, Compass, ScanEye, Lightbulb, Shield, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import logoHongling from "@/assets/logo-hongling-yusuo.png";

const values = [
  {
    icon: Heart,
    title: "Care 在乎",
    description: "Care 是起心。虹靈御所的所有設計、創作與服務，都起於「在乎」——因為在乎，才願意看清楚。Care 是溫柔的責任，它不討好，而是深深理解。",
  },
  {
    icon: Eye,
    title: "Truth 真實",
    description: "Truth 是歸途。幫助每個人回到自我，不再追逐不屬於自己的劇本。Truth 是誠實的結構，它不取悅市場，而是尊重人性。",
  },
  {
    icon: Flame,
    title: "喚醒 Awaken",
    description: "喚醒，不是灌輸。它不是把新的東西塞進你腦裡，而是幫你找到那些你早就知道、只是忘記的東西。每個靈魂本來就有完整的地圖。",
  },
  {
    icon: Target,
    title: "篩選 Filter",
    description: "真正的智慧，不是知道一切，而是知道什麼值得留下。篩選的核心是辨認——這對我的靈魂有沒有幫助？",
  },
  {
    icon: Sparkles,
    title: "賦能 Empower",
    description: "賦能，是讓能量回到你手上。不是從無到有的給予，而是點亮你原本就有的火焰。我們只是火柴，你才是火源。",
  },
  {
    icon: Users,
    title: "知行如一",
    description: "這不是口號，而是一種呼吸。理——看清秩序；煉——淬鍊矛盾；慈——在理解裡產生善意；悲——在慈悲裡保持清醒。",
  },
];

const brandStory = [
  {
    icon: ScanEye,
    title: "鏡子，非劇本",
    content: "命運從來不是一份已經寫好的劇本，等待你照著演出。它是一面鏡子——反射你當下的狀態、你的選擇、你的模式。當你學會閱讀這面鏡子，你不是在看「未來會怎樣」，而是在看「你是怎麼運作的」。",
  },
  {
    icon: Compass,
    title: "四大系統交叉整合",
    content: "我們結合紫微斗數、八字、占星與人類圖四大系統，不是為了疊加預測，而是為了交叉驗證。當四個系統都指向同一個模式時，那不是巧合——那是你的本質特徵。",
  },
  {
    icon: Lightbulb,
    title: "翻譯，而非預言",
    content: "所有命理術語、神煞、星象，在虹靈御所都會被翻譯成可操作的心理狀態、能量模式或策略框架。我們不說「你會遇到貴人」，我們說「你有吸引資源的能力，但前提是你要先願意開口求助」。",
  },
  {
    icon: Shield,
    title: "自我校準工具",
    content: "命理報告不是用來算命的。它是一套自我校準工具——幫助你理解自己的出廠設定，找到那些反覆出現的模式，然後做出更有意識的選擇。",
  },
];

const AboutPage = () => {
  useSEO({
    title: "關於虹靈御所 | 知行如一的密法",
    description: "虹靈御所的使命，不是造出完美的故事，而是讓每個人都能在自己的故事裡醒來。透過「鏡子非劇本」哲學，幫助你看見命盤裡的自己，而非被命運定義。",
    keywords: "虹靈御所, 命理報告, 紫微斗數, 八字, 占星, 人類圖, 默默超, 鏡子非劇本, 自我探索",
    ogTitle: "關於虹靈御所 - 知行如一的密法",
  });

  return (
    <div className="min-h-screen bg-parchment">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-parchment-hero" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img 
              src={logoHongling} 
              alt="虹靈御所" 
              className="h-24 md:h-32 mx-auto"
            />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            關於<span className="text-primary">虹靈御所</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Rainbow Sanctuary — 知行如一的密法
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            看見命盤裡的自己，而非被命運定義
          </p>
        </div>
      </section>

      {/* Brand Origin Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <Feather className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                品牌起源
              </h2>
            </div>
            
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p>
                <span className="font-serif text-lg font-bold text-primary">「虹靈」</span>
                ，取自彩虹與靈性的結合。彩虹是光的折射，是單一白光分解後呈現的完整光譜——正如每個人的命盤，看似複雜多變，實則是一個完整自我的不同面向。
              </p>
              
              <p>
                <span className="font-serif text-lg font-bold text-primary">「御所」</span>
                ，在日文中意指「居所」、「寓所」，帶有尊貴與守護的意涵。虹靈御所，便是守護靈性光譜的居所——一個讓你安心探索自我的空間。
              </p>
              
              <hr className="border-border/50 my-8" />
              
              <p className="font-serif text-lg text-center">
                我們相信，每個人都是一道獨特的光。<br />
                命理不是要告訴你光會照向何方，<br />
                而是幫助你認識——你是什麼顏色的光。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              我們的使命
            </h2>
            <p className="text-muted-foreground">The Mission of Rainbow Sanctuary</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <div className="space-y-8 font-serif text-xl leading-relaxed text-foreground/90 text-center">
              <p>
                虹靈御所的使命，<br />
                不是造出完美的故事，<br />
                而是讓每個人都能<span className="text-primary font-bold">在自己的故事裡醒來</span>。
              </p>
              
              <hr className="border-border/50 max-w-xs mx-auto" />
              
              <p className="text-lg text-muted-foreground">
                在乎讓我們願意靠近，<br />
                真實讓我們保持距離。<br />
                那之間的張力，就是<span className="text-primary">誠實</span>。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mirror Philosophy Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <ScanEye className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">核心哲學</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              鏡子非劇本
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mirror, Not Script — 這是虹靈御所一切服務與創作的根本定位
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {brandStory.map((item, index) => (
              <div 
                key={item.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Epigraph Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="mb-8">
            <Flame className="h-12 w-12 text-primary mx-auto mb-6 animate-breathe" />
          </div>
          <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-6">
            "I gave them fire, and they learned to think."
          </blockquote>
          <p className="text-muted-foreground mb-8">
            — Aeschylus, Prometheus Bound
          </p>
          <div className="text-foreground/80 font-serif leading-relaxed">
            <p className="mb-4">
              火能淬鍊出鑽石，<br />
              但前提是，你必須被燒毀。
            </p>
            <p>
              毀滅不是創造的反面，<br />
              而是讓動機與結果化為結晶的瞬間。
            </p>
          </div>
        </div>
      </section>
      
      {/* Values Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            核心價值
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Care & Truth — 在乎與真實，是虹靈御所一切創作的基石
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              我們提供什麼
            </h2>
            <p className="text-muted-foreground">What Rainbow Sanctuary Offers</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50 flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  全方位命理報告
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  100% 客製化，結合四大系統交叉驗證，每一份報告都是獨一無二的自我探索地圖。從「看懂自己」到「使用自己」，提供不同深度的版本選擇。
                </p>
                <Link to="/reports" className="inline-flex items-center text-primary hover:underline font-medium">
                  了解更多 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50 flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  創新命理遊戲
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  四時八字人生兵法、元壹占卜系統等，用互動體驗的方式探索命理。不是算命遊戲，而是自我覺察的練習場。
                </p>
                <Link to="/games" className="inline-flex items-center text-primary hover:underline font-medium">
                  探索遊戲 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50 flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  元壹宇宙思維系統
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  一套文明級的生活方法論，整合情緒、行動、心智、價值四大維度。在人機協作的時代，提供堅實穩固的思維能力。
                </p>
                <Link to="/universe" className="inline-flex items-center text-primary hover:underline font-medium">
                  進入元壹宇宙 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Partners */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-12">
            品牌聯盟
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="font-serif text-xl font-bold text-foreground">Maison de Chao</p>
              <p className="text-sm text-muted-foreground">超烜創意</p>
            </div>
            <div className="text-3xl text-muted-foreground/30">×</div>
            <div className="text-center">
              <p className="font-serif text-xl font-bold text-primary">Rainbow Sanctuary</p>
              <p className="text-sm text-muted-foreground">虹靈御所</p>
            </div>
            <div className="text-3xl text-muted-foreground/30">×</div>
            <div className="text-center">
              <p className="font-serif text-xl font-bold text-foreground">Yuan-Yi Universe</p>
              <p className="text-sm text-muted-foreground">元壹宇宙</p>
            </div>
          </div>
          <p className="mt-12 text-muted-foreground">
            Based on MomoChao Thinking System
          </p>
        </div>
      </section>

      {/* Final Quote & CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8">
            「命運從來不是劇本，<br />
            它只是一面鏡子。<br />
            而你，正在學會<span className="text-primary">誠實地凝視自己</span>。」
          </blockquote>
          <p className="text-muted-foreground mb-12">—— 默默超</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 shadow-glow">
              <Link to="/reports">
                探索命理報告
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/momo">
                認識默默超
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default AboutPage;
