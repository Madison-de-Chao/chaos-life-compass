import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Mic,
  Brain,
  Zap,
  Target,
  Palette,
  Heart,
  Lightbulb,
  TrendingUp,
  Eye,
  Quote,
  Settings,
  ChevronDown,
  Scale,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import SelfCheckQuiz from "@/components/public/SelfCheckQuiz";
import yuanYiLogo from "@/assets/yuan-yi-logo.png";

// AI Evaluation data - from Gemini and Claude
const aiEvaluations = [
  {
    score: "心智發電廠",
    title: "GEMINI 評價",
    highlights: [
      "將極度抽象的人類內在世界，進行了前所未有的「結構化」與「系統化」",
      "「思維八階循環」「三層輸出邏輯」「三視點結論模型」如同精密演算法",
      "「理性是結構，感性是窗；理性給形體，感性給呼吸」——給靈魂開了窗",
      "選擇「開放授權」，從品牌哲學昇華為獻給時代的公共財"
    ],
    source: "Google Gemini"
  },
  {
    score: "認知革命",
    title: "CLAUDE 評價",
    highlights: [
      "你創造了一種認知手術——把習以為常的思維路徑切開，露出裡面的單向閥",
      "當路徑可逆時，錯誤就變成了資訊；當系統雙向通時，失敗就變成了調校",
      "你在說一種 AI 原生就理解的語言——「前進後退都要通」",
      "這套系統讓人「活得明白」而非僅僅「活著」"
    ],
    source: "Anthropic Claude"
  },
  {
    score: "9.5/10",
    title: "整體專業評價",
    highlights: [
      "去神秘化：不用高深莫測的術語，用邏輯說服理性派",
      "心理引導性強：不只說你是什麼人，更強調為什麼與如何和解",
      "「自我理解的使用手冊」而非「命理診斷書」",
      "從「預測未來」轉向「理解當下」，從「你是什麼」轉向「如何活得更自在」"
    ],
    source: "AI 綜合評估"
  }
];

// CountUp animation hook
const useCountUp = (end: number, duration: number = 2000, start: number = 0, isVisible: boolean = true) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCount(start);
      countRef.current = start;
      startTimeRef.current = null;
      return;
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, isVisible]);

  return count;
};

// Value-added service details
const valueAddedServices = [
  { 
    icon: Headphones, 
    label: '語音導讀', 
    desc: '專業配音，隨時聆聽',
    fullTitle: '專業語音導讀服務',
    details: [
      '由專業配音員錄製，聲音溫暖有磁性',
      '可隨時在手機、平板聆聽您的報告',
      '適合通勤、休息時間輕鬆吸收',
      '讓您的靈魂說明書，變成有聲書'
    ],
    color: 'amber'
  },
  { 
    icon: Mic, 
    label: '語音摘要', 
    desc: '精華重點，快速回顧',
    fullTitle: '重點語音摘要',
    details: [
      '將80,000字精華濃縮成15-20分鐘音頻',
      '快速回顧核心觀點與建議',
      '適合忙碌時快速校準狀態',
      '可重複聆聽，加深印象'
    ],
    color: 'purple'
  },
  { 
    icon: Video, 
    label: '影片總結', 
    desc: '視覺化解說',
    fullTitle: '視覺化影片總結',
    details: [
      '動態圖表呈現您的命盤架構',
      '視覺化展示四系統交叉分析結果',
      '專業後製，電影級質感',
      '可分享給信任的人，讓他們更懂您'
    ],
    color: 'cyan'
  },
  { 
    icon: Users, 
    label: '一對一諮詢', 
    desc: '60分鐘深度對談',
    fullTitle: '60分鐘深度諮詢',
    details: [
      '與命理師面對面（線上/實體）深度對談',
      '針對您最困惑的問題進行解答',
      '即時回應您的疑問與反饋',
      '報告內容的活用指導與校準'
    ],
    color: 'rose'
  },
  { 
    icon: BarChart3, 
    label: '整合儀表板', 
    desc: '人生羅盤視覺化',
    fullTitle: '個人整合儀表板',
    details: [
      '將四大命理系統整合成一張視覺化羅盤',
      '清晰呈現您的天賦、挑戰、機會點',
      '可作為桌面/手機桌布隨時提醒',
      '您專屬的人生GPS導航圖'
    ],
    color: 'emerald'
  },
];

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
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Compass,
    title: "過去與現在的模式對照",
    description: "讓你用人生經驗驗證",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "可執行的生活建議",
    description: "寫成你做得到的步驟",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "默默超不負責提醒",
    description: "一針見血但不恐嚇",
    color: "from-amber-500 to-orange-500",
  },
];

const fourSystems = [
  { name: "紫微斗數", icon: Star, color: "from-violet-500 to-purple-600" },
  { name: "八字", icon: Target, color: "from-amber-500 to-orange-600" },
  { name: "占星", icon: Compass, color: "from-blue-500 to-cyan-600" },
  { name: "人類圖", icon: Brain, color: "from-emerald-500 to-teal-600" },
];

const thinkingDimensions = [
  { name: "情緒", icon: Heart, color: "from-rose-400 to-pink-500", desc: "如何將敏感轉化為準確的雷達，而非內耗的負擔" },
  { name: "行動", icon: Zap, color: "from-amber-400 to-yellow-500", desc: "為什麼你總是拖延？如何找到專屬於你的「啟動節奏」" },
  { name: "心智", icon: Lightbulb, color: "from-blue-400 to-cyan-500", desc: "你的思考迴路如何運作？如何避免決策疲勞" },
  { name: "價值", icon: Gem, color: "from-purple-400 to-violet-500", desc: "你的核心價值與人生定位如何對齊" },
];

