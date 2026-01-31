import { useState } from "react";
import { ExternalLink, Gamepad2, Sparkles, Target, Compass, Brain, Filter, Swords, Stars, GraduationCap, Recycle, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Game preview images
import gameBaziImg from "@/assets/game-bazi.jpg";
import gameMirrorImg from "@/assets/game-mirror.jpg";
import gameLogicImg from "@/assets/game-logic.jpg";

type Category = "all" | "divination" | "training" | "healing" | "enterprise";

const categories: { id: Category; label: string; color: string }[] = [
  { id: "all", label: "全部站點", color: "bg-white/10 text-white border-white/20 hover:bg-white/20" },
  { id: "divination", label: "命理類", color: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20" },
  { id: "training", label: "思維訓練類", color: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20" },
  { id: "healing", label: "療癒類", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" },
  { id: "enterprise", label: "企業應用", color: "bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20" },
];

const games = [
  {
    id: "yyds",
    station: 1,
    title: "元壹占卜系統 YYDS",
    subtitle: "決策分流器",
    philosophy: "鏡子非劇本，真實即命運",
    description: "當你站在岔路口不知道該往哪走，元壹占卜幫你看清「現在的狀態」和「下一步的方向」。順勢與反噬並存於每一卦，真正決定走向的是你的覺察與選擇。",
    href: "https://yyds.rainbow-sanctuary.com/",
    icon: Compass,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    category: "divination" as Category,
    categoryLabel: "命理類",
    previewImage: gameMirrorImg,
  },
  {
    id: "bazi",
    station: 2,
    title: "四時八字人生兵法 RSBZS",
    subtitle: "戰略盤點器",
    philosophy: "將軍是你，軍團也是你",
    description: "八字不是命定的枷鎖，而是你的四支軍團。你是統御全局的將軍，學會調度才能打贏人生戰役。盤點資源、預判風險、規劃節奏。",
    href: "https://bazi.rainbow-sanctuary.com/",
    icon: Swords,
    color: "from-red-500 to-orange-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    category: "divination" as Category,
    categoryLabel: "命理類",
    previewImage: gameBaziImg,
  },
  {
    id: "star",
    station: 3,
    title: "元壹宇宙神話占星系統",
    subtitle: "身分映射器",
    philosophy: "命運是起點，選擇是終點",
    description: "把你的星盤轉化成一個「宇宙身分證」——你的職階、職能、守護神、侍神、六維能力值。星盤不是判決書，是導航系統。",
    href: "https://star.rainbow-sanctuary.com/",
    icon: Stars,
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    category: "divination" as Category,
    categoryLabel: "命理類",
    previewImage: gameMirrorImg,
  },
  {
    id: "mmcls",
    station: 4,
    title: "默默超思維訓練系統 MMCLS",
    subtitle: "能力訓練器",
    philosophy: "思維工具箱：八階思維循環",
    description: "知道自己是誰之後，接下來是「練出來」。透過結構化的思維訓練與九位導師系統，把洞察轉化成能力，累積「成就證據」。",
    href: "https://mmclogic.com/",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    category: "training" as Category,
    categoryLabel: "思維訓練類",
    previewImage: gameLogicImg,
  },
  {
    id: "atzo",
    station: 5,
    title: "弧度歸零 Arc Zero",
    subtitle: "體驗修復器",
    philosophy: "完整不是沒有缺口，完整是不再害怕缺口",
    description: "當你遇到深層的情緒困境、自我否定、習得性無助，需要的不是更多分析，而是一場療癒體驗。透過互動小說學習面對陰影。",
    href: "https://atzo.rainbow-sanctuary.com/",
    icon: Recycle,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    category: "healing" as Category,
    categoryLabel: "療癒類",
    previewImage: gameMirrorImg,
  },
  {
    id: "ehfis",
    station: 6,
    title: "東方人因洞察系統 EHFIS",
    subtitle: "企業應用器",
    philosophy: "行為洞察工具，不是命運審判工具",
    description: "將個人探索工具轉化為團隊協作工具，用於人才發展與團隊動態分析。只做行為假設，不做命運定論。",
    href: "https://ehfis.rainbow-sanctuary.com/",
    icon: Building2,
    color: "from-slate-500 to-zinc-600",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    category: "enterprise" as Category,
    categoryLabel: "企業應用",
    previewImage: gameLogicImg,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const GamesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  
  const filteredGames = games.filter(
    game => selectedCategory === "all" || game.category === selectedCategory
  );

  const getCategoryButtonStyle = (catId: Category) => {
    if (selectedCategory !== catId) return categories.find(c => c.id === catId)?.color || "";
    switch (catId) {
      case "all": return "bg-white text-black border-white";
      case "divination": return "bg-amber-500 text-black border-amber-500";
      case "training": return "bg-blue-500 text-white border-blue-500";
      case "healing": return "bg-emerald-500 text-white border-emerald-500";
      case "enterprise": return "bg-slate-500 text-white border-slate-500";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">元壹系統生態・旅程六站</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                互動式自我探索
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-8">
              多站不是分散，是分工。每一站只解決一個特定階段的問題。
              <br className="hidden md:block" />
              你不需要用全部，只用你需要的。
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>可驗證的下一步</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>可回看的機制</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="py-6 border-b border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 text-white/40 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">分類篩選</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 min-h-[44px] active:scale-95 ${getCategoryButtonStyle(cat.id)}`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredGames.map((game) => {
                const Icon = game.icon;
                return (
                  <motion.a
                    key={game.id}
                    href={game.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    className={`group relative rounded-2xl border ${game.borderColor} ${game.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden flex flex-col`}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    {/* Preview Image */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <OptimizedImage 
                        src={game.previewImage} 
                        alt={`${game.title} 預覽`}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                        placeholderColor="bg-white/5"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                      
                      {/* Station Badge */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <span className="text-white/80 text-sm font-bold">{game.station}</span>
                      </div>
                      
                      {/* Category Badge on Image */}
                      <Badge
                        variant="outline"
                        className={`absolute top-3 right-3 text-xs backdrop-blur-sm ${
                          game.category === "divination"
                            ? "bg-amber-500/30 text-amber-200 border-amber-400/50"
                            : game.category === "training"
                            ? "bg-blue-500/30 text-blue-200 border-blue-400/50"
                            : game.category === "healing"
                            ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/50"
                            : "bg-slate-500/30 text-slate-200 border-slate-400/50"
                        }`}
                      >
                        {game.categoryLabel}
                      </Badge>
                      
                      {/* Icon on Image */}
                      <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 lg:p-6 flex-1 flex flex-col">
                      <div className="text-xs text-white/40 mb-1">{game.subtitle}</div>
                      <h3 className="text-lg lg:text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                        {game.title}
                      </h3>
                      
                      {/* Philosophy Quote */}
                      <div className="bg-white/5 rounded-lg p-2 mb-3 border-l-2 border-amber-400/50">
                        <p className="text-amber-400/70 text-xs italic">「{game.philosophy}」</p>
                      </div>
                      
                      <p className="text-sm text-white/60 leading-relaxed flex-1">
                        {game.description}
                      </p>
                      
                      {/* Link Indicator */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-white/40 group-hover:text-amber-400 transition-colors">
                        <span>立即體驗</span>
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${game.color} opacity-5 blur-xl`} />
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </AnimatePresence>
          
          {/* Empty State */}
          {filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-white/40">此分類暫無站點</p>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              想要更深入了解自己？
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              除了遊戲體驗，我們還提供專業的命理報告服務，
              <br className="hidden md:block" />
              為你量身打造完整的自我認識藍圖
            </p>
            <a
              href="/reports"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/25 min-h-[48px] active:scale-95"
            >
              探索命理報告
              <Sparkles className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default GamesPage;
