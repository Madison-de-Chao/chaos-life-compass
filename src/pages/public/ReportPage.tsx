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
  Star
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
    description: "你提供四系統命盤資料（紫微、八字、占星、人類圖）",
  },
  {
    step: "2",
    title: "動態評估",
    description: "先做「療癒 / 效率」動態比例評估，不直接寫正文",
  },
  {
    step: "3",
    title: "版本分流",
    description: "確認版本後分流：標準版走標準規格，旗艦版開啟思維系統與四時軍團模組",
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

const ReportPage = () => {
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
          
          <p className="text-lg md:text-xl text-amber-300/80 mb-14 animate-fade-in font-light tracking-wide" style={{ animationDelay: '0.4s' }}>
            看懂自己，才有能力使用自己。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button size="xl" className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500">
              <BookOpen className="mr-2 h-5 w-5" />
              先看試閱
            </Button>
            <Button variant="outline" size="xl" className="text-lg px-10 py-7 rounded-full border-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300">
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
      
      {/* Process Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              你的報告怎麼產生
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              流程固定，目的只有一個：<span className="text-amber-400">品質穩</span>。
            </p>
          </div>
          
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <div 
                key={step.step}
                className="group flex items-start gap-8 bg-gradient-to-r from-[#1a1a1a] to-transparent rounded-3xl p-8 md:p-10 border border-white/5 hover:border-amber-500/20 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center font-serif font-bold text-2xl text-black shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">
                    Step {step.step}｜{step.title}
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Plans Section - Premium Cards */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">Choose Your Experience</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              方案選擇
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Standard Plan */}
            <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[40px] p-10 md:p-12 border border-white/10 hover:border-white/20 transition-all duration-500">
              <div className="mb-8">
                <span className="inline-block px-5 py-2 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-6 tracking-wide">
                  標準版
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  看懂自己
                </h3>
                <p className="text-white/50 text-lg">
                  像一面高畫質的鏡子，讓你看清原廠設定。
                </p>
              </div>
              
              <div className="space-y-5 mb-10">
                <p className="font-medium text-white/70 text-sm uppercase tracking-wider">適合你如果：</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 text-white/60">
                    <CheckCircle2 className="h-6 w-6 text-white/40 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">第一次接觸、想先建立清晰的自我理解</span>
                  </li>
                  <li className="flex items-start gap-4 text-white/60">
                    <CheckCircle2 className="h-6 w-6 text-white/40 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">想要「可落地建議」，但不需要進入思維系統與軍團敘事</span>
                  </li>
                </ul>
              </div>
              
              <Button variant="outline" className="w-full rounded-2xl py-7 text-lg border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all">
                了解更多
              </Button>
            </div>
            
            {/* Flagship Plan - Premium */}
            <div className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 rounded-[44px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[40px] p-10 md:p-12 border-2 border-amber-500/40 hover:border-amber-400/60 transition-all duration-500 overflow-hidden">
                {/* Luxury Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydi0yaC00djJoLTJ2NGgydjJoNHYtMmgydjJoNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                
                {/* Recommended Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-sm font-bold shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-wider">
                    <Star className="w-4 h-4" />
                    推薦
                  </span>
                </div>
                
                <div className="mb-8 pt-4">
                  <span className="inline-block px-5 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6 tracking-wide">
                    旗艦版
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                    使用自己
                  </h3>
                  <p className="text-white/60 text-lg">
                    像一套人生操作系統（OS）的重灌光碟。
                  </p>
                </div>
                
                <div className="space-y-5 mb-10">
                  <p className="font-medium text-amber-400/80 text-sm uppercase tracking-wider">你會多得到：</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 text-white/80">
                      <Sparkles className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">全篇植入「默默超思維系統」的運作邏輯（情緒/行動/心智/價值）</span>
                    </li>
                    <li className="flex items-start gap-4 text-white/80">
                      <Sparkles className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">每章「思維啟動器」金句＋文字版流程圖</span>
                    </li>
                    <li className="flex items-start gap-4 text-white/80">
                      <Sparkles className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">獨家章節：你為什麼需要默默超思維（含客製化思維工具箱）</span>
                    </li>
                    <li className="flex items-start gap-4 text-white/80">
                      <Sparkles className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">獨家章節：四時八字軍團（家族/成長/本我/未來）RPG 敘事</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="w-full rounded-2xl py-7 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500">
                  選擇旗艦版
                </Button>
              </div>
            </div>
          </div>
          
          {/* Plan Comparison */}
          <div className="mt-16 text-center bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent rounded-3xl p-10 border border-white/5">
            <p className="font-serif text-xl text-white mb-4">
              <strong className="text-amber-400">用一句話分辨</strong>
            </p>
            <p className="text-white/60 text-lg">
              標準版：看懂自己。是命盤的<span className="text-white/80">鏡子</span>。<br />
              旗艦版：使用自己。是人生的<span className="text-amber-400">導航系統與操作手冊</span>。
            </p>
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
                方便你隨時回來查
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
                保留成你的人生秘笈
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
      
      {/* Disclaimer Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10">
            <AlertTriangle className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-white/80 mb-2">免責聲明</h3>
              <p className="text-white/50 leading-relaxed">
                本報告屬命理分析與自我探索工具，提供生活與決策參考，不取代醫療、心理、法律、投資等專業意見。
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
            <Button variant="outline" size="xl" className="text-lg px-10 py-7 rounded-full border-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300">
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
