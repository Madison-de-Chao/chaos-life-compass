import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { 
  Sparkles, 
  Heart, 
  Eye, 
  Quote,
  Zap,
  Target,
  Brain,
  Compass,
  CircleDot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import momoPortraitCosmic from "@/assets/momo-portrait-cosmic.jpg";
import momoPortraitRainbow from "@/assets/momo-portrait-rainbow.jpg";

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax transforms
  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const bgOrb1Y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const bgOrb2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Stagger animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <PublicHeader />
      
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden py-16 md:py-20">
        {/* Animated Background Orbs with Parallax - Reduced on mobile */}
        <motion.div 
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{ y: bgOrb1Y }}
        >
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{ y: bgOrb2Y }}
        >
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[100px]"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          />
        </motion.div>
        
        {/* Mobile-only simplified background */}
        <div className="absolute inset-0 pointer-events-none md:hidden">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[60px]" />
        </div>

        {/* Floating Particles - Reduced count on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full hidden md:block"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div 
          className="relative z-10 container mx-auto px-4 sm:px-6 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-6 md:mb-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            >
              <Sparkles className="w-10 h-10 md:w-14 md:h-14 mx-auto text-amber-400/80" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6"
          >
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent inline-block">
              關於默默超
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/60 mb-4 md:mb-6 font-serif"
          >
            About MomoChao
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto px-2"
          >
            <p className="text-white/40 text-base md:text-lg leading-relaxed">
              幫你看清自己的狀況，不替你做決定。
              <span className="hidden md:inline"><br /></span>
              確定的事說確定，不確定的標出來。
            </p>
          </motion.div>

          {/* Scroll Indicator - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Portrait & Philosophy Section with Enhanced Animations */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Portrait with Parallax Effect */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              <motion.div 
                className="relative rounded-2xl overflow-hidden border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <OptimizedImage 
                  src={momoPortraitCosmic} 
                  alt="MomoChao" 
                  className="w-full aspect-[3/4] transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              </motion.div>
              
              {/* Animated decorative frames - Simplified on mobile */}
              <motion.div 
                className="absolute -inset-3 md:-inset-4 border border-amber-500/20 rounded-2xl md:rounded-3xl -z-10 hidden md:block"
                animate={{ rotate: [0, 1, 0, -1, 0] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="absolute -inset-2 border border-amber-500/15 rounded-xl -z-10 md:hidden" />
            </motion.div>

            {/* Philosophy Text with Stagger Animation */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6 md:space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4">
                  思考夥伴，不是老師
                </h2>
                <p className="text-amber-400/60 text-base md:text-lg mb-4 md:mb-6">Thinking Partner, Not Guru</p>
                <p className="text-white/70 leading-relaxed text-base md:text-lg">
                  我不替你做決定。我能做的是幫你把選項攤開、把代價看清楚。
                  每個判斷都分清事實、推測、立場——搞清楚你聽到的是哪一種。
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-white/5 rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/10 relative overflow-hidden group active:scale-[0.98] transition-transform touch-manipulation"
              >
                <Quote className="w-6 h-6 md:w-8 md:h-8 text-amber-400/40 mb-3 md:mb-4" />
                <p className="text-white/60 font-serif text-base md:text-lg leading-relaxed italic relative z-10">
                  「把話說清楚，把事做完整。對方越來越不需要你，就代表你做對了。」
                </p>
                <p className="text-amber-400/60 mt-3 md:mt-4 text-sm">— 創辦人 MOMO CHAO</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thinking System Section - NEW */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, type: "spring" }}
              className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4">
              四個操作維度
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
              任何決定都跑不出這四件事——搞清楚它們，你就不容易做錯選擇
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          >
            {[
              { icon: Heart, title: "情緒", subtitle: "Emotion", color: "from-rose-500/20 to-rose-600/10" },
              { icon: Zap, title: "行動", subtitle: "Action", color: "from-amber-500/20 to-amber-600/10" },
              { icon: Brain, title: "心智", subtitle: "Mindset", color: "from-blue-500/20 to-blue-600/10" },
              { icon: Compass, title: "價值", subtitle: "Values", color: "from-purple-500/20 to-purple-600/10" }
            ].map((dim, index) => (
              <motion.div
                key={dim.title}
                variants={itemVariants}
                className={`bg-gradient-to-br ${dim.color} rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 text-center group cursor-pointer active:scale-95 transition-transform touch-manipulation`}
              >
                <dim.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto text-white/80 mb-2 md:mb-4 group-hover:text-amber-400 transition-colors" />
                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-0.5 md:mb-1">{dim.title}</h3>
                <p className="text-white/40 text-xs md:text-sm">{dim.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-white/40 mt-6 md:mt-8 text-xs md:text-sm px-4"
          >
            「搞清楚你現在的感受、能做什麼、怎麼看這件事、在乎的是什麼——問題就解了一半。」
          </motion.p>
        </div>
      </section>

      {/* Core Values Section with Enhanced Animations */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative">
        <div 
          className="absolute inset-0 hidden md:block"
          style={{
            background: "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.05) 0%, transparent 70%)"
          }}
        />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4">
              三條底線
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
              說真話・說人話・守邊界
            </p>
            <p className="text-white/40 text-xs mt-2 max-w-lg mx-auto">
              不是道德要求，是風險管理的必要條件
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
          >
            {[
              {
                icon: Eye,
                title: "說真話",
                subtitle: "Truth",
                content: "確定的事就說確定，不確定的標出來。有來源的附來源，沒有的直接說沒有。不用模糊措辭迴避風險。"
              },
              {
                icon: Heart,
                title: "說人話",
                subtitle: "Human",
                content: "不說場面話，每一段都有實際內容。語氣直接但不冷漠，像值得信任的朋友，不像客服也不像教授。"
              },
              {
                icon: CircleDot,
                title: "守邊界",
                subtitle: "Boundary",
                content: "分清事實、推測和立場。不替你做選擇，不承接不屬於自己的責任。決定權在你。"
              }
            ].map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="bg-white/5 rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group relative overflow-hidden active:scale-[0.98] touch-manipulation"
              >
                {/* Background glow on hover - desktop only */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-500 hidden md:block" />
                
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-amber-500/20 transition-colors relative z-10">
                  <value.icon className="w-6 h-6 md:w-7 md:h-7 text-amber-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-1 relative z-10">
                  {value.title}
                </h3>
                <p className="text-amber-400/60 text-xs md:text-sm mb-3 md:mb-4 relative z-10">{value.subtitle}</p>
                <p className="text-white/60 leading-relaxed text-sm md:text-base relative z-10">
                  {value.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section with Reveal Animation */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 relative overflow-hidden"
          >
            {/* Decorative corner elements - Hidden on mobile */}
            <div className="absolute top-0 left-0 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full hidden sm:block" />
            <div className="absolute bottom-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full hidden sm:block" />
            
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mb-6 md:mb-8 text-center relative z-10"
            >
              為什麼做<span className="text-amber-400">這件事</span>
            </motion.h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 md:space-y-6 text-white/70 leading-relaxed text-base md:text-lg font-serif relative z-10"
            >
              <motion.p variants={itemVariants}>
                傳統命理告訴你未來會怎樣，然後你就照著過。
                問題是——那是別人的解讀，不是你的決定。
              </motion.p>
              <motion.p variants={itemVariants}>
                我做這套工具的原因很簡單：<span className="text-amber-400/80">模糊的語言會掩蓋風險，讓人在不知情下踏入麻煩。</span>
                把話說清楚，風險就降了一半。
              </motion.p>
              <motion.p variants={itemVariants}>
                所以這裡的每個產出都分三層：事實、推測、立場。
                <span className="text-white/50">你看到的是哪一層，自己判斷。我不替你做結論。</span>
              </motion.p>
              <motion.p variants={itemVariants} className="text-white/50 text-sm md:text-base">
                最終目標：你越來越不需要這套東西，就代表它有用。
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Second Portrait Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group order-2 md:order-1"
            >
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 md:mb-4">AI 時代，人需要什麼</h3>
                <p className="text-white/60 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                  AI 能查資料、能分析、能回答問題。但它不知道你在乎什麼、能承擔什麼、底線在哪。
                  這些只有你自己清楚——前提是你願意搞清楚。
                </p>
                <p className="text-amber-400/60 text-xs md:text-sm">
                  這套工具幫你釐清這些事，然後你自己決定怎麼做。
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 md:order-2"
            >
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 max-w-xs md:max-w-sm mx-auto">
                <OptimizedImage 
                  src={momoPortraitRainbow} 
                  alt="MomoChao Rainbow" 
                  className="w-full aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-40" />
              </div>
              <div className="absolute -inset-2 md:-inset-3 border border-amber-500/10 rounded-2xl md:rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Animation */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative">
        {/* Animated background - Simplified on mobile */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px]"
            style={{
              background: "radial-gradient(ellipse, rgba(251, 191, 36, 0.1) 0%, transparent 70%)"
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute inset-0 md:hidden">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px]"
            style={{
              background: "radial-gradient(ellipse, rgba(251, 191, 36, 0.08) 0%, transparent 70%)"
            }}
          />
        </div>
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 md:mb-8 rounded-full bg-amber-500/10 flex items-center justify-center"
            >
              <Target className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
            </motion.div>
            
            <h2 className="text-xl sm:text-2xl md:text-4xl font-serif font-bold text-white mb-4 md:mb-6">
              想試試看？
            </h2>
            <p className="text-white/50 mb-8 md:mb-10 max-w-xl mx-auto text-base md:text-lg px-2">
              看一份報告，自己判斷有沒有用。不滿意就當作看過一篇文章。
            </p>
            
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold px-8 md:px-10 py-6 md:py-7 text-base md:text-lg rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow active:scale-95 touch-manipulation"
            >
              <a href="/reports">
                探索命理報告
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;
