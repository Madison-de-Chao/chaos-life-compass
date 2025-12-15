import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  BookOpen,
  Compass,
  Layers,
  Download,
  Globe,
  HelpCircle,
  AlertTriangle,
  Crown,
  Gem,
  Star,
  Clock,
  Headphones,
  Video,
  Users,
  Lock,
  BarChart3,
  Mic
} from "lucide-react";
import { Link } from "react-router-dom";

const targetAudience = [
  "你很努力，但常覺得「力氣用錯地方」",
  "你理性很強，卻也敏感，容易被人事物牽動節奏",
  "你不想聽好聽話，你想要可驗證、可落地的解釋",
  "你在關係、事業或金錢上，總有同一種卡點重複出現",
  "你想要的是「更懂自己」而不是「被定義」",
];

const reportFeatures = [
  {
    icon: Layers,
    title: "四系統命盤依據",
    description: "交叉比對，避免單一系統的偏誤",
  },
  {
    icon: Compass,
    title: "過去與現在的模式對照",
    description: "讓你用人生經驗驗證",
  },
  {
    icon: FileText,
    title: "可執行的生活建議",
    description: "寫成你做得到的步驟",
  },
  {
    icon: Sparkles,
    title: "默默超不負責提醒",
    description: "一針見血但不恐嚇",
  },
];

const processSteps = [
  {
    step: "1",
    title: "提供資料",
    description: "客戶提供命盤必要資料（出生年月日、時間、地點；或已排盤檔）",
  },
  {
    step: "2",
    title: "動態評估",
    description: "先做「療癒 / 效率」比例評估（確認本次解讀的用力方向）",
  },
  {
    step: "3",
    title: "撰寫報告",
    description: "撰寫報告＋產出整合圖",
  },
  {
    step: "4",
    title: "製作加值",
    description: "製作語音導讀（與語音摘要／簡報／影片依方案）",
  },
  {
    step: "5",
    title: "品質交付",
    description: "品質檢查後交付（網頁版＋PDF）",
  },
];

const faqs = [
  {
    q: "我不懂命理也能看懂嗎？",
    a: "可以。報告會把命盤語言轉成「你在生活裡看得到的現象」與「你做得到的建議」。",
  },
  {
    q: "你會不會寫得很玄，或很像算命？",
    a: "不會。我們的核心是鏡子，不是劇本。拒絕預言式的結論。",
  },
  {
    q: "神煞會不會很可怕？",
    a: "不會。神煞只在事業、愛情、金錢三章使用，並且一律用兵符/心理語言翻譯，不恐嚇。",
  },
];

// Pricing data
const standardPricing = [
  { plan: "核心包", price: "4,980", features: ["命理報告（網頁版＋PDF）", "語音導讀", "四系統整合圖 x1"], days: 7 },
  { plan: "深度吸收包", price: "7,980", features: ["方案1 全部內容", "語音摘要", "個人簡報（PDF）"], days: 9 },
  { plan: "完整校準包", price: "12,800", features: ["方案2 全部內容", "摘要影片", "一對一對談 60 分鐘"], days: 12 },
];

const flagshipPricing = [
  { plan: "核心包", price: "12,800", features: ["命理報告（網頁版＋PDF）", "語音導讀", "四系統整合圖 x1"], days: 12 },
  { plan: "深度吸收包", price: "16,800", features: ["方案1 全部內容", "語音摘要", "個人簡報（PDF）"], days: 14 },
  { plan: "完整校準包", price: "24,800", features: ["方案2 全部內容", "摘要影片", "一對一對談 60 分鐘"], days: 18 },
];

const planIncludes = [
  { icon: FileText, title: "命理報告", desc: "網頁版＋PDF" },
  { icon: Mic, title: "語音導讀", desc: "帶你怎麼讀、怎麼用" },
  { icon: BarChart3, title: "整合圖", desc: "一張人格儀表板" },
];

const plan2Extras = [
  { icon: Headphones, title: "語音摘要", desc: "通勤可聽、快速複習" },
  { icon: FileText, title: "個人簡報", desc: "可保存的操作手冊版" },
];

const plan3Extras = [
  { icon: Video, title: "摘要影片", desc: "直覺看懂全局" },
  { icon: Users, title: "一對一對談", desc: "60 分鐘線上校準" },
];

