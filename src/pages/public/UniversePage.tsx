import { motion } from "framer-motion";
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
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const UniversePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/yuanyi-universe.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />
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
            <img 
              src={logoYuanyi} 
              alt="元壹宇宙" 
              className="h-16 md:h-20 mx-auto mb-6 opacity-90"
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
            Yuan-Yi Universe — A Civilization-Level Living Methodology
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            不是一套知識，而是一種活法。<br />
            在複雜世界中，找到屬於自己的運作方式。
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
                元壹宇宙是一套<span className="text-amber-400">文明級的生活方法論</span>。
              </p>
              <p className="text-white/60">
                它不教你如何成功，<br />
                而是教你如何在任何處境中，都能保持清醒與整合。
              </p>
              <p className="text-white/50">
                成功是結果，而非目標。<br />
                當你真正理解自己的運作方式，<br />
                成功只是副產品。
              </p>
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
                <Link to="/momo">
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
