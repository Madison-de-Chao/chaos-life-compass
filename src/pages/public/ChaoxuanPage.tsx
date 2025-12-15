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
  Award,
  Diamond
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      {/* Custom dark header for this page */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#c9a962]/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/chaoxuan" className="flex items-center gap-4">
              <img 
                src={logoChaoxuan} 
                alt="超烜創意" 
                className="h-10 md:h-12 w-auto hover:scale-105 transition-transform duration-300"
              />
              <span className="hidden sm:block font-serif text-lg font-medium text-[#c9a962]">
                超烜創意聖域
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/chaoxuan" className="px-4 py-2 text-sm font-medium text-[#c9a962]">
                超烜創意
              </Link>
              <Link to="/home" className="px-4 py-2 text-sm font-medium text-[#f5f5f0]/60 hover:text-[#f5f5f0] transition-colors">
                虹靈御所
              </Link>
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-[#f5f5f0]/60 hover:text-[#f5f5f0] transition-colors">
                關於我們
              </Link>
              <Link to="/momo" className="px-4 py-2 text-sm font-medium text-[#f5f5f0]/60 hover:text-[#f5f5f0] transition-colors">
                默默超
              </Link>
            </nav>

            <Button asChild variant="outline" size="sm" className="border-[#c9a962]/50 text-[#c9a962] hover:bg-[#c9a962]/10 hover:text-[#c9a962]">
              <Link to="/auth">登入</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        {/* Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c9a962]/5 via-transparent to-transparent" />
        
        {/* Subtle gold accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a962]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#c9a962]/3 rounded-full blur-[100px]" />
        
        {/* Decorative lines */}
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#c9a962]/30 rounded-full mb-8 animate-fade-in">
              <Diamond className="h-4 w-4 text-[#c9a962]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#c9a962]">Creative Sanctuary</span>
            </div>

            {/* Logo */}
            <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <img 
                src={logoChaoxuan} 
                alt="超烜創意" 
                className="h-32 md:h-40 w-auto mx-auto drop-shadow-[0_0_30px_rgba(201,169,98,0.3)]"
              />
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-in tracking-tight" style={{ animationDelay: "0.2s" }}>
              <span className="text-[#c9a962]">超</span>烜創意聖域
            </h1>

            <p className="text-xl md:text-2xl text-[#f5f5f0]/50 mb-6 font-light tracking-wider animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Chaoxuan Creative Sanctuary
            </p>

            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#c9a962] to-transparent mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.35s" }} />

            <p className="text-lg md:text-xl text-[#f5f5f0]/70 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.4s" }}>
              我們將創意、藝術、身心療癒與資源整合匯聚一處<br className="hidden md:block" />
              為您打造一個獨一無二的靈魂聖域
            </p>

            <p className="text-base text-[#f5f5f0]/40 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.45s" }}>
              不僅是您靈感的孵化器，更是您個人品牌和事業夢想從構思到實現的全方位啟程之所
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Button asChild size="lg" className="group bg-[#c9a962] hover:bg-[#d4b872] text-[#0a0a0a] font-medium px-8">
                <a href="#services">
                  立即探索
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/10 hover:border-[#c9a962]/50 px-8">
                <a href="#contact">
                  聯絡我們
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-[#0f0f0f] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#c9a962_1px,transparent_1px),linear-gradient(to_bottom,#c9a962_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.02]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.2em] mb-6">
                品牌願景
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#f5f5f0]">
                連結本質，創造不凡
              </h2>
            </div>
            
            <div className="space-y-8 text-lg text-[#f5f5f0]/60 leading-relaxed">
              <p>
                超烜創意聖域不僅是創意發想的溫床，更是心靈成長與品牌蛻變的孵化器。我們深信，真正能觸動人心的創意，源於品牌對自身靈魂與願景的深度探索，並透過整合性的表達，綻放出獨一無二的光芒。
              </p>
              <p>
                我們致力於打造一個匯聚多元專業的跨界創意平台，將<span className="text-[#c9a962]">美學設計</span>、<span className="text-[#c9a962]">策略行銷</span>、<span className="text-[#c9a962]">原創IP開發</span>與<span className="text-[#c9a962]">靈性療癒</span>融為一體。透過這四大核心支柱，為渴望突破的個人與企業，提供量身打造的品牌升級服務。
              </p>
            </div>

            {/* Quote */}
            <div className="mt-16 p-10 bg-[#141414] border border-[#c9a962]/20 rounded-sm relative">
              <div className="absolute -top-4 left-10">
                <Quote className="h-8 w-8 text-[#c9a962]" />
              </div>
              <p className="text-lg md:text-xl text-[#f5f5f0]/80 italic leading-relaxed pl-4 border-l-2 border-[#c9a962]/40">
                「在超烜創意聖域，我們不僅創造超越想像的視覺語言，更深度塑造品牌的靈魂與識別；我們不僅精準傳遞市場訊息，更引導品牌與受眾產生深度共鳴。」
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section id="services" className="py-24 bg-[#0a0a0a] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.2em] mb-6">
              聖域導覽
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#f5f5f0] mb-6">
              六大服務場域
            </h2>
            <p className="text-lg text-[#f5f5f0]/50 max-w-2xl mx-auto">
              每一個場域都是您品牌完整發展生態的重要拼圖<br className="hidden md:block" />
              由資深專業團隊主理，確保每個環節都精準到位
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((service, index) => (
              <div 
                key={service.title}
                className="group p-8 bg-[#141414] border border-[#c9a962]/10 hover:border-[#c9a962]/40 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 border border-[#c9a962]/30 flex items-center justify-center mb-6 group-hover:bg-[#c9a962]/10 transition-colors">
                  <service.icon className="h-6 w-6 text-[#c9a962]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#f5f5f0] mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[#c9a962]/80 mb-4">
                  {service.subtitle}
                </p>
                <p className="text-[#f5f5f0]/50 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-24 bg-[#0f0f0f] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.2em] mb-6">
              品牌精神
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#f5f5f0]">
              我們的真實價值主張
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {brandValues.map((value, index) => (
              <div 
                key={value.title}
                className="flex gap-6 p-8 bg-[#0a0a0a] border border-[#c9a962]/10 hover:border-[#c9a962]/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 border border-[#c9a962]/30 flex items-center justify-center">
                  <value.icon className="h-5 w-5 text-[#c9a962]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#f5f5f0] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[#f5f5f0]/50 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.2em] mb-6">
                關於創辦人
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#f5f5f0] mb-4">
                默默超
              </h2>
              <p className="text-[#f5f5f0]/40 text-lg">
                Weider Chao
              </p>
            </div>

            <div className="space-y-6 text-[#f5f5f0]/60 leading-relaxed text-lg">
              <p>
                致力於將藝術、創意與療癒深度融合並實踐的跨界整合者。過去16年來，深耕於品牌行銷、公關策略與策展活動領域，累積了豐富的實戰經驗。
              </p>
              <p>
                曾為 Samsung 策劃旗艦手機系列上市的整合行銷戰役，為 LINE 設計了多場用戶互動體驗活動，並協助 MediaTek 成功推動其新技術發布。此外，還與 SEIKO、DIOR、COACH、晶華酒店、文華東方以及台灣啤酒等數十個跨國與本土知名品牌合作。
              </p>
            </div>

            {/* Client Logos */}
            <div className="mt-16 p-10 bg-[#0f0f0f] border border-[#c9a962]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9a962]/60 text-center mb-8">合作品牌</p>
              <div className="flex flex-wrap justify-center gap-4">
                {clientLogos.map((logo) => (
                  <span 
                    key={logo}
                    className="px-5 py-2.5 bg-[#141414] border border-[#c9a962]/10 text-sm text-[#f5f5f0]/50"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>

            {/* Founder Quote */}
            <div className="mt-16 p-10 bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-[#c9a962]/20 relative">
              <div className="absolute -top-4 left-10">
                <Quote className="h-8 w-8 text-[#c9a962]" />
              </div>
              <p className="text-lg md:text-xl text-[#f5f5f0]/80 italic leading-relaxed mb-6">
                「在每一個創意誕生的瞬間，我深刻體會到，真正的力量源自於卸下偽裝，勇敢面對內在的真實光芒——那正是『超烜』的本質。
              </p>
              <p className="text-lg md:text-xl text-[#f5f5f0]/80 italic leading-relaxed">
                超烜創意聖域，這個我們精心打造的『聖域』，將透過我們的每一項服務，成為你最堅實的後盾。」
              </p>
              <p className="text-right mt-8 text-[#c9a962] font-serif font-medium tracking-wider">
                — 默默超
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Name Origin Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 border border-[#c9a962]/30 text-[#c9a962] rounded-full text-xs uppercase tracking-[0.2em] mb-6">
                名稱由來
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#f5f5f0]">
                超烜與聖域的深刻意義
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-10 bg-[#0a0a0a] border border-[#c9a962]/20">
                <h3 className="font-serif text-2xl font-bold text-[#c9a962] mb-2">
                  「超烜」
                </h3>
                <p className="text-xs uppercase tracking-[0.15em] text-[#f5f5f0]/40 mb-6">Chāo Xuǎn</p>
                <p className="text-[#f5f5f0]/60 leading-relaxed">
                  源自古籍中「光芒耀眼，超越凡俗」之意。象徵著品牌內在真實、獨特且無法被模仿的強大能量。真正的創意並非僅止於視覺上的華麗，而是根植於品牌核心價值所散發的真實光輝。
                </p>
              </div>

              <div className="p-10 bg-[#0a0a0a] border border-[#c9a962]/20">
                <h3 className="font-serif text-2xl font-bold text-[#c9a962] mb-2">
                  「聖域」
                </h3>
                <p className="text-xs uppercase tracking-[0.15em] text-[#f5f5f0]/40 mb-6">Shèng Yù</p>
                <p className="text-[#f5f5f0]/60 leading-relaxed">
                  代表著我們為客戶和團隊成員打造的一個安全、高能量且能激發深度探索的專屬場域。在這裡，我們鼓勵坦誠、接納所有的可能性，無需偽裝，也無須害怕評斷。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c9a962]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-[#c9a962] mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#f5f5f0] mb-6">
              開啟您的品牌蛻變之旅
            </h2>
            <p className="text-lg text-[#f5f5f0]/50 mb-12 leading-relaxed">
              無論您是渴望建立個人品牌的創業者，還是希望升級企業形象的決策者<br className="hidden md:block" />
              超烜創意聖域都將成為您最堅實的後盾
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group bg-[#c9a962] hover:bg-[#d4b872] text-[#0a0a0a] font-medium px-10">
                <Link to="/home">
                  探索虹靈御所
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/10 hover:border-[#c9a962]/50 px-10">
                <Link to="/about">
                  了解更多
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Footer for dark theme */}
      <footer className="bg-[#050505] border-t border-[#c9a962]/10 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={logoChaoxuan} alt="超烜創意" className="h-10 w-auto" />
              <span className="text-[#f5f5f0]/30">×</span>
              <span className="font-serif text-[#f5f5f0]/50">虹靈御所</span>
            </div>
            <p className="text-sm text-[#f5f5f0]/30">
              © {new Date().getFullYear()} MOMO CHAO / 超烜創意 / 虹靈御所 版權所有
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChaoxuanPage;