const ReportPage = () => {
  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      {/* Hero Section - Luxury Dark */}
      <section className="relative py-32 md:py-40 lg:py-48 overflow-hidden">
        {/* Luxury Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-amber-500/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8 animate-fade-in">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">Premium Astrology Service</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 animate-fade-in leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">默默超</span>
            <br className="md:hidden" />
            <span className="text-white/90">全方位命理解讀報告</span>
          </h1>
          
          <div className="space-y-4 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white/70 leading-relaxed font-light">
              這不是預言。不是劇本。
            </p>
            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed">
              它是一面高畫質的鏡子……讓你看清<span className="text-amber-400">「你一直怎麼運作」</span>。
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-amber-300/80 mb-14 animate-fade-in font-light tracking-wide max-w-3xl mx-auto" style={{ animationDelay: '0.4s' }}>
            把紫微、八字、占星、人類圖四系統交叉整合後，翻譯成「可驗證、可落地、可反覆回頭校準」的人生使用說明書。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button size="xl" className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500">
              <BookOpen className="mr-2 h-5 w-5" />
              先看試閱
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="text-lg px-10 py-7 rounded-full border-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300"
              onClick={scrollToPlans}
            >
              查看方案
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Target Audience Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              這份報告適合誰
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              如果你符合其中兩項以上，你會讀得很有感：
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-10 md:p-14 border border-amber-500/10 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            <ul className="space-y-6">
              {targetAudience.map((item, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-5 animate-fade-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-all">
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-white/80 text-lg md:text-xl leading-relaxed group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      {/* What You Get Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              你會拿到什麼
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              你拿到的不是一堆術語。<br />
              而是一份可反覆使用的<span className="text-amber-400">自我校準文件</span>。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reportFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-10 border border-white/5 hover:border-amber-500/30 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 mb-8 group-hover:from-amber-500/20 group-hover:to-amber-600/20 transition-all">
                  <feature.icon className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Stance Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)]">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-amber-400 mx-auto mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                我們的立場
              </h2>
            </div>
            
            <div className="space-y-10 font-serif text-xl leading-relaxed">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">報告是鏡子，不是劇本。</p>
                <p className="text-white/50">我們拒絕用「命中注定」把你釘死。</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">神煞也不拿來嚇人。</p>
                <p className="text-white/50">一律轉譯成可理解的心理狀態、能量模式或「兵符效果」。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Versions Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              兩個版本
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              同樣三階方案，不同內容深度
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Standard Version */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[40px] p-10 md:p-12 border border-white/10 hover:border-white/20 transition-all duration-500">
              <div className="mb-8">
                <span className="inline-block px-5 py-2 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-6 tracking-wide">
                  標準版
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  看懂自己
                </h3>
                <p className="text-white/50 text-lg mb-6">
                  快速建立自我理解地圖，把方向與節奏校準好
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/60">
                  <CheckCircle2 className="h-5 w-5 text-white/40" />
                  <span>清晰、好讀、重點落地</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <CheckCircle2 className="h-5 w-5 text-white/40" />
                  <span>以「日常可用」為主</span>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/70 italic">
                  「我想先看懂自己，找到更省力的運作方式。」
                </p>
              </div>
            </div>
            
            {/* Flagship Version */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 rounded-[44px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[40px] p-10 md:p-12 border-2 border-amber-500/40 hover:border-amber-400/60 transition-all duration-500 overflow-hidden h-full">
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydi0yaC00djJoLTJ2NGgydjJoNHYtMmgydjJoNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-sm font-bold shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-wider">
                    <Star className="w-4 h-4" />
                    推薦
                  </span>
                </div>
                
                <div className="mb-8 pt-4 relative z-10">
                  <span className="inline-block px-5 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6 tracking-wide">
                    旗艦版
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                    使用自己
                  </h3>
                  <p className="text-white/60 text-lg mb-6">
                    把洞察升級成操作系統，適合長期回頭校準
                  </p>
                </div>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex items-center gap-3 text-white/80">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <span>更深的整合</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <span>更多決策流程與能量管理工具</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <span>更完整的系統化呈現</span>
                  </div>
                </div>
                
                <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 relative z-10">
                  <p className="text-amber-300/90 italic">
                    「我想開始使用自己，把人生校準成可長期複利的系統。」
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans & Pricing Section */}
      <section id="plans-section" className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">Pricing</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              交付內容階梯
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              三階方案，遞進式體驗升級
            </p>
          </div>

          {/* Plan Tiers Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Plan 1 */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10">
              <h3 className="font-serif text-xl font-bold text-white mb-4">方案 1｜核心包</h3>
              <p className="text-white/50 text-sm mb-6">報告＋語音導讀＋整合圖</p>
              <div className="space-y-3">
                {planIncludes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-amber-400/70" />
                    <div>
                      <span className="text-white/80 text-sm">{item.title}</span>
                      <span className="text-white/40 text-xs ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan 2 */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10">
              <h3 className="font-serif text-xl font-bold text-white mb-4">方案 2｜深度吸收包</h3>
              <p className="text-white/50 text-sm mb-6">方案1＋語音摘要＋個人簡報</p>
              <div className="space-y-3">
                <div className="text-white/40 text-sm mb-2">包含方案1全部 +</div>
                {plan2Extras.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-amber-400/70" />
                    <div>
                      <span className="text-white/80 text-sm">{item.title}</span>
                      <span className="text-white/40 text-xs ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan 3 */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-amber-500/20">
              <h3 className="font-serif text-xl font-bold text-amber-400 mb-4">方案 3｜完整校準包</h3>
              <p className="text-white/50 text-sm mb-6">方案2＋摘要影片＋一對一對談</p>
              <div className="space-y-3">
                <div className="text-white/40 text-sm mb-2">包含方案2全部 +</div>
                {plan3Extras.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-amber-400" />
                    <div>
                      <span className="text-white/80 text-sm">{item.title}</span>
                      <span className="text-white/40 text-xs ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Standard Pricing */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[40px] p-8 md:p-10 border border-white/10">
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-4">
                  標準版
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">看懂自己</h3>
              </div>
              
              <div className="space-y-4">
                {standardPricing.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-6 rounded-2xl border transition-all ${
                      idx === 2 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-transparent border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white">{item.plan}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3.5 w-3.5 text-white/40" />
                          <span className="text-white/40 text-xs">{item.days} 個工作天</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">NT$ {item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-8 rounded-2xl py-6 text-lg border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all">
                選擇標準版
              </Button>
            </div>

            {/* Flagship Pricing */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 rounded-[44px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[40px] p-8 md:p-10 border-2 border-amber-500/40 overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydi0yaC00djJoLTJ2NGgydjJoNHYtMmgydjJoNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-sm font-bold shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-wider">
                    <Star className="w-4 h-4" />
                    推薦
                  </span>
                </div>
                
                <div className="text-center mb-8 pt-4 relative z-10">
                  <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
                    旗艦版
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">使用自己</h3>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {flagshipPricing.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all ${
                        idx === 2 
                          ? 'bg-amber-500/10 border-amber-500/30' 
                          : 'bg-transparent border-amber-500/10 hover:border-amber-500/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-white">{item.plan}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5 text-amber-400/60" />
                            <span className="text-amber-400/60 text-xs">{item.days} 個工作天</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-amber-400">NT$ {item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-8 rounded-2xl py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500 relative z-10">
                  選擇旗艦版
                </Button>
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm">
              ＊交付天數以「資料齊全」為起算點（含對談排程時間）
            </p>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              製作流程
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              讓客人安心、也符合內部品質控
            </p>
          </div>
          
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <div 
                key={step.step}
                className="group flex items-start gap-6 bg-gradient-to-r from-[#1a1a1a] to-transparent rounded-2xl p-6 md:p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center font-serif font-bold text-xl text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Delivery Format Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              交付形式
            </h2>
            <p className="text-white/50 text-lg">全方案一致</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-10 border border-white/10 hover:border-amber-500/20 transition-all duration-500 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 mb-6 group-hover:from-amber-500/20 group-hover:to-amber-600/20 transition-all">
                <Globe className="h-10 w-10 text-amber-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">
                網頁閱讀版
              </h3>
              <p className="text-white/50 text-lg">
                方便回查
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-10 border border-white/10 hover:border-amber-500/20 transition-all duration-500 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 mb-6 group-hover:from-amber-500/20 group-hover:to-amber-600/20 transition-all">
                <Download className="h-10 w-10 text-amber-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">
                PDF 下載列印版
              </h3>
              <p className="text-white/50 text-lg">
                可保存成個人秘笈
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <HelpCircle className="h-16 w-16 text-amber-400 mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              常見問題
            </h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-amber-500/20 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4 flex items-start gap-4">
                  <span className="text-amber-400">Q</span>
                  {faq.q}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed pl-8">
                  <span className="text-amber-400/60">A：</span>{faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Privacy & Disclaimer Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Privacy */}
          <div className="flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10">
            <Lock className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-white/80 mb-3">隱私原則</h3>
              <ul className="text-white/50 leading-relaxed space-y-2">
                <li>• 個人資料與命盤內容僅用於本次報告製作，不對外分享</li>
                <li>• 若需作為試閱示例，必須取得當事人明確同意並完成匿名化處理</li>
              </ul>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10">
            <AlertTriangle className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-white/80 mb-2">免責聲明</h3>
              <p className="text-white/50 leading-relaxed">
                本報告屬命理分析與自我探索工具，提供生活與決策參考，不取代醫療、心理、法律或投資等專業意見。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-t from-amber-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            如果你想少走彎路，<br />
            不是去找更多答案。
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12">
            而是先看清<span className="text-amber-400">「你是怎麼運作的」</span>。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button size="xl" className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500">
              <BookOpen className="mr-2 h-5 w-5" />
              先看試閱
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="text-lg px-10 py-7 rounded-full border-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300"
              onClick={scrollToPlans}
            >
              查看方案
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default ReportPage;
