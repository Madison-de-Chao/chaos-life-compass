import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Lightbulb, Palette, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";

const coreValues = [
  {
    icon: Sparkles,
    title: "創意無限",
    description: "突破傳統框架，以嶄新視角重新詮釋命理智慧",
  },
  {
    icon: Lightbulb,
    title: "靈感驅動",
    description: "將深層洞察轉化為可執行的生活指引",
  },
  {
    icon: Palette,
    title: "藝術呈現",
    description: "以美學視角呈現每一份命理報告與內容",
  },
  {
    icon: Target,
    title: "精準定制",
    description: "為每位客戶量身打造專屬的命理解讀體驗",
  },
];

const ChaoxuanPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <img 
                src={logoChaoxuan} 
                alt="超烜創意" 
                className="h-24 md:h-32 w-auto mx-auto hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-primary">超</span>烜創意
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Chaoxuan Creative Sanctuary
            </p>

            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
              創意與命理的交匯點<br />
              將傳統智慧轉化為現代靈感
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button asChild size="lg" className="group">
                <Link to="/home">
                  探索虹靈御所
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">
                  了解更多
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
              品牌故事
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                「超烜」二字，取自「超越」與「烜赫」之意。
              </p>
              <p>
                我們相信，每個人都擁有獨特的生命軌跡與潛能。
                透過創意的視角與專業的命理分析，
                我們致力於幫助每一位客戶發現自己的閃光點。
              </p>
              <p>
                超烜創意是虹靈御所背後的創意引擎，
                負責將深奧的命理知識轉化為精美、易懂的視覺呈現。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            核心價值
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div 
                key={value.title}
                className="p-6 bg-card rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <value.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              雙品牌聯盟
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              超烜創意與虹靈御所，攜手為您帶來專業且精緻的命理服務體驗
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <Link 
                to="/chaoxuan"
                className="group flex flex-col items-center p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <img 
                  src={logoChaoxuan} 
                  alt="超烜創意" 
                  className="h-20 w-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-serif text-xl font-bold text-foreground">超烜創意</span>
                <span className="text-sm text-muted-foreground mt-1">創意引擎</span>
              </Link>
              
              <div className="text-4xl text-primary">×</div>
              
              <Link 
                to="/home"
                className="group flex flex-col items-center p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="h-20 flex items-center justify-center mb-4">
                  <span className="font-serif text-4xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary">虹</span>靈御所
                  </span>
                </div>
                <span className="font-serif text-xl font-bold text-foreground">虹靈御所</span>
                <span className="text-sm text-muted-foreground mt-1">命理殿堂</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ChaoxuanPage;
