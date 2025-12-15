import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Heart, Eye, Flame, Sparkles, Target, Users } from "lucide-react";

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

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            關於<span className="text-primary">虹靈御所</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Rainbow Sanctuary — The Practice of Living What You Know
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            「當閱讀成為一場自我價值的覺醒。」
          </p>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              我們的使命
            </h2>
            <div className="space-y-6 font-serif text-lg leading-relaxed text-foreground/90">
              <p className="text-center">
                虹靈御所的使命，<br />
                不是造出完美的故事，<br />
                而是讓每個人都能在自己的故事裡醒來。
              </p>
              <hr className="border-border/50 my-8" />
              <p className="text-center text-muted-foreground">
                在乎讓我們願意靠近，<br />
                真實讓我們保持距離。<br />
                那之間的張力，就是誠實。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Epigraph Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="mb-8">
            <Flame className="h-12 w-12 text-primary mx-auto mb-6" />
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
              <p className="font-serif text-xl font-bold text-foreground">Rainbow Sanctuary</p>
              <p className="text-sm text-muted-foreground">虹靈御所</p>
            </div>
          </div>
          <p className="mt-12 text-muted-foreground">
            Based on MomoChao Thinking
          </p>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default AboutPage;
