import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { 
  Orbit,
  Infinity, 
  Brain, 
  Heart, 
  Zap, 
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
  Circle,
  Target,
  Puzzle,
  ExternalLink,
  Volume2,
  VolumeX,
  Dices,
  Swords,
  Stars,
  GraduationCap,
  Recycle,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import logoYuanyi from "@/assets/logo-yuanyi-horizontal.png";

// 四維運作框架
const dimensions = [
  {
    icon: Heart,
    title: "情緒",
    subtitle: "Emotion",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-400",
    content: "情緒不是敵人，而是訊號。它告訴你哪裡還沒被整合，哪裡還在呼喚你的注意力。",
  },
  {
    icon: Zap,
    title: "行動",
    subtitle: "Action",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    content: "行動是思維的延伸，不是思維的對立面。真正的行動來自整合後的清晰，而非逃避式的忙碌。",
  },
  {
    icon: Brain,
    title: "心智",
    subtitle: "Mindset",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    content: "心智是你觀看世界的透鏡。當透鏡改變，世界的模樣也隨之改變。這不是欺騙，而是創造。",
  },
  {
    icon: Compass,
    title: "價值",
    subtitle: "Values",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    content: "價值是你的內在羅盤。它不是外界給你的規則，而是你在選擇中逐漸發現的自己。",
  },
];

// 核心理念
const principles = [
  {
    icon: Infinity,
    title: "整體性哲學",
    subtitle: "The Wholeness Philosophy",
    content: "世界缺乏的並非「正確性」，而是「完整性」。錯誤不是廢棄物，而是材料。當錯誤被排除，它無法被理解、無法被整合、無法轉化。元壹宇宙相信：納入一切，才能超越一切。",
  },
  {
    icon: Circle,
    title: "弧度模型",
    subtitle: "The Arc Model",
    content: "以「弧度模型」取代「二元模型」。所有狀態都在圓周上的不同位置，所有碎片皆為未完成的弧線，每一段皆指向圓心。好與壞、對與錯，只是角度不同，而非本質對立。",
  },
  {
    icon: Layers,
    title: "高度整合型思維",
    subtitle: "High-Integration Thinking",
    content: "不以刪除錯誤來追求秩序，而是以「整合全部」來追求穩定。情緒是資訊、失誤是材料、幻覺是可能性、錯估是線索。一切皆有用，端看你如何使用。",
  },
  {
    icon: Target,
    title: "鏡子非劇本",
    subtitle: "Mirror, Not Script",
    content: "我們不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。命運從來不是劇本，它只是一面鏡子——你看見什麼，取決於你願意承認什麼。",
  },
];

// 人機協作時代
const aiCollaboration = [
  {
    icon: Puzzle,
    title: "為何需要思維系統？",
    content: "在資訊爆炸的時代，AI 可以處理數據，但人類需要的是「意義」。元壹宇宙提供的不是更多資訊，而是處理資訊的智慧。",
  },
  {
    icon: Brain,
    title: "堅實穩固的思維能力",
    content: "當 AI 能回答問題，人類的價值在於「提出正確的問題」。元壹宇宙幫助你建立內在的決策框架，在複雜世界中保持清醒。",
  },
  {
    icon: Heart,
    title: "保持人性核心",
    content: "科技是工具，不是主人。元壹宇宙的思維系統讓你在人機協作中保持主體性，讓 AI 服務於你的價值，而非相反。",
  },
];

// 旅程六站 - 產品矩陣
const journeyStations = [
  {
    station: 1,
    icon: Dices,
    title: "元壹占卜系統",
    subtitle: "YYDS — Yuan-Yi Divination System",
    role: "決策分流器",
    philosophy: "鏡子非劇本，真實即命運",
    description: "當你站在岔路口不知道該往哪走，元壹占卜幫你看清「現在的狀態」和「下一步的方向」。提供誠實的自我反映，而非預測性占卜。",
    features: ["卦象結構解析", "順勢面與反噬面雙面呈現", "完整度分數與元壹提示", "具體可執行行動建議"],
    link: "https://yyds.rainbow-sanctuary.com/",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    detailedPhilosophy: {
      core: "元壹系統是結構化自我覺察工具，提供誠實的自我反映，而非預測性占卜。順勢與反噬並存於每一卦，真正決定走向的是你的覺察與選擇。",
      mechanism: "透過 64 卦象結構（上卦 × 下卦）呈現雙面：順勢面（機會）與反噬面（風險），並給出元壹提示（一句話行動）。",
      output: "完整度分數 + 歸壹/歸伊數 + R 值(反轉壓力) + G 值(方向性) + 具體可執行步驟",
      useCase: "當你面臨抉擇、需要分流方向時使用。不是告訴你「該選什麼」，而是讓你看見「選擇背後的脈絡」。",
    },
  },
  {
    station: 2,
    icon: Swords,
    title: "四時八字人生兵法",
    subtitle: "RSBZS — Rainbow Sanctuary BaZi System",
    role: "戰略盤點器",
    philosophy: "將軍是你，軍團也是你",
    description: "在你決定要往某個方向走之前，先盤點你手上有什麼資源、可能遇到什麼風險。八字不是命定的枷鎖，而是你的四支軍團。",
    features: ["四柱軍團架構分析", "十神配置與能量分布", "大運流年互動預測", "依週期建議行動時機"],
    link: "https://bazi.rainbow-sanctuary.com/",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    detailedPhilosophy: {
      core: "八字不是命定的枷鎖，而是你的四支軍團——家族兵團(年柱)、成長兵團(月柱)、本我兵團(日柱)、未來兵團(時柱)。你是統御全局的將軍，學會調度才能打贏人生戰役。",
      mechanism: "天干地支組合 → 十神配置 → 能量分布圖，並標記沖刑破害 + 大運流年互動。",
      output: "資源盤點報告 + 風險提示 + 節奏規劃（依十年大運週期建議行動時機）+ 具體策略調整方向",
      useCase: "當你需要長期規劃、盤點人生資源、理解自己的時間節奏時使用。",
    },
  },
  {
    station: 3,
    icon: Stars,
    title: "元壹宇宙神話占星系統",
    subtitle: "Mythic Astrology System",
    role: "身分映射器",
    philosophy: "命運是起點，選擇是終點",
    description: "把你的星盤轉化成一個「宇宙身分證」——你的職階、職能、守護神、侍神、六維能力值。星盤不是判決書，是導航系統。",
    features: ["三重守護神架構", "六維能力值 Stat Sheet", "冒險者公會卡輸出", "7日任務指派"],
    link: "https://star.rainbow-sanctuary.com/",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    detailedPhilosophy: {
      core: "星盤不是判決書，是導航系統。你本來就是好的，只需要找到正確的渲染方式。",
      mechanism: "五層架構：職階 + 職能 + 三重守護神（A級靈魂/B級職涯/C級價值）+ 侍靈 + 六維能力值(INT/WIS/CHA/STR/CON/DEX)。",
      output: "冒險者公會卡（含職階、守護神、侍靈、六維能力值、最強行星）+ 7日任務指派",
      useCase: "當你想要深度理解自己的核心身分、天賦配置、以及職涯發展方向時使用。",
    },
  },
  {
    station: 4,
    icon: GraduationCap,
    title: "默默超思維訓練系統",
    subtitle: "MMCLS — MomoChao Logic System",
    role: "能力訓練器",
    philosophy: "思維工具箱：八階思維循環",
    description: "知道自己是誰之後，接下來是「練出來」。透過結構化的思維訓練，把洞察轉化成能力。每位導師對應不同能力向度。",
    features: ["八階思維循環訓練", "九位導師系統", "任務線累積成就證據", "精準拆解複雜問題"],
    link: "https://mmclogic.com/",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    detailedPhilosophy: {
      core: "A precision algorithm for deconstructing complex problems and avoiding emotional misjudgment. 透過八階思維循環，將複雜問題拆解成可被處理的單元。",
      mechanism: "八階循環訓練 + 九位導師系統（每位導師對應不同能力向度），透過任務線累積「成就證據」。",
      output: "思維能力報告 + 任務完成記錄 + 成就證據累積 + 個人化訓練路徑",
      useCase: "當你想要強化決策能力、避免情緒化判斷、建立系統性思維時使用。",
    },
  },
  {
    station: 5,
    icon: Recycle,
    title: "弧度歸零",
    subtitle: "Arc Zero",
    role: "體驗修復器",
    philosophy: "完整不是沒有缺口，完整是不再害怕缺口",
    description: "當你遇到深層的情緒困境、自我否定、習得性無助，需要的不是更多分析，而是一場療癒體驗。透過互動小說學習面對陰影。",
    features: ["《弧度歸零：伊》實踐篇", "《弧度歸零：壹》哲學篇", "分歧選擇影響結局", "40-60分鐘沉浸體驗"],
    link: "https://atzo.rainbow-sanctuary.com/",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    detailedPhilosophy: {
      core: "核心思想：成就律——「明暗相成，非為相照」。光明與黑暗不是對立的，而是彼此成就的。人生不是為了追求完美（切除壞的），而是追求完整（接納所有面向）。",
      mechanism: "兩部互動小說：《伊》現代職場療癒篇 + 《壹》奇幻寓言哲學篇。分歧選擇影響「弧度值」與「陰影值」，導向不同結局。",
      output: "40-60分鐘沉浸體驗 + 漸進式圖片載入 + 觸覺回饋 + 個人化結局",
      useCase: "當你遭遇深層情緒困境、自我否定、習得性無助，需要療癒而非分析時使用。",
    },
  },
  {
    station: 6,
    icon: Building2,
    title: "東方人因洞察系統",
    subtitle: "EHFIS — Eastern Human Factors Insight System",
    role: "企業應用器",
    philosophy: "行為洞察工具，不是命運審判工具",
    description: "將個人探索工具轉化為團隊協作工具，用於人才發展與團隊動態分析。只做行為假設，不做命運定論。",
    features: ["機會命運卡個人報告", "團隊矩陣分析", "RBH 行為假設報告", "團隊發展輔助工具"],
    link: "https://ehfis.rainbow-sanctuary.com/",
    color: "from-slate-500 to-zinc-500",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-400",
    detailedPhilosophy: {
      core: "EHFIS 是行為洞察工具，不是命運審判工具。我們只做行為假設，不做命運定論。",
      mechanism: "將個人探索工具轉化為團隊協作工具，分析成員互動動態與潛在衝突點。",
      output: "機會命運卡（個人行為傾向假設報告）+ 團隊矩陣分析 + RBH 報告（Role-Based Hypothesis 行為假設報告）",
      useCase: "用於團隊發展與自我覺察的輔助工具。⛔ 不得用於人員甄選、解僱、升遷調薪決策。",
    },
  },
];

const UniversePage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [expandedStation, setExpandedStation] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleStation = (station: number) => {
    setExpandedStation(expandedStation === station ? null : station);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/yuanyi-universe.mp4?v=3" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />
          
          {/* Audio Control Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-20 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-300 group"
            title={isMuted ? "開啟聲音" : "關閉聲音"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full" />
        </div>

        {/* Orbiting circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-white/5 rounded-full animate-spin" style={{ animationDuration: '60s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500/50 rounded-full" />
          </div>
          <div className="absolute w-[400px] h-[400px] md:w-[650px] md:h-[650px] border border-white/3 rounded-full animate-spin" style={{ animationDuration: '90s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-500/50 rounded-full" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <OptimizedImage 
              src={logoYuanyi} 
              alt="元壹宇宙" 
              className="h-16 md:h-20 mx-auto mb-6 opacity-90"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              元壹宇宙
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/60 mb-4 font-serif"
          >
            賽博玄哲學 — 用科技手段，把東方玄學說清楚
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            可驗證、可回看、可落地的自我探索工具鏈。<br />
            玄不是說不清楚，玄是還沒被說清楚。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://yyuniverse.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 min-h-[52px]"
            >
              {/* Pulsing glow rings */}
              <span className="absolute inset-0 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] bg-amber-400/30" />
              <span className="absolute inset-0 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s] bg-amber-400/20" />
              <span className="absolute inset-0 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_1s] bg-amber-400/10" />
              
              {/* Outer glow */}
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-300 animate-pulse" />
              
              {/* Button background */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
              
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              
              {/* Floating particles */}
              <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-[floatParticle_3s_ease-in-out_infinite]"
                    style={{
                      left: `${15 + i * 15}%`,
                      bottom: '20%',
                      animationDelay: `${i * 0.4}s`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </span>
              
              {/* Content */}
              <span className="relative flex items-center gap-2 z-10">
                <Sparkles className="w-5 h-5 animate-[pulse_1.5s_ease-in-out_infinite]" />
                元壹宇宙學術版
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </a>
            <div className="flex items-center gap-2 text-amber-400/60">
              <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>整合四大系統 × 默默超思維</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <div className="flex justify-center mb-8">
              <Infinity className="h-12 w-12 text-amber-400/50" />
            </div>
            <div className="font-serif text-lg md:text-xl leading-relaxed text-white/80 text-center space-y-6">
              <p>
                元壹宇宙是默默超元壹體系的<span className="text-amber-400">作業系統</span>，
                所有站點都建立在這個哲學框架上。
              </p>
              <p className="text-white/60">
                我們稱它為「賽博玄哲學」——<br />
                用科技手段，把東方玄學說清楚的哲學系統。
              </p>
              <p className="text-white/50">
                三大支柱：<span className="text-amber-400/80">完整性</span>（看見全部的完整）・
                <span className="text-amber-400/80">弧度</span>（彎路是抵達完整的必要路徑）・
                <span className="text-amber-400/80">成就律</span>（明暗相成，非為相照）
              </p>
            </div>

            {/* Seven Layer Architecture */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-xl font-serif font-bold text-center text-amber-400 mb-6">七層架構</h3>
              <div className="space-y-3">
                {[
                  { layer: "L0", name: "完整性哲學", desc: "錯誤不是廢棄物，是通往完整的材料" },
                  { layer: "L1", name: "九源歸一", desc: "人類提供關懷，AI 提供清晰，協作才是新文明" },
                  { layer: "L2", name: "元壹宇宙世界觀", desc: "元壹（同源）、緣壹（連結）、圓壹（完整）" },
                  { layer: "L3", name: "七大無二法則", desc: "萬物本無二，所有弧度終將歸一" },
                  { layer: "L4", name: "默默超思維系統", desc: "把哲學變成可操作的工具與方法論" },
                  { layer: "L5", name: "虹靈御所", desc: "理論落地的場域，六大站點的實作層" },
                  { layer: "L6", name: "CIP 創造完整性協定", desc: "對齊事，不裁人——AI 時代的協作規範" },
                ].map((item) => (
                  <div key={item.layer} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <span className="text-amber-400 font-mono font-bold text-sm w-8 flex-shrink-0 pt-0.5">{item.layer}</span>
                    <div>
                      <span className="text-white/80 font-medium text-sm">{item.name}</span>
                      <span className="text-white/40 text-sm ml-2">— {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Four Dimensions */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span className="text-white">四維運作框架</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              情緒、行動、心智、價值——四個維度的交織，構成一個人完整的生命運作
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {dimensions.map((dim, index) => (
              <motion.div
                key={dim.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dim.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${dim.bgColor} mb-6`}>
                    <dim.icon className={`h-7 w-7 ${dim.textColor}`} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">
                    {dim.title}
                  </h3>
                  <p className={`text-sm ${dim.textColor} mb-4`}>{dim.subtitle}</p>
                  <p className="text-white/60 leading-relaxed">
                    {dim.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              核心理念
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              這不是一套規則，而是一種看見世界的方式
            </p>
          </motion.div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <principle.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-white mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-amber-400/60 text-sm mb-3">{principle.subtitle}</p>
                    <p className="text-white/60 leading-relaxed">
                      {principle.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Collaboration Era */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>人機協作時代</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              為什麼現在需要元壹宇宙？
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              在 AI 可以做一切的時代，人類的價值是什麼？
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {aiCollaboration.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-8 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6">
                  <item.icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Six Stations - 旅程六站 */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-amber-500/10 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-purple-500/10 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
              <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span>產品矩陣</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                旅程六站
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              多站不是分散，是分工。每一站只解決一個特定階段的問題。
            </p>
          </motion.div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {journeyStations.map((station, index) => (
              <motion.div
                key={station.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
                className="group relative bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Station Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/40 text-sm font-bold">{station.station}</span>
                </div>
                
                <div className="relative z-10 p-8">
                  {/* Icon & Role */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl ${station.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <station.icon className={`h-7 w-7 ${station.textColor}`} />
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${station.textColor} bg-white/5 px-2 py-1 rounded-full`}>
                        {station.role}
                      </span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-white mb-1">
                    {station.title}
                  </h3>
                  <p className="text-white/40 text-sm mb-4">{station.subtitle}</p>
                  
                  {/* Philosophy */}
                  <div className="bg-white/5 rounded-lg p-3 mb-4 border-l-2 border-amber-400/50">
                    <p className="text-amber-400/80 text-sm italic">「{station.philosophy}」</p>
                  </div>
                  
                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    {station.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {station.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${station.textColor.replace('text-', 'bg-')}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Detailed Philosophy */}
                  <AnimatePresence>
                    {expandedStation === station.station && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 overflow-hidden"
                      >
                        <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                          <div>
                            <h4 className="text-xs font-bold text-white/80 mb-2 flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              核心理念
                            </h4>
                            <p className="text-white/60 text-xs leading-relaxed">{station.detailedPhilosophy.core}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white/80 mb-2 flex items-center gap-2">
                              <Layers className="w-3 h-3 text-amber-400" />
                              運作機制
                            </h4>
                            <p className="text-white/60 text-xs leading-relaxed">{station.detailedPhilosophy.mechanism}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white/80 mb-2 flex items-center gap-2">
                              <Target className="w-3 h-3 text-amber-400" />
                              輸出規格
                            </h4>
                            <p className="text-white/60 text-xs leading-relaxed">{station.detailedPhilosophy.output}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white/80 mb-2 flex items-center gap-2">
                              <Compass className="w-3 h-3 text-amber-400" />
                              使用時機
                            </h4>
                            <p className="text-white/60 text-xs leading-relaxed">{station.detailedPhilosophy.useCase}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => toggleStation(station.station)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 min-h-[44px] ${
                        expandedStation === station.station
                          ? `${station.bgColor} ${station.textColor} border-current`
                          : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {expandedStation === station.station ? "收合詳情" : "查看詳情"}
                      <motion.div
                        animate={{ rotate: expandedStation === station.station ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                      </motion.div>
                    </button>
                    <a
                      href={station.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${station.color} text-white text-sm font-medium hover:opacity-90 transition-all duration-300 min-h-[44px]`}
                    >
                      進入站點
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-white/60 text-sm">占卜分流</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-white/60 text-sm">戰略盤點</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-white/60 text-sm">身分映射</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-white/60 text-sm">能力訓練</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-white/60 text-sm">體驗修復</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-white/60 text-sm">企業應用</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <blockquote className="font-serif text-2xl md:text-3xl text-white/80 leading-relaxed mb-8">
              「元壹宇宙不是要你變成另一個人，<br />
              而是讓你成為<span className="text-amber-400">完整的自己</span>。」
            </blockquote>
            <p className="text-amber-400/60 font-medium">—— 默默超思維系統</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 rounded-3xl p-8 md:p-12 border border-amber-500/20 text-center"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
              開始探索你的運作方式
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              透過命理報告，發現你獨特的情緒、行動、心智與價值模式
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 min-h-[48px] px-8"
              >
                <Link to="/reports">
                  探索命理報告
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/10 min-h-[48px] px-8"
              >
                <Link to="/about">
                  認識默默超
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default UniversePage;
