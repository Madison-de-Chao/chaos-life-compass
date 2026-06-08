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
  ChevronRight,
  Scale,
  Tag,
  ShieldCheck,
  BookOpen,
  MessageCircle,
  Calendar,
  Send,
} from "lucide-react";
import linePoster from "@/assets/guimi-line-poster.jpg";
import { useEffect, useRef, useState } from "react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
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
    q: "為什麼偏勝版要先有共振版才能加購？",
    a: "偏勝版整本只做一件事：拆「你以為的自己」跟「結構裡的自己」對不上的地方。如果你手上沒有一張獨立的底圖，拆解的標準會跟被拆的版本是同一個東西，你只能選擇信或不信。共振版就是那張底圖，先有它，偏勝版那一刀才砍得進去。",
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
    a: "正常交件時間約 7–14 個工作天。每份都是人工逐字寫的，不套模板。",
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
  { ch: "偏勝羅盤", desc: "哪些維度四系統一致、哪些在打架" },
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
          <div className="flex justify-center animate-slide-up px-2" style={{ animationDelay: '0.9s' }}>
            <a
              href="#reader-guide"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('reader-guide')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center justify-center gap-2 min-h-[52px] px-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-base sm:text-lg shadow-[0_0_40px_rgba(251,191,36,0.3)] active:scale-95 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              體驗羅盤及導讀
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 推廣曲影片 ═══ */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-amber-900/5 to-[#0a0a0a]" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <p className="text-amber-400/70 text-sm tracking-widest uppercase mb-2">♪ 推廣曲</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white/90">
              《最好的閨蜜（總能讀懂你）》
            </h2>
            <p className="text-white/40 text-sm mt-2">歸覓人生羅盤定位系統推廣曲</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_60px_rgba(251,191,36,0.1)]">
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-video bg-black"
            >
              <source src="/videos/guimi-promo.mp4" type="video/mp4" />
              您的瀏覽器不支援影片播放，請<a href="/videos/guimi-promo.mp4" className="text-amber-400 underline">點此下載</a>。
            </video>
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
              <span className="text-amber-300/80">兩份報告都附「六七八人生避險基金」一對一課程。</span>
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

      {/* ═══ 六七八一對一課程 ═══ */}
      <section
        id="course-678"
        ref={(el) => (observerRefs.current['course-678'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-amber-950/10 to-[#0a0a0a]" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-10 transition-all duration-1000 ${isVisible['course-678'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">每個方案都含</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              「六七八」<span className="text-amber-400">一對一課程</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              報告告訴你「你是誰」。六七八教你「拿到結構之後，下一個決定怎麼做」。
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 transition-all duration-1000 delay-200 ${isVisible['course-678'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/5 rounded-2xl p-6 border border-amber-500/20">
              <p className="text-amber-400 font-bold text-lg mb-2">六個想法</p>
              <p className="text-white/50 text-xs mb-3">往內看：我手上有什麼？</p>
              <p className="text-white/70 text-sm leading-relaxed">定義、拆詞、切分、測試、比較、驗收</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-amber-500/20">
              <p className="text-amber-400 font-bold text-lg mb-2">七個問題</p>
              <p className="text-white/50 text-xs mb-3">往外找：我漏了什麼？</p>
              <p className="text-white/70 text-sm leading-relaxed">性質、變數、人員、動機、經驗、反面、價值</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-amber-500/20">
              <p className="text-amber-400 font-bold text-lg mb-2">八階循環</p>
              <p className="text-white/50 text-xs mb-3">往前走</p>
              <p className="text-white/70 text-sm leading-relaxed">怎麼做完一個完整的決定？</p>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-amber-900/15 to-transparent rounded-2xl p-6 md:p-8 border border-amber-500/20 transition-all duration-1000 delay-400 ${isVisible['course-678'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
              舉個例子：報告會告訴你「你容易在壓力下逃避」。六七八是當你下個月真的卡在「要不要離職」時，有一套流程逼你問出——我逃避的是這份工作，還是這份工作背後那件更難面對的事？是制度問題，還是只是心情問題？
            </p>
            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-amber-300 font-medium text-sm mb-2">為什麼叫「避險基金」</p>
              <p className="text-white/60 text-sm leading-relaxed">
                人生最大的浪費不是做錯事，是花三個月做一件從頭到尾就不該做的事。你每用一次六七八避掉一個「答錯題」的風險，就存了一筆。長期下來，決策品質複利成長。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 方案與費用 ═══ */}
      <section
        id="pricing"
        ref={(el) => (observerRefs.current['pricing'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Tag className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">方案與費用</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              選一個適合你的<span className="text-amber-400">方案</span>
            </h2>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-1000 delay-200 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* 共振版方案 */}
            <div className="bg-gradient-to-br from-amber-900/20 to-[#0d0d0d] rounded-3xl p-7 border border-amber-500/30 flex flex-col">
              <p className="text-amber-400 text-xs font-medium uppercase tracking-wider mb-2">入門首選</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">共振版方案</h3>
              <p className="text-white/60 text-sm mb-5 flex-1">共振版報告 ＋ 六七八一對一課程</p>
              <div className="mb-2">
                <span className="text-4xl font-bold text-amber-400">NT$1,990</span>
              </div>
            </div>

            {/* 雙版完整方案 */}
            <div className="relative bg-gradient-to-br from-amber-500/20 to-amber-900/30 rounded-3xl p-7 border-2 border-amber-400/60 shadow-[0_0_60px_rgba(251,191,36,0.2)] flex flex-col md:-translate-y-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                <span className="text-black text-xs font-bold">最推薦・現省 100</span>
              </div>
              <p className="text-amber-300 text-xs font-medium uppercase tracking-wider mb-2 mt-2">完整體驗</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">雙版完整方案</h3>
              <p className="text-white/70 text-sm mb-5 flex-1">共振版 ＋ 偏勝版 ＋ 六七八一對一課程<br /><span className="text-white/50">（一次買齊現省 100）</span></p>
              <div className="mb-2">
                <span className="text-4xl font-bold text-amber-300">NT$3,480</span>
              </div>
            </div>

            {/* 偏勝版加購 */}
            <div className="bg-gradient-to-br from-purple-900/20 to-[#0d0d0d] rounded-3xl p-7 border border-purple-500/30 flex flex-col">
              <p className="text-purple-400 text-xs font-medium uppercase tracking-wider mb-2">已購共振版者</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">偏勝版加購</h3>
              <p className="text-white/60 text-sm mb-5 flex-1">單獨加購偏勝版報告</p>
              <div className="mb-2">
                <span className="text-4xl font-bold text-purple-400">NT$1,590</span>
              </div>
            </div>
          </div>

          <div className={`mt-8 bg-white/5 rounded-2xl p-6 border border-white/10 transition-all duration-1000 delay-400 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-amber-300 font-medium text-sm mb-3">購買說明</p>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>• 偏勝版採加購制，需先擁有共振版。</li>
              <li>• 六七八一對一課程隨第一份報告附贈一次；雙版方案同樣含一次課程。</li>
              <li>• 想一次擁有兩版，選「雙版完整方案」最划算——比先買共振版再加購偏勝版省 100 元。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ 只想直接買偏勝版？ ═══ */}
      <section
        id="bias-only"
        ref={(el) => (observerRefs.current['bias-only'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className={`bg-gradient-to-br from-purple-900/15 to-[#0d0d0d] rounded-3xl p-8 md:p-12 border border-purple-500/20 transition-all duration-1000 ${isVisible['bias-only'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              只想直接買<span className="text-purple-400">偏勝版</span>？
            </h2>
            <p className="text-purple-300/80 text-sm mb-6">可以，但先聽一句。</p>
            <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed">
              <p>偏勝版整本只做一件事：找出你「以為的自己」跟「結構裡的自己」對不上的地方。它每一句拆解，都是拿你的自我描述去對結構。</p>
              <p className="text-white/90 font-medium">問題是——你拿什麼當「結構」那一邊？</p>
              <p>如果你對自己的認識，是這些年自己跟自己講出來的版本，那偏勝版拆的，跟你用來驗證它的，會是同一個東西。你會覺得每一條都能反駁，因為你手上沒有一張獨立的底圖可以對照。</p>
              <p>共振版就是那張底圖。它先把四系統都同意的部分攤開給你看——那是你的地基，不是你講給自己聽的故事。有了它，當偏勝版說「你以為你是 A，其實你是 B」，你能自己翻回去查，而不是只能選擇信或不信。</p>
              <p className="text-amber-300">而「我已經很了解自己了」這句話本身，剛好就是偏勝版第一刀要拆的東西。</p>
              <p className="text-white/90 font-medium">所以不是不賣你偏勝版。是先給你共振版，你那一刀才砍得進去。</p>
            </div>
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
                <div><span className="text-amber-300 font-medium">當系統打架：</span>矛盾是訊號——標出偏勝維度</div>
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

      {/* ═══ 報告導讀（體驗版） ═══ */}
      <section
        id="reader-guide"
        ref={(el) => (observerRefs.current['reader-guide'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">報告導讀（體驗版）</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              不是試讀別人的報告，是教你<span className="text-amber-400">怎麼讀你自己的</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              下面把報告裡每張表的每一格攤開，告訴你這格寫什麼、為什麼有它、你該怎麼用。<br />
              表格內的範例文字標示為「示範」，只是讓你看清楚格式長相，<span className="text-amber-300">不是任何真人的解讀</span>。
            </p>
          </div>

          {/* 為什麼是「四系統一起上」 */}
          <div className={`mb-16 bg-gradient-to-br from-[#141414] to-[#0d0d0d] rounded-3xl p-6 md:p-8 border border-white/10 transition-all duration-1000 delay-100 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-amber-400 text-xs font-medium uppercase tracking-wider mb-3">先懂一件事</p>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">為什麼是「四系統一起上」</h3>
            <div className="space-y-3 text-white/65 text-sm md:text-base leading-relaxed">
              <p>市面上多數命理是一套系統講到底。歸覓的做法不一樣——紫微、八字、占星、人類圖四套同時看同一個你。</p>
              <p>
                四套<span className="text-amber-300">說同一件事</span>的地方，就是你穩定的底層結構（<span className="text-amber-300">共振版</span>在做的）。<br />
                四套<span className="text-purple-300">互相矛盾</span>的地方，就是你最該注意的訊號（<span className="text-purple-300">偏勝版</span>在做的）。
              </p>
              <p>所以你讀報告時，永遠在做兩個動作：看四套「一起說了什麼」、看四套「在哪裡吵架」。下面每張表都是為這兩個動作設計的。</p>
            </div>
          </div>

          {/* ── 共振版怎麼讀 ── */}
          <div className={`mb-8 transition-all duration-1000 delay-150 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
              <span className="font-serif text-2xl md:text-3xl font-bold text-amber-300">共振版怎麼讀</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
            </div>
          </div>

          <div className={`space-y-12 transition-all duration-1000 delay-200 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* 表 1 */}
            <div className="bg-gradient-to-br from-amber-900/10 to-[#0d0d0d] rounded-3xl p-6 md:p-8 border border-amber-500/20">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">共振版 · 表 1</span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">四系統基本資料表</h3>
              </div>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mb-5">
                這是報告開頭的資料總覽。它不解讀，只是把你的四張命盤核心資料擺在一起，讓你知道後面所有分析的「原料」是什麼。
              </p>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[560px] text-sm border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-amber-500/10">
                    <tr className="text-amber-200">
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">系統</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">核心資料</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">重點摘要</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      ['紫微斗數', '（示範）命宮主星、身宮、四化', '（示範）一句話點出這張盤的主調'],
                      ['八字命理', '四柱、日主、格局、身強弱', '摘要'],
                      ['西洋占星', '日月升、主要相位', '摘要'],
                      ['人類圖', '類型、權威、角色、定義', '摘要'],
                    ].map((row, i) => (
                      <tr key={i} className="odd:bg-white/[0.02]">
                        <td className="px-3 py-3 border-b border-white/5 text-white/85 font-medium whitespace-nowrap">{row[0]}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/65">{row[1]}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <p className="text-amber-300 text-sm font-medium mb-2">逐格怎麼看</p>
                <ul className="space-y-2 text-white/60 text-sm leading-relaxed list-disc list-outside pl-5">
                  <li><span className="text-white/85 font-medium">系統</span>：哪一套命理。四套各佔一列，這就是「四系統一起上桌」的字面意思。</li>
                  <li><span className="text-white/85 font-medium">核心資料</span>：這套系統對你最關鍵的幾個技術參數。你不需要看懂每個術語，這格的用途是讓你（或任何懂行的人）能回頭查證——後面的解讀都從這裡長出來，不是憑空講的。</li>
                  <li><span className="text-white/85 font-medium">重點摘要</span>：把那串術語翻成一句人話。讀報告時先掃這一欄，抓到四套各自的主調，再往下讀細節。</li>
                </ul>
              </div>
              <p className="mt-4 text-white/55 text-sm leading-relaxed">
                <span className="text-amber-300 font-medium">怎麼用：</span>這張表是你的「對照基準」。後面任何一章講到某個結論，你都可以翻回這張表，確認它是從哪個系統的哪個資料來的。
              </p>
            </div>

            {/* 表 2 */}
            <div className="bg-gradient-to-br from-amber-900/15 to-[#0d0d0d] rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.08)]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium">共振版 · 表 2 核心</span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">人生羅盤</h3>
              </div>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mb-5">
                這是共振版最重要的一張表。它把四系統並排，每一套都回答同樣四個問題：你的主軸、你的優勢、你的盲點、給你的建議。
              </p>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[720px] text-sm border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-amber-500/10">
                    <tr className="text-amber-200">
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">系統</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">主軸設定</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">優勢亮點</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">盲點＆挑戰</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">建議關鍵</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      ['紫微斗數', '（示範）核心人格結構', '（示範）你天生擅長的', '（示範）你容易卡住的', '（示範）一個具體調整方向'],
                      ['八字命理', '日主＋格局＋身強弱', '正向特質', '潛在陷阱', '具體建議'],
                      ['西洋占星', '行星＋星座＋宮位', '正向特質', '潛在陷阱', '具體建議'],
                      ['人類圖', '類型/權威＋通道', '正向特質', '潛在陷阱', '具體建議'],
                    ].map((row, i) => (
                      <tr key={i} className="odd:bg-white/[0.02]">
                        <td className="px-3 py-3 border-b border-white/5 text-white/85 font-medium whitespace-nowrap">{row[0]}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{row[1]}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{row[2]}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{row[3]}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <p className="text-amber-300 text-sm font-medium mb-2">逐格怎麼看</p>
                <ul className="space-y-2 text-white/60 text-sm leading-relaxed list-disc list-outside pl-5">
                  <li><span className="text-white/85 font-medium">主軸設定</span>：這套系統認為你這個人的核心設定是什麼。四列讀下來，你會發現四套描述的角度不同——這是正常的，它們本來就從不同維度看你。</li>
                  <li><span className="text-white/85 font-medium">優勢亮點</span>：這套系統看到的你的長處。</li>
                  <li><span className="text-white/85 font-medium">盲點＆挑戰</span>：這套系統看到的你容易跌倒的地方。優勢和盲點常常是同一個特質的兩面，對照著看最有感。</li>
                  <li><span className="text-white/85 font-medium">建議關鍵</span>：針對這套系統看到的盲點，給一個具體可做的方向。</li>
                </ul>
              </div>
              <div className="mt-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                <p className="text-amber-300 text-sm font-medium mb-2">怎麼用（這是這張表的關鍵讀法）：直著讀，再橫著讀。</p>
                <p className="text-white/65 text-sm leading-relaxed">
                  <span className="text-white/85">直著讀</span>，先把四套各自的主軸看完，知道每套怎麼看你。<br />
                  <span className="text-white/85">橫著讀</span>，把四套的「盲點」欄並排——如果四套不約而同指向同一個盲點，那就是你最該處理的；如果只有一套提到，先放著觀察。四套一起指的地方，份量最重。
                </p>
                <p className="text-white/50 text-xs leading-relaxed mt-3">
                  表格下方會有一句「四系統共振指向」，把這張表收成一個結論。那句話是這張表的總結，但自己先讀懂表，再看那句結論，你才有能力判斷它對不對。
                </p>
              </div>
            </div>
          </div>

          {/* ── 偏勝版怎麼讀 ── */}
          <div className={`mt-16 mb-8 transition-all duration-1000 delay-300 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/40" />
              <span className="font-serif text-2xl md:text-3xl font-bold text-purple-300">偏勝版怎麼讀</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/40" />
            </div>
          </div>

          <div className={`space-y-12 transition-all duration-1000 delay-300 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* 表 3 */}
            <div className="bg-gradient-to-br from-purple-900/10 to-[#0d0d0d] rounded-3xl p-6 md:p-8 border border-purple-500/20">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium">偏勝版 · 表 3</span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">四張不同的臉（對照表）</h3>
              </div>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mb-5">
                偏勝版開場就丟給你這張表。它的任務只有一個：讓你親眼看到，四套系統描述的你，<span className="text-purple-300">不是同一個人</span>。
              </p>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[720px] text-sm border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-purple-500/10">
                    <tr className="text-purple-200">
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">特質維度</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">紫微說</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">八字說</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">占星說</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">人類圖說</th>
                      <th className="px-3 py-3 text-center font-medium border-b border-white/10">一致？</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      { dim: '內在性格', mark: '○', color: 'text-emerald-300' },
                      { dim: '行動模式', mark: '✗', color: 'text-rose-300' },
                      { dim: '情感需求', mark: '✗', color: 'text-rose-300' },
                      { dim: '決策方式', mark: '△', color: 'text-amber-300' },
                    ].map((row, i) => (
                      <tr key={i} className="odd:bg-white/[0.02]">
                        <td className="px-3 py-3 border-b border-white/5 text-white/85 font-medium whitespace-nowrap">{row.dim}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{i === 0 ? '（示範）描述' : '描述'}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">描述</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">描述</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">描述</td>
                        <td className={`px-3 py-3 border-b border-white/5 text-center font-bold ${row.color}`}>{row.mark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-white/45 text-xs mt-3 leading-relaxed">
                <span className="text-emerald-300">○ 四系統一致</span>　
                <span className="text-amber-300">△ 部分歧異</span>　
                <span className="text-rose-300">✗ 顯著打架</span>
              </p>
              <div className="mt-5">
                <p className="text-purple-300 text-sm font-medium mb-2">逐格怎麼看</p>
                <ul className="space-y-2 text-white/60 text-sm leading-relaxed list-disc list-outside pl-5">
                  <li><span className="text-white/85 font-medium">特質維度</span>：把「你」拆成幾個面向分開檢查——性格、怎麼行動、要什麼、怎麼決定。一次只比一個面向，才看得出哪裡對不上。</li>
                  <li><span className="text-white/85 font-medium">中間四欄（紫微說／八字說／占星說／人類圖說）</span>：同一個面向，四套各自怎麼描述。重點不是看懂每一格的術語，是橫著比——這一行四格講的，是同一個人嗎？</li>
                  <li><span className="text-white/85 font-medium">一致？</span>：這一行四套的判斷有沒有對上。○ 是四套說法相近，△ 是部分對不上，✗ 是明顯打架。</li>
                </ul>
              </div>
              <div className="mt-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4">
                <p className="text-purple-300 text-sm font-medium mb-2">怎麼用：先找 ✗ 那幾行。</p>
                <p className="text-white/65 text-sm leading-relaxed">
                  ○ 那幾行是你穩定的部分，可以放心；<span className="text-rose-300">✗ 那幾行才是偏勝版整本要拆的</span>——四套在這裡吵架，代表你對自己這個面向的認知，很可能跟你的結構對不上。看到 ✗，先別急著反駁，那正是你要往下讀的地方。
                </p>
              </div>
            </div>

            {/* 表 4 */}
            <div className="bg-gradient-to-br from-purple-900/15 to-[#0d0d0d] rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium">偏勝版 · 表 4 核心</span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">偏勝地圖（欄位最多、最需要導讀）</h3>
              </div>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mb-5">
                上一張表告訴你「哪裡打架」，這張表告訴你「打架的細節，以及你慣性選了哪一邊」。欄位多，一格一格看。
              </p>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[840px] text-sm border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-purple-500/10">
                    <tr className="text-purple-200">
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">偏勝維度</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">偏勝類型</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">強度</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">多數系統說</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">偏勝系統說</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">你慣用的版本</th>
                      <th className="px-3 py-3 text-left font-medium border-b border-white/10">校正方向</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      { dim: '行動模式', type: '（示範）各自為政', stars: '★★★★' },
                      { dim: '決策方式', type: '二對二', stars: '★★★' },
                    ].map((row, i) => (
                      <tr key={i} className="odd:bg-white/[0.02]">
                        <td className="px-3 py-3 border-b border-white/5 text-white/85 font-medium whitespace-nowrap">{row.dim}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">{row.type}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-amber-300 whitespace-nowrap">{row.stars}</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">描述</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">描述</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">描述</td>
                        <td className="px-3 py-3 border-b border-white/5 text-white/55">校正建議</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <p className="text-purple-300 text-sm font-medium mb-2">逐格怎麼看</p>
                <ul className="space-y-2 text-white/60 text-sm leading-relaxed list-disc list-outside pl-5">
                  <li><span className="text-white/85 font-medium">偏勝維度</span>：哪個面向出現了偏勝（接續上一張表標 ✗ 的那些）。</li>
                  <li><span className="text-white/85 font-medium">偏勝類型</span>：四套怎麼分裂的。「三對一」是三套同調、一套唱反調；「二對二」是兩兩對峙；「各自為政」是四套都不一樣。分裂方式不同，意義不同——三對一通常是那唱反調的系統在提醒你一件被忽略的事，二對二則是你內在有兩股力量在拉扯。</li>
                  <li><span className="text-white/85 font-medium">強度</span>：這個偏勝有多明顯，星越多越該優先處理。讀報告時間有限的話，先看 ★★★★ 那幾行。</li>
                  <li><span className="text-white/85 font-medium">多數系統說</span>：人數較多那邊的描述——通常比較接近你「以為的自己」。</li>
                  <li><span className="text-white/85 font-medium">偏勝系統說</span>：唱反調那邊的描述——通常是你忽略、但其實也在運作的那一面。</li>
                  <li><span className="text-white/85 font-medium">你慣用的版本</span>：你日常實際活出來的，是上面兩個版本裡的哪一個。<span className="text-purple-300">這格是整張表的核心</span>——它要回答的不是「哪個版本對」，是「你習慣性選了哪個」。</li>
                  <li><span className="text-white/85 font-medium">校正方向</span>：知道自己慣性偏哪邊之後，可以怎麼調。</li>
                </ul>
              </div>
              <div className="mt-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4">
                <p className="text-purple-300 text-sm font-medium mb-2">怎麼用：把「多數系統說／偏勝系統說／你慣用的版本」三格並排看。</p>
                <ul className="space-y-2 text-white/65 text-sm leading-relaxed list-disc list-outside pl-5">
                  <li>如果你慣用的剛好是<span className="text-white/85">「多數系統」</span>那個版本——代表你跟著大多數結構走，偏勝系統提醒的那面被你長期忽略了。</li>
                  <li>如果你慣用的是<span className="text-white/85">「偏勝系統」</span>那個少數版本——代表你活在一個只有一套系統支持的自我認知裡，這通常是更深的盲區。</li>
                </ul>
                <p className="text-white/65 text-sm leading-relaxed mt-3">
                  不管哪種，<span className="text-amber-300">「校正方向」都不是要你換成另一個版本</span>，是要你知道：你一直只用其中一個，另一個其實也是你。
                </p>
              </div>
            </div>
          </div>

          {/* 讀完這份，你已經會的事 */}
          <div className={`mt-16 bg-gradient-to-br from-amber-900/15 via-[#0d0d0d] to-purple-900/15 rounded-3xl p-6 md:p-8 border border-white/10 transition-all duration-1000 delay-400 ${isVisible['reader-guide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">讀完這份，你已經會的事</h3>
            <ul className="space-y-3 text-white/70 text-sm md:text-base leading-relaxed list-disc list-outside pl-5">
              <li>知道報告為什麼四系統一起看，以及你該在哪裡找<span className="text-amber-300">「共振」</span>、哪裡找<span className="text-purple-300">「打架」</span>。</li>
              <li>拿到共振版時，會<span className="text-amber-300">直讀也會橫讀</span>人生羅盤，自己找出四套共指的盲點。</li>
              <li>拿到偏勝版時，會先看 <span className="text-rose-300">✗</span> 和 <span className="text-amber-300">★★★★</span>，知道哪裡最該處理，也看得懂「你慣用的版本」這格在問什麼。</li>
            </ul>
            <p className="mt-5 text-white/60 text-sm md:text-base leading-relaxed italic border-t border-white/10 pt-4">
              報告不是給你答案的，是給你一張你自己<span className="text-amber-300">對得了、查得了、用得上</span>的結構地圖。這份導讀，是先把「怎麼用這張地圖」教給你。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 訂購與預約方式（LINE） ═══ */}
      <section
        id="order-line"
        ref={(el) => (observerRefs.current['order-line'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-amber-950/10 to-[#0a0a0a]" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['order-line'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">訂購與預約方式</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              怎麼<span className="text-amber-400">開始</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
              加入虹靈御所官方 LINE，傳訊息預約報告。專人回覆確認交件日期與匯款資訊。
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-start transition-all duration-1000 delay-200 ${isVisible['order-line'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-5">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Send className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs font-medium uppercase tracking-wider mb-1">Step 1</p>
                    <h3 className="font-serif text-lg font-bold text-white mb-1">加入官方 LINE，傳訊預約</h3>
                    <p className="text-white/60 text-sm leading-relaxed">傳訊息告訴我們你想預約的方案，會有專人回覆確認可交件日期並提供匯款帳號。</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs font-medium uppercase tracking-wider mb-1">Step 2</p>
                    <h3 className="font-serif text-lg font-bold text-white mb-1">日期確認後，提供資料並匯款</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-2">日期確認後，再提供：</p>
                    <ul className="text-white/55 text-sm space-y-1 list-disc list-inside">
                      <li>姓名・出生年月日・出生時間・出生地點</li>
                      <li>最近想釐清的人生課題（選填）</li>
                      <li>匯款證明</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs font-medium uppercase tracking-wider mb-1">Step 3</p>
                    <h3 className="font-serif text-lg font-bold text-white mb-1">等待交件</h3>
                    <p className="text-white/60 text-sm leading-relaxed">正常交件時間約 7–14 個工作天。完成後將以 <span className="text-amber-300 font-medium">PDF 檔</span>交付，方便你長期收藏與離線閱讀。</p>
                  </div>
                </div>
              </div>

              <p className="text-white/40 text-xs leading-relaxed px-2">
                你提供的資料只用於製作你的報告，不外傳、不挪作他用。
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/20 via-[#0d0d0d] to-amber-900/15 rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)] text-center lg:sticky lg:top-24">
              <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider mb-3">官方 LINE</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">虹靈御所 × 歸覓</h3>
              <div className="rounded-2xl overflow-hidden border border-white/10 mb-5 bg-white">
                <img
                  src={linePoster}
                  alt="虹靈御所官方 LINE QR Code"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="mb-5">
                <p className="text-white/50 text-xs mb-1">LINE ID</p>
                <p className="font-mono text-2xl font-bold text-amber-300 tracking-wider">@momochao</p>
              </div>
              <a
                href="https://line.me/R/ti/p/@momochao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-base min-h-[52px] active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
              >
                <MessageCircle className="w-5 h-5" />
                加入官方 LINE
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-white/40 text-xs mt-4">點擊上方按鈕或掃描 QR Code 加入</p>
            </div>
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

          {/* 聯絡方式 + 免責聲明 */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* 聯絡方式 */}
              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-serif text-base font-bold text-white">聯絡與預約</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-white/45 text-xs uppercase tracking-wider">官方 LINE</span>
                    <a
                      href="https://line.me/R/ti/p/@momochao"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-amber-300 hover:text-amber-200 break-all min-h-[32px] inline-flex items-center"
                    >
                      @momochao
                    </a>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-white/45 text-xs uppercase tracking-wider">品牌</span>
                    <span className="text-white/70">虹靈御所 × 歸覓</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-white/45 text-xs uppercase tracking-wider">交件</span>
                    <span className="text-white/70">約 7–14 個工作天</span>
                  </li>
                </ul>
                <a
                  href="https://line.me/R/ti/p/@momochao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-sm font-medium min-h-[44px] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  加入官方 LINE 預約
                </a>
              </div>

              {/* 隱私與資料使用 */}
              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h3 className="font-serif text-base font-bold text-white">資料使用與隱私</h3>
                </div>
                <ul className="space-y-2 text-white/55 text-sm leading-relaxed list-disc list-outside pl-5">
                  <li>提供的出生資料僅用於製作你的個人報告，不外傳、不挪作他用。</li>
                  <li>報告以 PDF 檔交付，方便長期保存與離線閱讀。</li>
                  <li>若需刪除留存資料，請於 LINE 私訊告知，我們將協助處理。</li>
                </ul>
              </div>
            </div>

            {/* 免責聲明 */}
            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.08]">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 text-center">免責聲明 Disclaimer</p>
              <ul className="text-white/45 text-xs md:text-sm leading-relaxed space-y-2 max-w-2xl mx-auto list-disc list-outside pl-5">
                <li>本報告為命理結構整合分析，<span className="text-white/70">不是</span>心理治療、醫療建議、法律建議、財務建議或未來預測。</li>
                <li>內容僅供自我探索與覺察參考，不取代任何專業意見；重大人生決策請審慎評估，必要時諮詢相關領域專業人士。</li>
                <li>本服務不提供「保證準確」或「保證結果」的承諾，亦不販售任何宿命論或宗教式預言。</li>
                <li>未經授權，請勿轉載、改作或公開散布報告內容。</li>
              </ul>
              <p className="text-white/30 text-xs text-center mt-5">
                © {new Date().getFullYear()} 虹靈御所 × 歸覓・人生羅盤定位系統．All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ReportPage;
