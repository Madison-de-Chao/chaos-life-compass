import { Link } from "react-router-dom";
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
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";

const serviceAreas = [
  {
    icon: Palette,
    title: "超烜·藝術之廊",
    subtitle: "AI智能繪圖∕原創IP設計∕藝術策展",
    description: "將尖端AI智能繪圖技術與深厚的人文藝術底蘊相結合，為品牌量身打造獨一無二的視覺敘事。",
  },
  {
    icon: Megaphone,
    title: "超烜·全能之門",
    subtitle: "全方位整合行銷顧問與活動策劃",
    description: "深入剖析市場脈動與消費者行為，量身打造從品牌定位、內容策略到數位行銷的全方位整合方案。",
  },
  {
    icon: Layers,
    title: "超烜·元素之庭",
    subtitle: "客製化行銷素材，整合圖文音樂規劃製作",
    description: "集結設計、文案、音樂、影片等多元創意，為品牌製作全方位素材。",
  },
  {
    icon: Lightbulb,
    title: "超烜·創意之殿",
    subtitle: "原創IP開發∕角色設計∕週邊商品企劃",
    description: "將您的創意點子轉化為具有市場價值的IP資產，為品牌開拓全新商機。",
  },
  {
    icon: Heart,
    title: "超烜·虹靈御所",
    subtitle: "靈性療癒與人生定位服務",
    description: "結合東方古老智慧與現代心理學精髓，提供客製化的深度療癒、命理諮詢與人生定位服務。",
  },
  {
    icon: GraduationCap,
    title: "超烜·養成之苑",
    subtitle: "行銷、公關與創新思維課程",
    description: "提供一系列高品質專業課程與客製化企業內訓，協助企業與個人持續成長與升級。",
  },
];

const brandValues = [
  {
    icon: Target,
    title: "誠實且勇敢的真相探索者",
    description: "透過客製化的品牌診斷與深層訪談，勇敢地觸及品牌核心，揭露其獨特的本質與潛藏的價值。",
  },
  {
    icon: Sparkles,
    title: "細膩且深刻的文化融合者",
    description: "將台灣豐富的在地文化元素，以當代美學視野進行轉化與創新，創造具備深厚文化底蘊的作品。",
  },
  {
    icon: TrendingUp,
    title: "跨界的整合共創者",
    description: "將藝術創作的感性與品牌策略的理性相結合，提供從個人內在探索到組織文化建構的整合方案。",
  },
  {
    icon: Users,
    title: "永續陪伴與共振成長的夥伴",
    description: "將客戶視為長期夥伴，提供持續性的諮詢與支持，與品牌一同經歷成長的陣痛與喜悅。",
  },
];

const clientLogos = [
  "Samsung", "LINE", "MediaTek", "SEIKO", "DIOR", "COACH", "晶華酒店", "文華東方", "台灣啤酒"
];