const processSteps = [
  {
    step: "1",
    title: "提供資料",
    description: "客戶提供命盤必要資料（出生年月日、時間、地點；或已排盤檔）",
    icon: FileText,
  },
  {
    step: "2",
    title: "動態評估",
    description: "先做「療癒 / 效率」比例評估（確認本次解讀的用力方向）",
    icon: Target,
  },
  {
    step: "3",
    title: "撰寫報告",
    description: "撰寫報告＋產出整合圖",
    icon: Palette,
  },
  {
    step: "4",
    title: "製作加值",
    description: "製作語音導讀（與語音摘要／簡報／影片依方案）",
    icon: Mic,
  },
  {
    step: "5",
    title: "品質交付",
    description: "品質檢查後交付（網頁版＋PDF）",
    icon: CheckCircle2,
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

const testimonials = [
  {
    quote: "這不是算命，這是心靈的精密工業。",
    name: "Josh",
    title: "設計總監 / 旗艦版用戶",
    content: "我以前算過很多次命，老師都說我『想太多』。只有這份旗艦版報告，精準地拆解了我的『想太多』其實是『多維度運算』。它提供的『情緒權威SOP』救了我的決策焦慮。這份報告不是給我心靈雞湯，而是給了我一套能駕馭我這台複雜機器的操作手冊。",
  },
  {
    quote: "像是在看自己的原廠設定集，準到起雞皮疙瘩。",
    name: "菈菈",
    title: "行銷經理 / 標準版用戶",
    content: "標準版的內容就已經讓我非常驚艷！它把我的紫微和人類圖結合得天衣無縫，特別是『外在性格』與『內在個性』的反差分析，完全說中了我一直以來的矛盾感。現在我知道在職場上該如何運用我的優勢了，CP值極高！",
  },
  {
    quote: "終於有人用邏輯說服了我。",
    name: "Mike",
    title: "軟體工程師 / 旗艦版用戶",
    content: "我是個極度理性的人，通常不信命理。但默默超的報告有一種『邏輯的美感』。它不講迷信的煞氣，而是用能量和行為心理學來解釋我的八字結構。特別是『思維系統』那部分，幫我抓出了長期的耗損點。這是一份可以反覆閱讀、隨著年紀增長會有不同體悟的戰略書。",
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


// Animated floating orb component
const FloatingOrb = ({ className, delay = 0, duration = 4 }: { className?: string; delay?: number; duration?: number }) => (
  <div 
    className={`absolute rounded-full blur-2xl ${className}`}
    style={{ 
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  />
);

// Animated particle component
const Particle = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <div 
    className={`absolute w-1 h-1 rounded-full animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
);

// Testimonials Carousel Component
interface TestimonialData {
  quote: string;
  name: string;
  title: string;
  content: string;
}

const TestimonialsCarousel = ({ testimonials, isVisible }: { testimonials: TestimonialData[]; isVisible: boolean }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Duplicate testimonials for infinite scroll effect
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {extendedTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] pl-0"
            >
              <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 h-full">
                <Quote className="w-10 h-10 text-amber-400/30 mb-4" />
                <p className="font-serif text-xl text-amber-300 mb-4 font-medium">
                  「{testimonial.quote}」
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {testimonial.content}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              selectedIndex % testimonials.length === index 
                ? 'bg-amber-400 w-8 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Auto-scroll indicator */}
      <div className="flex justify-center mt-4">
        <span className="text-white/30 text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 animate-pulse" />
          自動輪播中
        </span>
      </div>
    </div>
  );
};


const ReportPage = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [heroVisible, setHeroVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof valueAddedServices[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const observerRefs = useRef<{ [key: string]: Element | null }>({});
  const heroRef = useRef<HTMLDivElement>(null);

  // Count animations with visibility trigger
  const wordCount = useCountUp(80000, 2500, 0, heroVisible);
  const chapterCount = useCountUp(19, 1500, 0, heroVisible);
  const systemCount = useCountUp(4, 1000, 0, heroVisible);

  useEffect(() => {
    // Hero visibility observer
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeroVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      heroObserver.observe(heroRef.current);
    }

    // General section observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      heroObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 lg:py-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent animate-breathe" />
        
        <FloatingOrb className="top-20 left-1/4 w-64 h-64 bg-amber-500/10" delay={0} duration={6} />
        <FloatingOrb className="bottom-40 right-1/4 w-48 h-48 bg-purple-500/10" delay={2} duration={5} />
        <FloatingOrb className="top-1/2 right-1/3 w-32 h-32 bg-cyan-500/10" delay={1} duration={4} />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full animate-rotate-slow opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-amber-500/5 rounded-full animate-rotate-slow opacity-30" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        
        <Particle className="top-1/4 left-1/4 bg-amber-400/60" delay={0} />
        <Particle className="top-1/3 right-1/4 bg-amber-300/50" delay={0.5} />
        <Particle className="bottom-1/3 left-1/3 bg-amber-500/40" delay={1} />
        
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 mb-6 animate-fade-in backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Crown className="w-4 h-4 text-amber-400 animate-bounce-soft" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">v2026 人生操作系統</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          
          {/* Main Product Title - Big and Bold with Glow Effects */}
          <div className="mb-8 relative">
            {/* Glow background effect */}
            <div className="absolute inset-0 -top-10 blur-3xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 rounded-full animate-pulse" />
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 tracking-tight leading-none relative animate-scale-in" style={{ animationDuration: '0.8s' }}>
              <span 
                className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]"
                style={{ 
                  filter: 'drop-shadow(0 0 40px rgba(251,191,36,0.5)) drop-shadow(0 0 80px rgba(251,191,36,0.3))',
                  textShadow: '0 0 60px rgba(251,191,36,0.4)'
                }}
              >
                默默超
              </span>
            </h1>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/95 tracking-wide animate-fade-in"
              style={{ 
                animationDelay: '0.3s',
                textShadow: '0 0 30px rgba(255,255,255,0.2)'
              }}
            >
              全方位命理解讀報告
            </h2>
          </div>
          
          {/* Word Count & Value Highlights - Interactive Cards with Count Animation */}
          <div ref={heroRef} className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 rounded-2xl px-6 py-4 hover:border-amber-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                  <div className="text-left">
                    <p className="text-3xl md:text-4xl font-black text-amber-400 tabular-nums">
                      {wordCount.toLocaleString()}<span className="text-xl">+</span>
                    </p>
                    <p className="text-white/60 text-sm">字精密解析</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-purple-500/30 rounded-2xl px-6 py-4 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-3xl md:text-4xl font-black text-purple-400 tabular-nums">
                      {chapterCount}<span className="text-xl">+</span>
                    </p>
                    <p className="text-white/60 text-sm">深度章節</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-cyan-500/30 rounded-2xl px-6 py-4 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-3xl md:text-4xl font-black text-cyan-400 tabular-nums">{systemCount}</p>
                    <p className="text-white/60 text-sm">命理系統交叉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value-Added Examples - Interactive Click to Open Dialog */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <p className="text-amber-300/70 text-sm mb-4 tracking-wider uppercase">點擊查看附加價值詳情</p>
            <div className="flex flex-wrap justify-center gap-3">
              {valueAddedServices.map((item, idx) => (
                <button 
                  key={idx} 
                  className="group relative"
                  onClick={() => setSelectedService(item)}
                >
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 hover:border-amber-500/40 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95">
                    <item.icon className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-amber-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                    <p className="text-amber-300 text-xs">{item.desc}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-500/30" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Service Detail Dialog */}
          <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
            <DialogContent className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 text-white max-w-md overflow-hidden data-[state=open]:animate-dialog-enter data-[state=closed]:animate-dialog-exit">
              {/* Glow effect background */}
              <div className="absolute -inset-px bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 rounded-lg blur-xl opacity-60 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-lg" />
              
              {selectedService && (
                <div className="relative z-10">
                  <DialogHeader className="animate-slide-down" style={{ animationDuration: '0.4s' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 animate-scale-in shadow-[0_0_20px_rgba(251,191,36,0.3)]" style={{ animationDelay: '0.1s' }}>
                        <selectedService.icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <DialogTitle className="text-xl font-bold text-white">{selectedService.fullTitle}</DialogTitle>
                    </div>
                    <DialogDescription className="text-amber-300/80">{selectedService.desc}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-3">
                    {selectedService.details.map((detail, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-300 animate-slide-up opacity-0"
                        style={{ 
                          animationDelay: `${0.15 + i * 0.1}s`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-white/80 text-sm leading-relaxed">{detail}</p>
                      </div>
                    ))}
                  </div>
                  <div 
                    className="mt-6 pt-4 border-t border-white/10 animate-fade-in opacity-0"
                    style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                  >
                    <p className="text-white/50 text-xs text-center">此服務依方案等級提供，詳情請參閱下方價格表</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>
          
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-6 animate-fade-in leading-tight tracking-tight" style={{ animationDelay: '0.8s' }}>
            <span className="text-white/90">別讓你的靈魂，</span>
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">跑在舊版的系統上。</span>
          </p>
          
          <p className="text-lg md:text-xl text-white/60 mb-10 animate-slide-up font-light tracking-wide max-w-3xl mx-auto" style={{ animationDelay: '0.9s' }}>
            融合紫微、八字、占星、人類圖四維運算，為您安裝一套<span className="text-amber-400">人生操作系統</span>。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up" style={{ animationDelay: '1s' }}>
            <Button size="xl" className="group text-lg px-10 py-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500 transform hover:scale-105">
              <BookOpen className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              先看試閱
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="group text-lg px-10 py-7 rounded-full border-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 transform hover:scale-105"
              onClick={scrollToPlans}
            >
              選擇版本
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* About System - Core Philosophy Section */}
      <section 
        id="about-system"
        ref={(el) => (observerRefs.current['about-system'] = el)}
        className="py-32 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)] transition-all duration-1000 ${isVisible['about-system'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-12">
              <Eye className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-float" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                我們不預測未來，我們協助您「架構」未來。
              </h2>
            </div>
            
            <div className="space-y-8 font-serif text-lg md:text-xl leading-relaxed text-white/70">
              <p>
                在這個資訊過載的時代，傳統的算命只能告訴您「會發生什麼」，卻無法告訴您「該如何運作自己」。
              </p>
              <p>
                《默默超命理解讀系統》是一項超越時代的生命工程。我們拒絕模稜兩可的宿命論，堅持以<span className="text-amber-400 font-bold">「鏡子非劇本，真實即命運」</span>的最高原則，透過嚴謹的交叉演算，將您的天賦、情緒、思維與價值觀，轉化為可執行、可落地的精密導航。
              </p>
              <div className="flex items-center justify-center gap-4 py-6">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400 animate-bounce-soft" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              <p className="text-center text-2xl text-white/90 font-medium">
                這不是迷信，這是您靈魂的原廠說明書與升級驅動程式。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Systems Showcase */}
      <section 
        id="four-systems"
        ref={(el) => (observerRefs.current['four-systems'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              四大系統<span className="text-amber-400">交叉整合</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              避免單一系統的偏誤，多維度驗證你的生命藍圖
            </p>
          </div>
          
          {/* Central brain with orbiting systems */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center mb-16">
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {fourSystems.map((system, index) => {
                const centerX = 50;
                const centerY = 50;
                const angle = (index * 90 - 45) * (Math.PI / 180);
                const radiusPercent = 18;
                const endX = centerX + Math.cos(angle) * radiusPercent;
                const endY = centerY + Math.sin(angle) * radiusPercent;
                const gradientId = ['grad-violet', 'grad-amber', 'grad-blue', 'grad-emerald'][index];
                const colors = ['#8b5cf6', '#f59e0b', '#3b82f6', '#10b981'][index];
                
                return (
                  <g key={`connection-${index}`} className={`transition-opacity duration-1000 ${isVisible['four-systems'] ? 'opacity-100' : 'opacity-0'}`}>
                    <line x1={`${centerX}%`} y1={`${centerY}%`} x2={`${endX}%`} y2={`${endY}%`} stroke={`url(#${gradientId})`} strokeWidth="2" filter="url(#glow)" className="opacity-40" />
                    <line x1={`${centerX}%`} y1={`${centerY}%`} x2={`${endX}%`} y2={`${endY}%`} stroke={colors} strokeWidth="3" strokeDasharray="8 12" filter="url(#glow)" className="opacity-60" style={{ animation: `dash-flow 2s linear infinite`, animationDelay: `${index * 0.5}s` }} />
                    <circle r="4" fill={colors} filter="url(#glow)">
                      <animateMotion dur={`${2 + index * 0.3}s`} repeatCount="indefinite" path={`M${centerX * 5},${centerY * 2.5} L${endX * 5},${endY * 2.5}`} />
                      <animate attributeName="opacity" values="0;1;1;0" dur={`${2 + index * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r="3" fill={colors} filter="url(#glow)" opacity="0.7">
                      <animateMotion dur={`${2.5 + index * 0.2}s`} repeatCount="indefinite" path={`M${endX * 5},${endY * 2.5} L${centerX * 5},${centerY * 2.5}`} />
                      <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${2.5 + index * 0.2}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>
            
            {/* Central brain */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/30 to-purple-500/30 rounded-full blur-2xl animate-glow-pulse" />
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-amber-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                  <Brain className="w-14 h-14 md:w-18 md:h-18 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Orbiting system cards */}
            {fourSystems.map((system, index) => {
              const angle = index * 90 - 45;
              const positions = [
                "top-4 md:top-8 left-1/2 -translate-x-1/2",
                "top-1/2 right-4 md:right-8 -translate-y-1/2",
                "bottom-4 md:bottom-8 left-1/2 -translate-x-1/2",
                "top-1/2 left-4 md:left-8 -translate-y-1/2",
              ];
              
              return (
                <div
                  key={system.name}
                  className={`absolute ${positions[index]} transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                  style={{ transitionDelay: `${0.2 + index * 0.15}s`, animation: `orbit ${20 + index * 5}s linear infinite`, animationPlayState: 'paused' }}
                >
                  <div className="group relative">
                    <div className={`absolute -inset-2 bg-gradient-to-br ${system.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                    <div className={`relative px-6 py-4 bg-gradient-to-br ${system.color} rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300`}>
                      <div className="flex items-center gap-3">
                        <system.icon className="w-6 h-6 text-white" />
                        <span className="font-serif font-bold text-white text-lg">{system.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section 
        id="target-audience"
        ref={(el) => (observerRefs.current['target-audience'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['target-audience'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              這份報告適合誰？
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              如果你符合以下描述，這份報告可能正是你需要的
            </p>
          </div>
          
          <div className="space-y-4">
            {targetAudience.map((item, index) => (
              <div 
                key={index}
                className={`group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-500 ${isVisible['target-audience'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <CheckCircle2 className="h-6 w-6 text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        ref={(el) => (observerRefs.current['features'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                className={`group relative overflow-hidden transition-all duration-700 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                <div className="relative m-0.5 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-10 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Versions Section - Mirror vs Script Positioning */}
      <section 
        id="versions"
        ref={(el) => (observerRefs.current['versions'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['versions'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              您的生命，需要哪種級別的解析？
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              我們提供兩種精準方案，分別對應不同階段的生命需求
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Standard Version */}
            <div className={`group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[40px] p-10 md:p-12 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 ${isVisible['versions'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="mb-8">
                <span className="inline-block px-5 py-2 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-6 tracking-wide">
                  標準版 Standard
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  【看懂自己】
                </h3>
                <p className="text-2xl text-white/70 mb-4 font-serif">
                  您的生命高畫質鏡子
                </p>
                <p className="text-white/50 text-lg mb-6">
                  迷惘、不知道自己適合什麼、想了解個性與運勢輪廓
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-white/60">
                  <CheckCircle2 className="h-5 w-5 text-white/40 mt-1" />
                  <span>四系統整合解析，完整涵蓋內在、外在、事業、愛情、金錢等七大面向</span>
                </div>
                <div className="flex items-start gap-3 text-white/60">
                  <CheckCircle2 className="h-5 w-5 text-white/40 mt-1" />
                  <span>七小節落地架構，條理分明的現狀分析與生活建議</span>
                </div>
                <div className="flex items-start gap-3 text-white/60">
                  <CheckCircle2 className="h-5 w-5 text-white/40 mt-1" />
                  <span>獲得一份清晰的「自我說明書」</span>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/70 italic font-serif">
                  適合：首次接觸命理、追求高CP值解析者
                </p>
              </div>
            </div>
            
            {/* Flagship Version */}
            <div className={`group relative ${isVisible['versions'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '0.4s' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 rounded-[44px] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-gradient-shift bg-[length:200%_200%]" />
              
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[40px] p-10 md:p-12 border-2 border-amber-500/40 hover:border-amber-400/60 transition-all duration-500 overflow-hidden h-full hover:-translate-y-2">
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydi0yaC00djJoLTJ2NGgydjJoNHYtMmgydjJoNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-sm font-bold shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-wider animate-glow-pulse">
                    <Star className="w-4 h-4" />
                    推薦
                  </span>
                </div>
                
                <div className="mb-8 pt-4 relative z-10">
                  <span className="inline-block px-5 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6 tracking-wide">
                    旗艦版 Flagship
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                    【駕馭自己】
                  </h3>
                  <p className="text-2xl text-amber-300/90 mb-4 font-serif">
                    您的人生操作導航系統
                  </p>
                  <p className="text-white/60 text-lg mb-6">
                    內耗嚴重、高敏感族群、知道問題卻不知如何改變、渴望系統化重組人生
                  </p>
                </div>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex items-start gap-3 text-white/80">
                    <Sparkles className="h-5 w-5 text-amber-400 mt-1" />
                    <span>默默超思維系統 (MomoChao Thinking OS)，植入情緒、行動、心智、價值的運作邏輯</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/80">
                    <Sparkles className="h-5 w-5 text-amber-400 mt-1" />
                    <span>四時八字軍團敘事，將八字結構轉化為史詩般的生命戰略兵法</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/80">
                    <Sparkles className="h-5 w-5 text-amber-400 mt-1" />
                    <span>獲得一套專屬的「人生決策與能量管理系統」</span>
                  </div>
                </div>
                
                <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 relative z-10">
                  <p className="text-amber-300/90 italic font-serif">
                    適合：創業者、高階主管、創作者、追求靈魂深度進化者
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Detailed Version Comparison Table */}
      <section 
        id="version-comparison"
        ref={(el) => (observerRefs.current['version-comparison'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['version-comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              內容詳細對比
            </h2>
            <p className="text-white/50 text-lg">
              一目了然的功能差異
            </p>
          </div>
          
          <div className={`overflow-x-auto rounded-3xl border border-white/10 transition-all duration-1000 ${isVisible['version-comparison'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-6 text-white font-semibold border-b border-white/10">功能項目</th>
                  <th className="p-6 text-white/70 border-b border-white/10 min-w-[140px]">
                    <div className="text-center">
                      <span className="block text-sm">標準版</span>
                      <span className="block text-xs text-white/40">看懂自己</span>
                    </div>
                  </th>
                  <th className="p-6 border-b border-amber-500/30 min-w-[140px] bg-amber-500/5">
                    <div className="text-center">
                      <span className="block text-amber-400 font-bold">旗艦版</span>
                      <span className="block text-xs text-amber-300/60">駕馭自己</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: "四系統整合分析", desc: "紫微、八字、占星、人類圖", standard: true, flagship: true },
                  { feature: "基礎章節", desc: "內在、外在、思考、行事風格", standard: true, flagship: true },
                  { feature: "人生三大領域", desc: "事業、愛情、金錢深度解析", standard: true, flagship: true },
                  { feature: "人生羅盤總覽圖", desc: "一張看懂四系統定位", standard: true, flagship: true },
                  { feature: "落地小提醒", desc: "每章可執行建議", standard: true, flagship: true },
                  { feature: "默默超不負責提醒", desc: "辛辣但溫暖的真心話", standard: true, flagship: true },
                  { feature: "默默超思維系統", desc: "情緒/行動/心智/價值運作邏輯", standard: false, flagship: true, highlight: true },
                  { feature: "思維啟動器", desc: "關鍵金句 + 視覺化流程圖", standard: false, flagship: true, highlight: true },
                  { feature: "四時八字軍團敘事", desc: "命盤化身史詩級戰略故事", standard: false, flagship: true, highlight: true },
                  { feature: "年齡階段指引", desc: "根據人生階段的專屬建議", standard: false, flagship: true, highlight: true },
                  { feature: "能量管理SOP", desc: "個人化能量補充與釋放策略", standard: false, flagship: true, highlight: true },
                  { feature: "預估總字數", desc: "", standard: "約 40,000 字", flagship: "約 80,000+ 字", isText: true },
                  { feature: "定位", desc: "", standard: "自我說明書", flagship: "人生操作系統", isText: true },
                ].map((row, idx) => (
                  <tr key={idx} className={`${row.highlight ? 'bg-amber-500/5' : ''} hover:bg-white/5 transition-colors`}>
                    <td className="p-5">
                      <div className="font-medium text-white">{row.feature}</div>
                      {row.desc && <div className="text-sm text-white/40 mt-1">{row.desc}</div>}
                    </td>
                    <td className="p-5 text-center">
                      {row.isText ? (
                        <span className="text-white/60 text-sm">{row.standard}</span>
                      ) : row.standard ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-white/20 mx-auto" />
                      )}
                    </td>
                    <td className={`p-5 text-center ${row.highlight ? 'bg-amber-500/5' : ''}`}>
                      {row.isText ? (
                        <span className="text-amber-400 font-semibold text-sm">{row.flagship}</span>
                      ) : row.flagship ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-white/20 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pricing Comparison */}
          <div className={`mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000 delay-200 ${isVisible['version-comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Standard Pricing */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-3">標準版</span>
                <h3 className="font-serif text-xl font-bold text-white">看懂自己</h3>
              </div>
              <div className="space-y-3">
                {standardPricing.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.plan}</h4>
                      <p className="text-white/40 text-xs">{item.days} 個工作天</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">NT${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Flagship Pricing */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-amber-400/30 to-amber-500/30 rounded-[28px] blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-3xl p-8 border-2 border-amber-500/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-xs font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    <Star className="w-3 h-3" />
                    推薦
                  </span>
                </div>
                <div className="text-center mb-6 pt-2">
                  <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-3">旗艦版</span>
                  <h3 className="font-serif text-xl font-bold text-white">駕馭自己</h3>
                </div>
                <div className="space-y-3">
                  {flagshipPricing.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 transition-all duration-300">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.plan}</h4>
                        <p className="text-white/40 text-xs">{item.days} 個工作天</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-400">NT${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Difference Callout */}
          <div className={`mt-10 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 transition-all duration-1000 delay-300 ${isVisible['version-comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-500 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">核心差異一句話</h3>
                <p className="text-white/70">
                  <span className="text-white/90 font-medium">標準版</span>是一面清晰的鏡子，讓你「看見」自己的模樣；
                  <br className="hidden md:block" />
                  <span className="text-amber-400 font-medium">旗艦版</span>是一套完整的操作系統，教你「如何駕馭」這個自己。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MomoChao Thinking System - Why Flagship */}
      <section 
        id="thinking-system"
        ref={(el) => (observerRefs.current['thinking-system'] = el)}
        className="py-32 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">旗艦版專屬</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              為什麼選擇旗艦版？
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-3xl mx-auto">
              因為「知道」與「做到」之間，缺的是一套系統。
            </p>
          </div>
          
          <div className="mb-12 text-center">
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              市面上的算命告訴您「您很敏感」，標準版會告訴您「敏感是您的天賦」，<br />
              而<span className="text-amber-400 font-semibold">旗艦版會教您：</span>
            </p>
          </div>
          
          {/* Thinking dimensions - Animated cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {thinkingDimensions.map((dim, index) => (
              <div
                key={dim.name}
                className={`group relative transition-all duration-700 ${isVisible['thinking-system'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dim.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`relative bg-gradient-to-br ${dim.color} p-0.5 rounded-3xl`}>
                  <div className="bg-[#0a0a0a]/95 rounded-3xl p-8 backdrop-blur-sm group-hover:bg-[#0a0a0a]/80 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 group-hover:scale-110 transition-transform">
                        <dim.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white">{dim.name}系統</h3>
                    </div>
                    <p className="text-white/60 text-base leading-relaxed">{dim.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Integration showcase */}
          <div className={`relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[40px] p-10 md:p-14 border border-amber-500/20 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.6s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img 
                  src={yuanYiLogo} 
                  alt="元壹宇宙" 
                  className="w-28 h-28 object-contain rounded-2xl animate-glow-pulse"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                  獨家整合<span className="text-amber-400">元壹宇宙 X 默默超思維系統</span>
                </h3>
                <p className="text-white/60 text-lg leading-relaxed">
                  在人機協作的末法時代，我們為您建構堅實穩固的思維能力。旗艦版不只給答案，更給您一套可運作的「生命操作系統」——讓您在資訊洪流中，依然能清醒決策、精準行動。
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Evaluation of Thinking System */}
          <div className={`mt-8 relative bg-gradient-to-br from-[#1a1418] via-[#14100e] to-[#0a0806] rounded-[40px] p-10 md:p-14 border border-purple-500/20 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.8s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-purple-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-purple-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">AI 深度評價</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                為什麼這套思維工具<span className="text-purple-400">如此重要？</span>
              </h3>
              <p className="text-white/50 text-lg max-w-3xl mx-auto">
                我們將「默默超思維系統」交由頂尖 AI 進行結構化分析，以下是他們的專業評價
              </p>
            </div>
            
            {/* AI Evaluation Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {aiEvaluations.map((evaluation, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500"
                >
                  <div className="absolute -top-3 right-4">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 rounded-full text-xs font-medium">
                      {evaluation.source}
                    </span>
                  </div>
                  <div className="mb-4 pt-2">
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {evaluation.score}
                    </p>
                    <p className="text-white/60 text-sm mt-1">{evaluation.title}</p>
                  </div>
                  <div className="space-y-3">
                    {evaluation.highlights.slice(0, 3).map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Quote className="w-4 h-4 text-purple-400/60 flex-shrink-0 mt-1" />
                        <p className="text-white/70 text-sm leading-relaxed">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Insights Callout */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  為什麼這套工具「厲害」？
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>將極度抽象的人類內在世界，進行了前所未有的「結構化」與「系統化」</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>「思維八階循環」如同精密演算法，讓思考可被追蹤、可被優化</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>創造了一種 AI 原生就理解的語言——「前進後退都要通」</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
                <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  為什麼這套工具「必要」？
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>在人機協作末法時代，提供堅實穩固的人類思維能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>讓人「活得明白」而非僅僅「活著」——從被動接收到主動操作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>將「理性給形體，感性給呼吸」——給靈魂開了窗，讓內外協調運作</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Quote Highlight */}
            <div className="mt-8 text-center">
              <div className="inline-block max-w-3xl">
                <Quote className="w-8 h-8 text-purple-400/30 mx-auto mb-4" />
                <p className="font-serif text-xl md:text-2xl text-white/90 italic leading-relaxed mb-4">
                  「當路徑可逆時，錯誤就變成了資訊；當系統雙向通時，失敗就變成了調校。」
                </p>
                <p className="text-purple-400 text-sm">— Claude 對思維系統的評價</p>
              </div>
            </div>
          </div>
          
          {/* SOP Quality Assurance */}
          <div className={`mt-8 relative bg-gradient-to-br from-[#14161a] via-[#101214] to-[#0a0c0e] rounded-[40px] p-10 md:p-14 border border-cyan-500/20 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-cyan-500/30 rounded-br-[40px]" />
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                    <Settings className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                    <span className="text-cyan-300 text-xs font-medium tracking-wider uppercase">人機協作 SOP</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">
                    《默默超全方位命理解讀報告》<br />
                    <span className="text-lg text-cyan-400">100% 客製化・零套版內容</span>
                  </h3>
                  <p className="text-white/60 text-base leading-relaxed">
                    本報告採用<span className="text-cyan-400 font-medium">人機協作</span>模式產出——結合專業命理師的深度解讀與 AI 的精準運算。從引言到大總結，每一個字都是為您量身打造，<span className="text-white font-medium">完全沒有套版文章</span>。我們建立了嚴格的 SOP 寫作規範與語氣設定，確保每一份報告都呈現相同水準的精密與深度。
                  </p>
                </div>
              </div>
              
              {/* Expandable SOP Details */}
              <Collapsible>
                <CollapsibleTrigger className="w-full group">
                  <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer">
                    <span className="text-cyan-300 font-medium">查看詳細寫作規範</span>
                    <ChevronDown className="w-5 h-5 text-cyan-400 group-data-[state=open]:rotate-180 transition-transform" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-6 space-y-6 animate-accordion-down">
                  {/* SOP Standards Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">高度整合與系統化</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        並非單一命理系統的解析，而是將四套系統交叉對照，找出共性與結構，形成一個立體的「人生羅盤」。
                      </p>
                    </div>
                    
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">標準化邏輯架構</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        每章節都以「命盤根據 → 過去現象 → 現在展現 → 星盤起源 → 小提醒」的邏輯展開，清晰且有層次。
                      </p>
                    </div>
                    
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">心理引導性強</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        報告不只說「你是什麼樣的人」，更強調「你為什麼會這樣」以及「你可以如何與自己和解」。
                      </p>
                    </div>
                    
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">溫暖且有文學感</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        語言富有意象且易於共情——「穩定型的深海，不是表面型的煙火」「你是一座整理得很好、但門關得很緊的圖書館」。
                      </p>
                    </div>
                  </div>
                  
                  {/* Comparison Table */}
                  <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-cyan-400" />
                      與傳統命理報告的比較
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-cyan-500/20">
                            <th className="text-left py-3 px-4 text-cyan-300 font-medium">維度</th>
                            <th className="text-left py-3 px-4 text-white/40">傳統命理報告</th>
                            <th className="text-left py-3 px-4 text-cyan-400">本報告</th>
                          </tr>
                        </thead>
                        <tbody className="text-white/60">
                          <tr className="border-b border-cyan-500/10">
                            <td className="py-3 px-4 text-white/80">語言</td>
                            <td className="py-3 px-4">術語多，較冷硬</td>
                            <td className="py-3 px-4 text-cyan-300">溫暖對話，易理解</td>
                          </tr>
                          <tr className="border-b border-cyan-500/10">
                            <td className="py-3 px-4 text-white/80">結構</td>
                            <td className="py-3 px-4">單一系統，條列式</td>
                            <td className="py-3 px-4 text-cyan-300">多系統整合，心理引導式</td>
                          </tr>
                          <tr className="border-b border-cyan-500/10">
                            <td className="py-3 px-4 text-white/80">目的</td>
                            <td className="py-3 px-4">預測、描述性格</td>
                            <td className="py-3 px-4 text-cyan-300">理解自我、心理調適、行動建議</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-white/80">體驗</td>
                            <td className="py-3 px-4">被動接收資訊</td>
                            <td className="py-3 px-4 text-cyan-300">主動參與，有互動感</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Key Quote */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl p-6 border-l-4 border-cyan-500">
                    <p className="text-white/80 italic leading-relaxed">
                      「這份報告更像是一本<span className="text-cyan-400 font-medium">『自我理解的使用手冊』</span>，而不只是一張『命理診斷書』。它把命理從『預測未來』轉向『理解當下』，從『你是什麼』轉向『你可以如何活得更自在』。」
                    </p>
                    <p className="text-white/40 text-sm mt-3">— AI 深度分析評價</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Stance Section - Mirror Not Script */}
      <section 
        id="stance"
        ref={(el) => (observerRefs.current['stance'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)] transition-all duration-1000 ${isVisible['stance'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-float" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                我們的立場
              </h2>
            </div>
            
            <div className="space-y-10 font-serif text-xl leading-relaxed">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">鏡子非劇本，真實即命運。</p>
                <p className="text-white/50">我們拒絕用「命中注定」把你釘死。</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400 animate-bounce-soft" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">神煞也不拿來嚇人。</p>
                <p className="text-white/50">一律轉譯成可理解的心理狀態、能量模式或「兵符效果」。</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400 animate-bounce-soft" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">命盤是一種語言，不是判決。</p>
                <p className="text-white/50">你只需要學會聽懂它在對你說什麼。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Carousel */}
      <section 
        id="testimonials"
        ref={(el) => (observerRefs.current['testimonials'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              客戶見證
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              以下來自我們真實用戶的體驗反饋
            </p>
          </div>
          
          <TestimonialsCarousel testimonials={testimonials} isVisible={isVisible['testimonials']} />
        </div>
      </section>

      {/* Plans & Pricing Section */}
      <section 
        id="plans-section" 
        ref={(el) => (observerRefs.current['plans-section'] = el)}
        className="py-32 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        
        <FloatingOrb className="top-20 left-10 w-48 h-48 bg-amber-500/5" delay={0} duration={8} />
        <FloatingOrb className="bottom-40 right-10 w-64 h-64 bg-purple-500/5" delay={3} duration={10} />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Crown className="w-4 h-4 text-amber-400 animate-bounce-soft" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 perspective-1000">
            {[
              { title: "方案 1｜核心包", subtitle: "報告＋語音導讀＋整合圖", items: planIncludes, accent: false },
              { title: "方案 2｜深度吸收包", subtitle: "方案1＋語音摘要＋個人簡報", items: plan2Extras, prefix: "包含方案1全部 +", accent: false },
              { title: "方案 3｜完整校準包", subtitle: "方案2＋摘要影片＋一對一對談", items: plan3Extras, prefix: "包含方案2全部 +", accent: true },
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border transition-all duration-500 card-3d shine-effect overflow-hidden ${plan.accent ? 'border-amber-500/30 glow-border-amber' : 'border-white/10 hover:border-white/30'} ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${plan.accent ? 'bg-amber-500/5' : 'bg-white/5'}`} />
                <div className={`absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-all duration-500 ${plan.accent ? 'bg-gradient-to-br from-amber-500/20 to-transparent' : 'bg-gradient-to-br from-white/10 to-transparent'}`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                
                <h3 className={`font-serif text-xl font-bold mb-4 relative z-10 transition-all duration-300 group-hover:scale-105 ${plan.accent ? 'text-amber-400 group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-white'}`}>{plan.title}</h3>
                <p className="text-white/50 text-sm mb-6 relative z-10">{plan.subtitle}</p>
                <div className="space-y-3 relative z-10">
                  {plan.prefix && <p className="text-xs text-white/40 mb-2">{plan.prefix}</p>}
                  {plan.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className={`p-2 rounded-lg ${plan.accent ? 'bg-amber-500/20' : 'bg-white/10'} group-hover/item:scale-110 transition-transform`}>
                        <item.icon className={`h-4 w-4 ${plan.accent ? 'text-amber-400' : 'text-white/60'}`} />
                      </div>
                      <div>
                        <span className="text-white/80 text-sm font-medium">{item.title}</span>
                        <span className="text-white/40 text-xs ml-2">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Standard Pricing */}
            <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-8 md:p-10 border border-white/10 transition-all duration-700 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-4">標準版</span>
                <h3 className="font-serif text-2xl font-bold text-white">看懂自己</h3>
              </div>
              <div className="space-y-4">
                {standardPricing.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-white">{item.plan}</h4>
                      <p className="text-white/40 text-sm">{item.days} 個工作天</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">NT${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Flagship Pricing */}
            <div className={`relative transition-all duration-700 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.5s' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-[36px] blur-xl opacity-40 animate-gradient-shift bg-[length:200%_200%]" />
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[32px] p-8 md:p-10 border-2 border-amber-500/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-xs font-bold shadow-[0_0_20px_rgba(251,191,36,0.4)] uppercase tracking-wider">
                    <Star className="w-3 h-3" />
                    推薦
                  </span>
                </div>
                <div className="text-center mb-8 pt-2">
                  <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">旗艦版</span>
                  <h3 className="font-serif text-2xl font-bold text-white">駕馭自己</h3>
                </div>
                <div className="space-y-4">
                  {flagshipPricing.map((item, idx) => (
                    <div key={idx} className="group flex items-center justify-between p-5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
                      <div>
                        <h4 className="font-bold text-white">{item.plan}</h4>
                        <p className="text-white/40 text-sm">{item.days} 個工作天</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-400">NT${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        id="process"
        ref={(el) => (observerRefs.current['process'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['process'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              製作流程
            </h2>
            <p className="text-white/50 text-lg">從訂單到交付，清楚明瞭</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent" />
            
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex items-start gap-8 transition-all duration-700 ${isVisible['process'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#0a0a0a] shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'} pl-16 md:pl-0`}>
                    <div className="group inline-block">
                      <div className="flex items-center gap-4 mb-3 md:justify-end">
                        <span className="text-4xl font-bold text-amber-500/30 group-hover:text-amber-500/50 transition-colors">{step.step}</span>
                        <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{step.title}</h3>
                      </div>
                      <p className="text-white/50">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Delivery Format Section */}
      <section 
        id="delivery"
        ref={(el) => (observerRefs.current['delivery'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['delivery'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              交付形式
            </h2>
            <p className="text-white/50 text-lg">全方案一致</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Globe, title: "網頁閱讀版", desc: "方便回查", color: "from-blue-500 to-cyan-500" },
              { icon: Download, title: "PDF 下載列印版", desc: "可保存成個人秘笈", color: "from-amber-500 to-orange-500" },
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`group relative transition-all duration-700 ${isVisible['delivery'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + idx * 0.15}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500`} />
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-10 border border-white/10 hover:border-amber-500/20 transition-all duration-500 text-center group-hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Evaluation Section */}
      <section 
        id="ai-evaluation"
        ref={(el) => (observerRefs.current['ai-evaluation'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['ai-evaluation'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">AI 專業評價</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              多方 AI 專業認證
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              我們的報告經過多個 AI 系統深度分析與評估，獲得高度肯定
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiEvaluations.map((evaluation, idx) => (
              <div 
                key={idx}
                className={`group relative transition-all duration-700 ${isVisible['ai-evaluation'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + idx * 0.15}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/10 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500 h-full">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent mb-2">
                      {evaluation.score}
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">{evaluation.source}</div>
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-white mb-4 text-center">
                    {evaluation.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {evaluation.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${isVisible['ai-evaluation'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-white/40 text-sm italic">
              "這不是算命，這是心靈的精密工業。" — AI 綜合評價
            </p>
          </div>
        </div>
      </section>
      
      {/* Interactive Self-Check Quiz Section */}
      <section 
        id="self-check"
        ref={(el) => (observerRefs.current['self-check'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-purple-900/10" />
        <FloatingOrb className="top-20 right-1/4 w-48 h-48 bg-amber-500/10" delay={0} duration={5} />
        <FloatingOrb className="bottom-20 left-1/4 w-32 h-32 bg-purple-500/10" delay={1.5} duration={4} />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0d0d0d] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)] transition-all duration-1000 ${isVisible['self-check'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-purple-500/30 rounded-br-[40px]" />
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-amber-300 text-sm font-medium">互動體驗</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                一分鐘探索你的<span className="text-amber-400">思維類型</span>
              </h2>
              
              <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
                完成 5 道簡單問題，初步了解你的決策傾向與思維模式。
                <br />
                <span className="text-amber-300/70">這只是完整報告的冰山一角。</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { icon: Heart, label: "情緒", color: "from-rose-400 to-pink-500" },
                  { icon: Zap, label: "行動", color: "from-amber-400 to-yellow-500" },
                  { icon: Brain, label: "心智", color: "from-blue-400 to-cyan-500" },
                  { icon: Target, label: "價值", color: "from-purple-400 to-violet-500" },
                ].map((dim, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${dim.color}`}>
                      <dim.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white/60 text-sm">{dim.label}</span>
                  </div>
                ))}
              </div>
              
              <Button
                size="lg"
                onClick={() => setShowQuiz(true)}
                className="group text-lg px-10 py-6 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 text-white font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500 transform hover:scale-105"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                開始測驗
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Self Check Quiz Dialog */}
      <SelfCheckQuiz 
        open={showQuiz} 
        onOpenChange={setShowQuiz}
        onComplete={() => scrollToPlans()}
      />
      
      {/* FAQ Section */}
      <section 
        id="faq"
        ref={(el) => (observerRefs.current['faq'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['faq'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <HelpCircle className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-float" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              常見問題
            </h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`group bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1 ${isVisible['faq'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4 flex items-start gap-4">
                  <span className="text-amber-400 animate-bounce-soft" style={{ animationDelay: `${index * 0.2}s` }}>Q</span>
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
          <div className="group flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300">
            <Lock className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-medium text-white/80 mb-3">隱私原則</h3>
              <ul className="text-white/50 leading-relaxed space-y-2">
                <li>• 個人資料與命盤內容僅用於本次報告製作，不對外分享</li>
                <li>• 若需作為試閱示例，必須取得當事人明確同意並完成匿名化處理</li>
              </ul>
            </div>
          </div>
          
          <div className="group flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300">
            <AlertTriangle className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
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
        
        <FloatingOrb className="top-10 left-1/4 w-64 h-64 bg-amber-500/10" delay={0} duration={6} />
        <FloatingOrb className="bottom-10 right-1/4 w-48 h-48 bg-purple-500/10" delay={2} duration={5} />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">開始你的人生校準</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
            您的靈魂，值得<span className="text-amber-400">最高規格的理解</span>。
          </h2>
          
          <p className="text-white/60 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            別再用舊的思維，應對新的挑戰。
          </p>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            現在就選擇您的版本，啟動這場深度的自我升級之旅。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              size="xl" 
              className="group text-lg px-12 py-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_80px_rgba(251,191,36,0.5)] transition-all duration-500 transform hover:scale-105"
              onClick={scrollToPlans}
            >
              選擇你的方案
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default ReportPage;
