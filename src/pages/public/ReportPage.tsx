import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle2,
  FileText,
  Sparkles,
  Shield,
  ArrowRight,
  Compass,
  Layers,
  Globe,
  Crown,
  Gem,
  Star,
  Brain,
  Zap,
  Target,
  Heart,
  Eye,
  ChevronDown,
  Scale,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import ReportPreview from "@/components/public/ReportPreview";
import LifeCompassForm from "@/components/public/LifeCompassForm";
import { useSEO } from "@/hooks/useSEO";

// Four systems data
const fourSystems = [
  {
    name: "紫微斗數",
    icon: Star,
    color: "from-violet-500 to-purple-600",
    meaning: "命宮格局",
    description: "你的先天人格結構與一生運勢走向，靈魂的藍圖設計。",
  },
  {
    name: "八字",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    meaning: "五行能量",
    description: "你的能量組成與流動模式，事業、財運、感情的時空週期。",
  },
  {
    name: "占星",
    icon: Compass,
    color: "from-blue-500 to-cyan-600",
    meaning: "星盤配置",
    description: "透過行星相位與宮位，映照你的心理動態、關係模式與人生課題。",
  },
  {
    name: "人類圖",
    icon: Brain,
    color: "from-emerald-500 to-teal-600",
    meaning: "能量類型",
    description: "你的決策權威與能量運作方式，最適合你的行動策略。",
  },
];

// FAQ data (v4.0)
const faqs = [
  {
    q: "共振版跟偏勝版有什麼不同？",
    a: "共振版找四系統說同一件事的地方，幫你看見完整的自己。偏勝版找四系統互相打架的地方，幫你看見你以為的自己哪裡跟結構對不上。一份讓你被理解，一份讓你被校準。",
  },
  {
    q: "一定要兩份都買嗎？",
    a: "不用。兩份都可以獨立購買。如果你從來沒做過四系統整合，共振版是很好的起點。如果你已經對自己有一定認識，想知道哪裡可能有盲區，偏勝版可以直接切入。",
  },
  {
    q: "我不懂命理也能看懂嗎？",
    a: "可以。報告會把命盤語言轉成「你在生活裡看得到的現象」與「你做得到的建議」，不需要任何命理基礎。",
  },
  {
    q: "你會不會寫得很玄，或很像算命？",
    a: "不會。核心是「鏡子，不是劇本」。拒絕預言式結論，只呈現可驗證的模式與可執行的建議。",
  },
  {
    q: "跟傳統算命有什麼不同？",
    a: "傳統算命告訴你「會發生什麼」，我們告訴你「你是如何運作的」。這是使用說明書，不是預言書。",
  },
  {
    q: "跟心理諮商有什麼不同？",
    a: "心理諮商處理的是你的真實困擾與情緒，由專業心理師透過長期對話陪伴。我們的報告處理的是你的命盤結構——從出生資料推導你的運作模式，輸出一份可以帶走反覆翻看的書面報告。兩者不互斥，可以互補。",
  },
  {
    q: "報告裡的描述真的準嗎？",
    a: "報告裡的描述來自四系統交叉驗證後的結構推導，不是我們猜的。但它描述的是「這個結構配置的人傾向怎麼運作」，不是「我們觀察過你本人」。最終的驗證權在你自己——讀到覺得中的地方，拿去對照你的現實。",
  },
  {
    q: "多久可以收到報告？",
    a: "共振版個人報告 12-18 個工作天，偏勝版 10-15 個工作天。合盤報告 10-15 個工作天。每份都是人工逐字寫的，不套模板。",
  },
  {
    q: "合盤報告是什麼？需要什麼前提？",
    a: "兩個人（或三個人）的命盤交叉比對。有感情合盤、商業合盤、親子合盤三種。不是算配不配——是把你們之間的結構攤出來，哪裡共振、哪裡碰撞、怎麼配最省力。前提：主要測算人須先完成個人共振版報告。",
  },
];

// 共振版 chapters
const resonanceChapters = [
  { ch: "基本資料", desc: "四系統命盤資料總覽" },
  { ch: "人生羅盤", desc: "四系統各自怎麼看你——優勢、盲點、建議，一張表收齊" },
  { ch: "你是誰", desc: "你的核心性格結構，四系統交叉驗證" },
  { ch: "你怎麼運作", desc: "你的思考方式、行動模式、能量節奏" },
  { ch: "人生三大領域", desc: "事業、愛情、金錢——同一套內在機制的不同呈現" },
  { ch: "特別注意", desc: "你最容易忽略的盲區" },
  { ch: "結語", desc: "把整份報告收成你可以帶走的核心訊息" },
  { ch: "思維工具箱", desc: "六步 OS、八階思維循環、回家地圖——教你自己拆解問題" },
  { ch: "四時軍團秘笈", desc: "你的八字化身 RPG 軍團——用故事讓你記住自己的結構" },
  { ch: "默默超大總結", desc: "一刀見血的核心觀察＋三領域各一刀＋一句你會帶走的話" },
];

