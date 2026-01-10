import { motion } from "framer-motion";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { 
  Sparkles, 
  Heart, 
  Eye, 
  Infinity, 
  Quote,
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import momoPortrait from "@/assets/momo-portrait-cosmic.jpg";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Sparkles className="w-12 h-12 mx-auto text-amber-400/60 mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              關於默默超
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/60 mb-4 font-serif"
          >
            About MomoChao
          </motion.p>
        </div>
      </section>

      {/* Portrait & Philosophy Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={momoPortrait} 
                  alt="MomoChao" 
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-amber-500/20 rounded-3xl -z-10" />
              <div className="absolute -inset-8 border border-amber-500/10 rounded-3xl -z-20" />
            </motion.div>

            {/* Philosophy Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                  鏡子非劇本
                </h2>
                <p className="text-amber-400/60 text-lg mb-6">Mirror, Not Script</p>
                <p className="text-white/70 leading-relaxed text-lg">
                  命運從來不是寫好的劇本，而是一面等待你凝視的鏡子。
                  你在其中看見什麼，取決於你願意承認什麼。
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <Quote className="w-8 h-8 text-amber-400/40 mb-4" />
                <p className="text-white/60 font-serif text-lg leading-relaxed italic">
                  「我不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。」
                </p>
                <p className="text-amber-400/60 mt-4 text-sm">— 默默超</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="container mx-auto max-w-5xl relative z-10">
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
              這不是算命，是一場與自己的深度對話
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                icon: Infinity,
                title: "完整",
                subtitle: "Wholeness",
                content: "追求的不是完美，而是完整。接受全部的自己。"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                  <value.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">
                  {value.title}
                </h3>
                <p className="text-amber-400/60 text-sm mb-4">{value.subtitle}</p>
                <p className="text-white/60 leading-relaxed">
                  {value.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 text-center">
              <span className="text-amber-400">虹靈御所</span> 的誕生
            </h2>
            
            <div className="space-y-6 text-white/70 leading-relaxed text-lg font-serif">
              <p>
                虹靈御所，取自「虹」（彩虹的多元光譜）與「靈」（靈魂的深度）。
                這裡是探索自我的聖所，是讓命理回歸本質的嘗試。
              </p>
              <p>
                傳統命理常以「預測」為賣點，告訴你未來會發生什麼。
                但默默超相信：<span className="text-amber-400/80">真正的力量不在於知道未來，而在於理解自己。</span>
              </p>
              <p>
                當你理解自己的運作方式——情緒如何流動、行動如何驅動、心智如何建構、價值如何選擇——
                你就不再需要別人告訴你該怎麼做。
              </p>
              <p className="text-white/50">
                這就是虹靈御所存在的意義：<br />
                不是給你劇本，而是幫你擦亮那面鏡子。
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <a
                href="https://main.momo-chao.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
              >
                <span>了解更多默默超的故事</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">
              準備好照鏡子了嗎？
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              不是預言，不是劇本，只是一面夠清晰的鏡子。
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold px-8 py-6 text-lg rounded-full"
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
