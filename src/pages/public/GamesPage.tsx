import { ExternalLink, Gamepad2, Sparkles, Target, Compass, Brain } from "lucide-react";
import { motion } from "framer-motion";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const games = [
  {
    id: "bazi",
    title: "四時八字人生兵法",
    subtitle: "虹靈御所",
    description: "以八字命理為基礎的策略遊戲，將你的命盤轉化為人生戰場上的兵符與戰略。探索四季能量如何影響你的決策與行動。",
    href: "https://bazi.rainbow-sanctuary.com/",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    id: "mirror",
    title: "元壹占卜系統",
    subtitle: "元壹宇宙",
    description: "結合多元占卜系統的互動式體驗，讓你透過不同的鏡子看見自己的不同面向。每次占卜都是一次自我對話。",
    href: "https://mirror.yyuniverse.com/",
    icon: Compass,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    id: "logic",
    title: "默默超思維訓練系統",
    subtitle: "元壹宇宙",
    description: "透過遊戲化的方式鍛鍊你的思維能力，培養情緒、行動、心智、價值四大維度的整合能力。",
    href: "https://mmclogic.com/",
    icon: Brain,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const GamesPage = () => {
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
              <span className="text-sm text-amber-400 font-medium">超烜遊戲生態系統</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                超烜遊戲
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-8">
              探索我們的互動式命理遊戲系列，透過遊戲化的方式
              <br className="hidden md:block" />
              深入了解自己、訓練思維、發現人生的更多可能性
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>3 款互動遊戲</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>多元系統整合</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <motion.a
                  key={game.id}
                  href={game.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  className={`group relative p-6 lg:p-8 rounded-2xl border ${game.borderColor} ${game.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10 min-h-[280px] flex flex-col`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-xs text-white/40 mb-2">{game.subtitle}</div>
                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm lg:text-base text-white/60 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                  
                  {/* Link Indicator */}
                  <div className="mt-6 flex items-center gap-2 text-sm text-white/40 group-hover:text-amber-400 transition-colors">
                    <span>立即體驗</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${game.color} opacity-5 blur-xl`} />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
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