// 偏勝版 chapters
const biasChapters = [
  { ch: "四張不同的臉", desc: "四系統各自怎麼描述你——讓你看見它們說的不是同一個人" },
  { ch: "偏勝羅盤", desc: "偏勝偵測矩陣——哪些維度四系統一致、哪些在打架" },
  { ch: "你以為的自己", desc: "你的自我描述，有多少是結構支持的？有多少只是慣性說法？" },
  { ch: "你沒發現的劇本", desc: "三層校準（情緒→語言→結構）——找出偏勝背後的深層信念" },
  { ch: "用錯版本的自己", desc: "事業、愛情、金錢——偏勝在三個領域的具體呈現" },
  { ch: "腦中的迴圈", desc: "十大思維病毒＋環境層病毒掃描" },
  { ch: "地基穩嗎", desc: "偏勝是單一偏差還是整個信念系統的問題" },
  { ch: "軍團裡的叛將", desc: "偏勝的那個系統在你軍團裡扮演什麼角色——它不是壞人" },
  { ch: "默默超大總結", desc: "核心偏勝＋三領域拆穿＋一句你會帶走的話" },
];

const ReportPage = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [heroVisible, setHeroVisible] = useState(false);
  const observerRefs = useRef<{ [key: string]: Element | null }>({});
  const heroRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: "歸覓｜人生羅盤定位系統 | 共振版・偏勝版・感情合盤・商業合盤・親子合盤",
    description: "四系統交叉驗證命理報告。共振版幫你看見完整的自己，偏勝版幫你看見認知偏差。100% 客製化，不套模板，不預測命運。",
    keywords: "歸覓, 命理報告, 紫微斗數, 八字, 占星, 人類圖, 合盤, 感情合盤, 商業合盤, 親子合盤, 默默超, 共振版, 偏勝版, 人生羅盤",
    ogTitle: "歸覓｜人生羅盤定位系統 - 兩種視角，一個你",
  });

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setHeroVisible(true);
      },
      { threshold: 0.3 }
    );
    if (heroRef.current) heroObserver.observe(heroRef.current);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <PublicHeader />

      {/* ═══ Hero Section ═══ */}
      <section className="relative py-32 md:py-40 lg:py-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent animate-breathe" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full animate-rotate-slow opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div ref={heroRef} className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 mb-6 animate-fade-in backdrop-blur-sm">
            <Crown className="w-4 h-4 text-amber-400 animate-bounce-soft" />
            <span className="text-amber-300 text-sm font-medium tracking-wider">Rainbow Sanctuary × 歸覓｜人生羅盤定位系統</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          {/* Title */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 -top-10 blur-3xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 rounded-full animate-pulse" />
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 tracking-tight leading-none relative animate-scale-in" style={{ animationDuration: '0.8s' }}>
              <span
                className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]"
                style={{ filter: 'drop-shadow(0 0 40px rgba(251,191,36,0.5))' }}
              >
                歸覓
              </span>
            </h1>
            <h2
              className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/95 tracking-wide animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              人生羅盤定位系統
            </h2>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>

          {/* Description */}
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.5s' }}>
            <span className="text-white/90">看見自己的結構，是所有</span>
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">改變的起點。</span>
          </p>
          <p className="text-lg md:text-xl text-white/60 mb-10 animate-slide-up font-light tracking-wide max-w-3xl mx-auto" style={{ animationDelay: '0.7s' }}>
            紫微斗數 × 八字命理 × 西洋占星 × 人類圖<br className="hidden md:block" />
            四系統同時上桌，交叉驗證。不預測未來，不給標籤。<br className="hidden md:block" />
            你拿到的不是一個答案，是一份可以反覆翻看的<span className="text-amber-400">結構地圖</span>。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 justify-center animate-slide-up px-2" style={{ animationDelay: '0.9s' }}>
            <ReportPreview />
            <LifeCompassForm />
          </div>
        </div>
      </section>

      {/* ═══ 區塊 1: 雙產品線介紹 ═══ */}
      <section
        id="dual-products"
        ref={(el) => (observerRefs.current['dual-products'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['dual-products'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              兩份報告，兩種視角
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              同一份命盤資料，兩種完全不同的閱讀方式。<br />
              共振版找四系統說同一件事的地方——幫你看見完整的自己。<br />
              偏勝版找四系統互相打架的地方——幫你看見你以為的自己哪裡跟結構對不上。<br />
              兩份都可以獨立購買。
            </p>
          </div>

          {/* Dual Product Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-200 ${isVisible['dual-products'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* 共振版 */}
            <div className="group relative bg-gradient-to-br from-amber-900/30 to-amber-950/30 rounded-2xl p-6 md:p-8 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-500">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Resonance</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-1">歸覓全方位共振解讀報告</h3>
              <p className="text-amber-300/70 text-sm mb-4">讓你看見完整的自己，學會使用自己</p>
              <div className="space-y-2.5 text-sm text-white/60">
                <p><span className="text-white/80 font-medium">四系統怎麼用：</span>找四系統交集——它們同時說的才進報告</p>
                <p><span className="text-white/80 font-medium">正文語氣：</span>像深夜居酒屋裡最懂你的朋友</p>
                <p><span className="text-white/80 font-medium">不負責提醒：</span>朋友突然放下酒杯，眼神清醒戳你一刀</p>
                <p><span className="text-white/80 font-medium">讀完的感覺：</span>被看見、被理解</p>
                <p><span className="text-white/80 font-medium">適合誰：</span>想認識自己、需要方向感</p>
              </div>
              <p className="text-white/30 text-xs mt-4">10 章＋默默超大總結・約 10,000-13,000 字</p>
            </div>

            {/* 偏勝版 */}
            <div className="group relative bg-gradient-to-br from-purple-900/30 to-purple-950/30 rounded-2xl p-6 md:p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Bias Detection</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-1">歸覓全方位偏勝解讀報告</h3>
              <p className="text-purple-300/70 text-sm mb-4">讓你看見認知偏差，學會校正自己</p>
              <div className="space-y-2.5 text-sm text-white/60">
                <p><span className="text-white/80 font-medium">四系統怎麼用：</span>找四系統歧異——它們互相打架的地方才是重點</p>
                <p><span className="text-white/80 font-medium">正文語氣：</span>全篇都在拆你</p>
                <p><span className="text-white/80 font-medium">不負責提醒：</span>拆完之後安靜看著你說「我知道這不好受」</p>
                <p><span className="text-white/80 font-medium">讀完的感覺：</span>被看穿、被戳破</p>
                <p><span className="text-white/80 font-medium">適合誰：</span>已有自我認知但可能陷入盲區</p>
              </div>
              <p className="text-white/30 text-xs mt-4">8 章＋默默超大總結・約 8,000-10,000 字</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 區塊 2: 共振版章節概覽 ═══ */}
      <section
        id="resonance-chapters"
        ref={(el) => (observerRefs.current['resonance-chapters'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-10 transition-all duration-1000 ${isVisible['resonance-chapters'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400 mb-4">
              共振版｜你是誰，你怎麼運作
            </h2>
            <p className="text-white/50 text-base max-w-2xl mx-auto">
              當紫微、八字、占星、人類圖四套系統同時指向同一件事，那件事就是你的底層結構。<br />
              共振版的任務是把這些交集整合成一份你讀得懂、拿得走的生命地圖。
            </p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-1000 delay-200 ${isVisible['resonance-chapters'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {resonanceChapters.map((item) => (
              <div key={item.ch} className="bg-white/5 rounded-xl px-4 py-3 border border-white/10 hover:border-amber-500/30 transition-colors">
                <span className="text-amber-400 font-medium text-sm">{item.ch}</span>
                <p className="text-white/50 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 區塊 3: 偏勝版章節概覽 ═══ */}
      <section
        id="bias-chapters"
        ref={(el) => (observerRefs.current['bias-chapters'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-10 transition-all duration-1000 ${isVisible['bias-chapters'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-purple-400 mb-4">
              偏勝版｜你以為的自己，哪些是真的
            </h2>
            <p className="text-white/50 text-base max-w-2xl mx-auto">
              四套系統不會每次都說同一件事。當它們互相矛盾，那個矛盾就是你需要注意的地方。<br />
              偏勝版的任務是把這些歧異找出來，拆解你的自我敘事，告訴你哪些是結構、哪些是藉口。
            </p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-1000 delay-200 ${isVisible['bias-chapters'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {biasChapters.map((item) => (
              <div key={item.ch} className="bg-white/5 rounded-xl px-4 py-3 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                <span className="text-purple-400 font-medium text-sm">{item.ch}</span>
                <p className="text-white/50 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 區塊 4: 跟一般服務有什麼不同 ═══ */}
      <section
        id="comparison"
        ref={(el) => (observerRefs.current['comparison'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">市場定位</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              這不是算命，也不是<span className="text-amber-400">心理諮商</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              市面命理告訴你你是誰、你會怎樣。心理諮商陪你找到自己。<br />
              我們做的是第三件事：把四套結構壓成一張你可以反覆對照、自己驗證、拿去用的生命結構地圖。
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ${isVisible['comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* 一般命理服務 */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-white/10 rounded-full">
                <span className="text-white/60 text-sm font-medium">一般命理服務</span>
              </div>
              <div className="pt-4 space-y-4 text-sm text-white/60">
                <div><span className="text-white/80 font-medium">做什麼：</span>回答問題、預測運勢</div>
                <div><span className="text-white/80 font-medium">方法：</span>單系統解讀</div>
                <div><span className="text-white/80 font-medium">當系統打架：</span>忽略或硬圓</div>
                <div><span className="text-white/80 font-medium">給你什麼：</span>口頭解讀或短報告</div>
                <div><span className="text-white/80 font-medium">你的角色：</span>被動聽</div>
                <div><span className="text-white/80 font-medium">建議：</span>「多溝通」「適合創業」</div>
                <div><span className="text-white/80 font-medium">用多久：</span>看一次就結束</div>
              </div>
            </div>

            {/* 心理諮商 */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-white/10 rounded-full">
                <span className="text-white/60 text-sm font-medium">心理諮商</span>
              </div>
              <div className="pt-4 space-y-4 text-sm text-white/60">
                <div><span className="text-white/80 font-medium">做什麼：</span>陪你處理困擾</div>
                <div><span className="text-white/80 font-medium">方法：</span>對話、探索、引導</div>
                <div><span className="text-white/80 font-medium">當系統打架：</span>不適用</div>
                <div><span className="text-white/80 font-medium">給你什麼：</span>過程體驗</div>
                <div><span className="text-white/80 font-medium">你的角色：</span>主動探索</div>
                <div><span className="text-white/80 font-medium">建議：</span>過程中慢慢浮現</div>
                <div><span className="text-white/80 font-medium">用多久：</span>長期諮商關係</div>
              </div>
            </div>

            {/* 歸覓 */}
            <div className="relative bg-gradient-to-br from-amber-900/20 to-[#0d0d0d] rounded-3xl p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full">
                <span className="text-black text-sm font-bold">歸覓｜人生羅盤定位系統</span>
              </div>
              <div className="pt-4 space-y-4 text-sm text-white/60">
                <div><span className="text-amber-300 font-medium">做什麼：</span>把結構攤開，你自己決定怎麼用</div>
                <div><span className="text-amber-300 font-medium">方法：</span>四系統強制交叉驗證</div>
                <div><span className="text-amber-300 font-medium">當系統打架：</span>矛盾是訊號——偏勝偵測矩陣</div>
                <div><span className="text-amber-300 font-medium">給你什麼：</span>8-13 千字結構化書面報告</div>
                <div><span className="text-amber-300 font-medium">你的角色：</span>自己對照、驗證、使用</div>
                <div><span className="text-amber-300 font-medium">建議：</span>每章 1-3 步具體可執行操作＋思維工具箱</div>
                <div><span className="text-amber-300 font-medium">用多久：</span>可反覆翻看的長期操作手冊</div>
              </div>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-400 ${isVisible['comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-white/30 text-xs max-w-2xl mx-auto">
              本報告為命理結構整合分析，不是心理治療、醫療建議或未來預測。閱讀過程中若觸發強烈情緒，建議搭配合格心理專業一起處理。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 區塊 5: 四大命理系統說明 ═══ */}
      <section
        id="four-systems"
        ref={(el) => (observerRefs.current['four-systems'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              四大系統<span className="text-amber-400">交叉整合</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              避免單一系統的偏誤，多維度驗證你的生命藍圖
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourSystems.map((system, index) => (
              <div
                key={system.name}
                className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 text-center ${isVisible['four-systems'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${system.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <system.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-1">{system.name}</h3>
                <p className="text-amber-400 text-sm mb-3">{system.meaning}</p>
                <p className="text-white/50 text-sm">{system.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 區塊 6: FAQ ═══ */}
      <section
        id="faq"
        ref={(el) => (observerRefs.current['faq'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['faq'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              常見問題
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className="w-full group">
                  <div className={`flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/[0.07] transition-all duration-300 text-left min-h-[52px] ${isVisible['faq'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 0.05}s` }}>
                    <span className="text-white/90 font-medium text-base">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-amber-400/60 flex-shrink-0 group-data-[state=open]:rotate-180 transition-transform" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 pb-4 pt-2 animate-accordion-down">
                  <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ReportPage;