const ChaoxuanPage = () => {
  return (
    <div className="min-h-screen bg-background theme-chaoxuan">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Animated Background with Gold theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(42,90%,50%)]/5 via-background to-[hsl(35,85%,55%)]/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(42,90%,50%)]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(35,85%,55%)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(42,90%,50%)]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <img 
                src={logoChaoxuan} 
                alt="超烜創意" 
                className="h-28 md:h-36 w-auto mx-auto hover:scale-105 transition-transform duration-500 drop-shadow-lg"
              />
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-[hsl(42,90%,50%)]">超</span>烜創意聖域
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Chaoxuan Creative Sanctuary
            </p>

            <p className="text-lg md:text-xl text-foreground/80 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
              我們將創意、藝術、身心療癒與資源整合匯聚一處，<br className="hidden md:block" />
              為您打造一個獨一無二的靈魂聖域
            </p>

            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.35s" }}>
              不僅是您靈感的孵化器，更是您個人品牌和事業夢想<br className="hidden md:block" />
              從構思到實現的全方位啟程之所
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button asChild size="lg" className="group bg-[hsl(42,90%,50%)] hover:bg-[hsl(42,85%,45%)] text-[hsl(30,15%,10%)]">
                <Link to="/home">
                  立即探索
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[hsl(42,90%,50%)]/50 hover:bg-[hsl(42,90%,50%)]/10">
                <a href="#contact">
                  聯絡我們
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[hsl(42,90%,50%)]/10 text-[hsl(42,80%,40%)] rounded-full text-sm font-medium mb-4">
                品牌願景
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                連結本質，創造不凡
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                超烜創意聖域不僅是創意發想的溫床，更是心靈成長與品牌蛻變的孵化器。我們深信，真正能觸動人心的創意，源於品牌對自身靈魂與願景的深度探索，並透過整合性的表達，綻放出獨一無二的光芒。
              </p>
              <p>
                我們致力於打造一個匯聚多元專業的跨界創意平台，將<strong className="text-[hsl(42,80%,40%)]">美學設計</strong>、<strong className="text-[hsl(42,80%,40%)]">策略行銷</strong>、<strong className="text-[hsl(42,80%,40%)]">原創IP開發</strong>與<strong className="text-[hsl(42,80%,40%)]">靈性療癒</strong>融為一體。透過這四大核心支柱，為渴望突破的個人與企業，提供量身打造的品牌升級服務。
              </p>
            </div>

            {/* Quote */}
            <div className="mt-12 p-8 bg-gradient-to-r from-[hsl(42,90%,50%)]/10 to-transparent border-l-4 border-[hsl(42,90%,50%)] rounded-r-xl">
              <Quote className="h-8 w-8 text-[hsl(42,90%,50%)]/40 mb-4" />
              <p className="text-lg md:text-xl text-foreground/90 italic leading-relaxed">
                「在超烜創意聖域，我們不僅創造超越想像的視覺語言，更深度塑造品牌的靈魂與識別；我們不僅精準傳遞市場訊息，更引導品牌與受眾產生深度共鳴。」
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[hsl(42,90%,50%)]/10 text-[hsl(42,80%,40%)] rounded-full text-sm font-medium mb-4">
              聖域導覽
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              六大服務場域
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              每一個場域都是您品牌完整發展生態的重要拼圖，<br className="hidden md:block" />
              由資深專業團隊主理，確保每個環節都精準到位
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((service, index) => (
              <div 
                key={service.title}
                className="group p-8 bg-card rounded-2xl border border-border/50 hover:border-[hsl(42,90%,50%)]/50 hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-[hsl(42,90%,50%)]/10 flex items-center justify-center mb-6 group-hover:bg-[hsl(42,90%,50%)]/20 transition-colors">
                  <service.icon className="h-7 w-7 text-[hsl(42,90%,50%)]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[hsl(42,80%,40%)] mb-4">
                  {service.subtitle}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-gradient-to-b from-background to-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[hsl(42,90%,50%)]/10 text-[hsl(42,80%,40%)] rounded-full text-sm font-medium mb-4">
              品牌精神
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              我們的真實價值主張
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {brandValues.map((value, index) => (
              <div 
                key={value.title}
                className="flex gap-6 p-6 bg-card/50 rounded-xl border border-border/30 hover:border-[hsl(42,90%,50%)]/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(42,90%,50%)]/10 flex items-center justify-center">
                  <value.icon className="h-6 w-6 text-[hsl(42,90%,50%)]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[hsl(42,90%,50%)]/10 text-[hsl(42,80%,40%)] rounded-full text-sm font-medium mb-4">
                關於創辦人
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                默默超 Weider Chao
              </h2>
              <p className="text-muted-foreground">
                致力於將藝術、創意與療癒深度融合並實踐的跨界整合者
              </p>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                過去16年來，深耕於品牌行銷、公關策略與策展活動領域，累積了豐富的實戰經驗。曾為 Samsung 策劃旗艦手機系列上市的整合行銷戰役，為 LINE 設計了多場用戶互動體驗活動，並協助 MediaTek 成功推動其新技術發布。
              </p>
              <p>
                此外，還與 SEIKO、DIOR、COACH、晶華酒店、文華東方以及台灣啤酒等數十個跨國與本土知名品牌合作，主導了多個百萬級別的行銷預算項目。
              </p>
            </div>

            {/* Client Logos */}
            <div className="mt-12 p-8 bg-card/50 rounded-2xl border border-border/30">
              <p className="text-sm text-muted-foreground text-center mb-6">合作品牌</p>
              <div className="flex flex-wrap justify-center gap-4">
                {clientLogos.map((logo) => (
                  <span 
                    key={logo}
                    className="px-4 py-2 bg-background rounded-lg text-sm font-medium text-foreground/70 border border-border/50"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>

            {/* Founder Quote */}
            <div className="mt-12 p-8 bg-gradient-to-br from-[hsl(42,90%,50%)]/5 to-[hsl(35,85%,55%)]/10 rounded-2xl border border-[hsl(42,90%,50%)]/20">
              <Quote className="h-10 w-10 text-[hsl(42,90%,50%)]/30 mb-6" />
              <p className="text-lg md:text-xl text-foreground/90 italic leading-relaxed mb-6">
                「在每一個創意誕生的瞬間，我深刻體會到，真正的力量源自於卸下偽裝，勇敢面對內在的真實光芒——那正是『超烜』的本質。
              </p>
              <p className="text-lg md:text-xl text-foreground/90 italic leading-relaxed">
                超烜創意聖域，這個我們精心打造的『聖域』，將透過我們的每一項服務，成為你最堅實的後盾。」
              </p>
              <p className="text-right mt-6 text-[hsl(42,80%,40%)] font-serif font-medium">
                — 默默超
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Name Origin Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[hsl(42,90%,50%)]/10 text-[hsl(42,80%,40%)] rounded-full text-sm font-medium mb-4">
                名稱由來
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                超烜與聖域的深刻意義
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-background rounded-2xl border border-border/50">
                <h3 className="font-serif text-2xl font-bold text-[hsl(42,90%,50%)] mb-4">
                  「超烜」
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Chāo Xuǎn</p>
                <p className="text-foreground/80 leading-relaxed">
                  源自古籍中「光芒耀眼，超越凡俗」之意。象徵著品牌內在真實、獨特且無法被模仿的強大能量。真正的創意並非僅止於視覺上的華麗，而是根植於品牌核心價值所散發的真實光輝。
                </p>
              </div>

              <div className="p-8 bg-background rounded-2xl border border-border/50">
                <h3 className="font-serif text-2xl font-bold text-[hsl(42,90%,50%)] mb-4">
                  「聖域」
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Shèng Yù</p>
                <p className="text-foreground/80 leading-relaxed">
                  代表著我們為客戶和團隊成員打造的一個安全、高能量且能激發深度探索的專屬場域。在這裡，我們鼓勵坦誠、接納所有的可能性，無需偽裝，也無須害怕評斷。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-[hsl(42,90%,50%)]/10 via-background to-[hsl(35,85%,55%)]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-[hsl(42,90%,50%)] mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              開啟您的品牌蛻變之旅
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              無論您是渴望建立個人品牌的創業者，還是希望升級企業形象的決策者，<br className="hidden md:block" />
              超烜創意聖域都將成為您最堅實的後盾
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group bg-[hsl(42,90%,50%)] hover:bg-[hsl(42,85%,45%)] text-[hsl(30,15%,10%)]">
                <Link to="/home">
                  探索虹靈御所
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[hsl(42,90%,50%)]/50 hover:bg-[hsl(42,90%,50%)]/10">
                <Link to="/about">
                  了解更多
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ChaoxuanPage;
