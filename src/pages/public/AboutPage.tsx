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
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20">
        {/* Animated Background Orbs with Parallax */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y: bgOrb1Y }}
        >
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y: bgOrb2Y }}
        >
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          />
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
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
          className="relative z-10 container mx-auto px-4 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
            >
              <Sparkles className="w-14 h-14 mx-auto text-amber-400/80" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6"
          >
            <motion.span 
              className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              關於默默超
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/60 mb-6 font-serif"
          >
            About MomoChao
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-white/40 text-lg leading-relaxed">
              在人機協作的末法時代，你不需要被告知你是誰，<br className="hidden md:block" />
              你只需要一面夠清晰的鏡子。
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Portrait with Parallax Effect */}
            <motion.div
              initial={{ opacity: 0, x: -80, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group perspective-1000"
            >
              <motion.div 
                className="relative rounded-2xl overflow-hidden border border-white/10"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={momoPortraitCosmic} 
                  alt="MomoChao" 
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  whileHover={{ translateX: "200%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
              
              {/* Animated decorative frames */}
              <motion.div 
                className="absolute -inset-4 border border-amber-500/20 rounded-3xl -z-10"
                animate={{ rotate: [0, 1, 0, -1, 0] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute -inset-8 border border-amber-500/10 rounded-3xl -z-20"
                animate={{ rotate: [0, -1, 0, 1, 0] }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              
              {/* Corner glow effects */}
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Philosophy Text with Stagger Animation */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                  鏡子非劇本
                </h2>
                <p className="text-amber-400/60 text-lg mb-6">Mirror, Not Script</p>
                <p className="text-white/70 leading-relaxed text-lg">
                  命運從來不是寫好的劇本，而是一面等待你凝視的鏡子。
                  你在其中看見什麼，取決於你願意承認什麼。
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
                whileHover={{ scale: 1.02, borderColor: "rgba(251, 191, 36, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent)",
                    backgroundSize: "200% 100%"
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                
                <Quote className="w-8 h-8 text-amber-400/40 mb-4" />
                <p className="text-white/60 font-serif text-lg leading-relaxed italic relative z-10">
                  「我不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。」
                </p>
                <p className="text-amber-400/60 mt-4 text-sm">— 默默超</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thinking System Section - NEW */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-amber-400" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              默默超思維系統
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              四維運作框架：情緒、行動、心智、價值
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${dim.color} rounded-2xl p-6 border border-white/10 text-center group cursor-pointer`}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                >
                  <dim.icon className="w-10 h-10 mx-auto text-white/80 mb-4 group-hover:text-amber-400 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-serif font-bold text-white mb-1">{dim.title}</h3>
                <p className="text-white/40 text-sm">{dim.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/40 mt-8 text-sm"
          >
            「錯誤是材料，不是懲罰。」— 思維系統核心理念
          </motion.p>
        </div>
      </section>

      {/* Core Values Section with Enhanced Animations */}
      <section className="py-24 px-4 relative">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.05) 0%, transparent 70%)"
          }}
        />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              核心理念
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              這不是算命，是一場與自己的深度對話
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Eye,
                title: "看見",
                subtitle: "See",
                content: "看見你真正的運作方式，而非社會期待的樣子。"
              },
              {
                icon: Heart,
                title: "整合",
                subtitle: "Integrate",
                content: "納入一切經歷——包括錯誤——作為成長的材料。"
              },
              {
                icon: CircleDot,
                title: "完整",
                subtitle: "Wholeness",
                content: "追求的不是完美，而是完整。接受全部的自己。"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  boxShadow: "0 20px 40px -20px rgba(251, 191, 36, 0.3)"
                }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-500" />
                
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors relative z-10"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="w-7 h-7 text-amber-400" />
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1 relative z-10">
                  {value.title}
                </h3>
                <p className="text-amber-400/60 text-sm mb-4 relative z-10">{value.subtitle}</p>
                <p className="text-white/60 leading-relaxed relative z-10">
                  {value.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section with Reveal Animation */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full" />
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 text-center relative z-10"
            >
              <span className="text-amber-400">虹靈御所</span> 的誕生
            </motion.h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 text-white/70 leading-relaxed text-lg font-serif relative z-10"
            >
              <motion.p variants={itemVariants}>
                虹靈御所，取自「虹」（彩虹的多元光譜）與「靈」（靈魂的深度）。
                這裡是探索自我的聖所，是讓命理回歸本質的嘗試。
              </motion.p>
              <motion.p variants={itemVariants}>
                傳統命理常以「預測」為賣點，告訴你未來會發生什麼。
                但默默超相信：<span className="text-amber-400/80">真正的力量不在於知道未來，而在於理解自己。</span>
              </motion.p>
              <motion.p variants={itemVariants}>
                當你理解自己的運作方式——情緒如何流動、行動如何驅動、心智如何建構、價值如何選擇——
                你就不再需要別人告訴你該怎麼做。
              </motion.p>
              <motion.p variants={itemVariants} className="text-white/50">
                這就是虹靈御所存在的意義：<br />
                不是給你劇本，而是幫你擦亮那面鏡子。
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Second Portrait Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group order-2 md:order-1"
            >
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-serif font-bold text-white mb-4">人機協作的末法時代</h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  當 AI 能夠做到越來越多事情，人類真正需要的，
                  是堅實穩固的思維能力——知道自己是誰、要什麼、能承擔什麼。
                </p>
                <p className="text-amber-400/60 text-sm">
                  這就是為什麼默默超思維系統在這個時代如此重要。
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-1 md:order-2"
            >
              <motion.div 
                className="relative rounded-2xl overflow-hidden border border-white/10 max-w-sm mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={momoPortraitRainbow} 
                  alt="MomoChao Rainbow" 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-40" />
              </motion.div>
              <div className="absolute -inset-3 border border-amber-500/10 rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Animation */}
      <section className="py-24 px-4 relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
            style={{
              background: "radial-gradient(ellipse, rgba(251, 191, 36, 0.1) 0%, transparent 70%)"
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-16 h-16 mx-auto mb-8 rounded-full bg-amber-500/10 flex items-center justify-center"
            >
              <Target className="w-8 h-8 text-amber-400" />
            </motion.div>
            
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6">
              準備好照鏡子了嗎？
            </h2>
            <p className="text-white/50 mb-10 max-w-xl mx-auto text-lg">
              不是預言，不是劇本，只是一面夠清晰的鏡子。
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold px-10 py-7 text-lg rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
              >
                <a href="/reports">
                  探索命理報告
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;
