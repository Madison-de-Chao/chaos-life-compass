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
  AlertTriangle
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
    <div className="min-h-screen bg-parchment">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-parchment-hero" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-8 animate-fade-in leading-tight">
            <span className="text-primary">默默超</span>全方位命理解讀報告
          </h1>
          
          <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed">
              這不是預言。不是劇本。
            </p>
            <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed">
              它是一面高畫質的鏡子……讓你看清「你一直怎麼運作」。
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            看懂自己，才有能力使用自己。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-soft hover:shadow-elevated transition-all">
              <BookOpen className="mr-2 h-5 w-5" />
              先看試閱
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-2">
              查看方案
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Target Audience Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              這份報告適合誰
            </h2>
            <p className="text-muted-foreground text-lg">
              如果你符合其中兩項以上，你會讀得很有感：
            </p>
          </div>
          
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <ul className="space-y-5">
              {targetAudience.map((item, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90 text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      {/* What You Get Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              你會拿到什麼
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              你拿到的不是一堆術語。<br />
              而是一份可反覆使用的自我校準文件。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Stance Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gradient-to-br from-primary/10 via-card to-amber-900/10 rounded-3xl p-8 md:p-12 shadow-soft border border-primary/20">
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                我們的立場
              </h2>
            </div>
            
            <div className="space-y-8 font-serif text-lg leading-relaxed text-foreground/90">
              <div className="text-center">
                <p className="text-xl font-medium text-foreground mb-2">報告是鏡子，不是劇本。</p>
                <p className="text-muted-foreground">我們拒絕用「命中注定」把你釘死。</p>
              </div>
              
              <hr className="border-border/50" />
              
              <div className="text-center">
                <p className="text-xl font-medium text-foreground mb-2">神煞也不拿來嚇人。</p>
                <p className="text-muted-foreground">一律轉譯成可理解的心理狀態、能量模式或「兵符效果」。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              你的報告怎麼產生
            </h2>
            <p className="text-muted-foreground text-lg">
              流程固定，目的只有一個：品質穩。
            </p>
          </div>
          
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <div 
                key={step.step}
                className="flex items-start gap-6 bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-xl">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    Step {step.step}｜{step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              方案選擇
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Plan */}
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300">
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-4">
                  標準版
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                  看懂自己
                </h3>
                <p className="text-muted-foreground">
                  像一面高畫質的鏡子，讓你看清原廠設定。
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="font-medium text-foreground">適合你如果：</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>第一次接觸、想先建立清晰的自我理解</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>想要「可落地建議」，但不需要進入思維系統與軍團敘事</span>
                  </li>
                </ul>
              </div>
              
              <Button variant="outline" className="w-full rounded-xl py-6 text-lg">
                了解更多
              </Button>
            </div>
            
            {/* Flagship Plan */}
            <div className="bg-gradient-to-br from-primary/10 via-card to-amber-900/10 rounded-3xl p-8 md:p-10 shadow-elevated border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 relative">
              <div className="absolute -top-3 right-8">
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg">
                  推薦
                </span>
              </div>
              
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                  旗艦版
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                  使用自己
                </h3>
                <p className="text-muted-foreground">
                  像一套人生操作系統（OS）的重灌光碟。
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="font-medium text-foreground">你會多得到：</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-foreground/80">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>全篇植入「默默超思維系統」的運作邏輯（情緒/行動/心智/價值）</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground/80">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>每章「思維啟動器」金句＋文字版流程圖</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground/80">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>獨家章節：你為什麼需要默默超思維（含客製化思維工具箱）</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground/80">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>獨家章節：四時八字軍團（家族/成長/本我/未來）RPG 敘事</span>
                  </li>
                </ul>
              </div>
              
              <Button className="w-full rounded-xl py-6 text-lg shadow-soft hover:shadow-elevated">
                選擇旗艦版
              </Button>
            </div>
          </div>
          
          {/* Plan Comparison */}
          <div className="mt-12 text-center bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50">
            <p className="font-serif text-lg text-foreground mb-2">
              <strong>用一句話分辨</strong>
            </p>
            <p className="text-muted-foreground">
              標準版：看懂自己。是命盤的鏡子。<br />
              旗艦版：使用自己。是人生的導航系統與操作手冊。
            </p>
          </div>
        </div>
      </section>
      
      {/* Delivery Format Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              交付形式
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                網頁閱讀版
              </h3>
              <p className="text-muted-foreground">
                方便你隨時回來查
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center">
              <Download className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                PDF 下載列印版
              </h3>
              <p className="text-muted-foreground">
                保留成你的人生秘笈
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              常見問題
            </h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-start gap-3">
                  <span className="text-primary">Q：</span>
                  {faq.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-8">
                  <span className="text-foreground font-medium">A：</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Disclaimer Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-muted/50 rounded-2xl p-6 md:p-8 border border-border/50">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-2">免責聲明</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  本報告屬命理分析與自我探索工具，提供生活與決策參考，不取代醫療、心理、法律、投資等專業意見。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-parchment-hero" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-relaxed">
            如果你想少走彎路，不是去找更多答案。<br />
            而是先看清「你是怎麼運作的」。
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-soft hover:shadow-elevated transition-all">
              <BookOpen className="mr-2 h-5 w-5" />
              先看試閱
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-2">
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
