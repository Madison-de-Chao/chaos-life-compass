/**
 * 默默超的元壹體系 — 入口頁
 * 語氣：直、快、銳利。創辦人個人風格。
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const subPages = [
  {
    icon: BookOpen,
    title: "教學理念",
    subtitle: "賽博玄哲學・四系統交叉比對・鷹架概念・Zone A/B/C",
    description: "我怎麼看玄學、怎麼用玄學、為什麼四個系統比一個好、為什麼你會長過這套工具。",
    href: "/momochao-system/philosophy",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: User,
    title: "關於默默超",
    subtitle: "創辦人個人版・Care & Truth・喚醒/篩選/賦能",
    description: "我是誰、我怎麼做事、我的版本的 Care & Truth 跟共用版有什麼不同。",
    href: "/momochao-system/about",
    color: "from-purple-500/20 to-indigo-500/20",
  },
  {
    icon: GraduationCap,
    title: "教育體系",
    subtitle: "四層課程・從認識自己到帶人",
    description: "課程的衡量標準只有一個：上完之後，你能不能自己走。",
    href: "/momochao-system/education",
    color: "from-blue-500/20 to-cyan-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MomochaoSystemPage = () => {
  useSEO({
    title: "默默超的元壹體系 | 創辦人的教學、訓練與服務",
    description: "同樣的工具，不同的手。虹靈御所的產品是中性的，但拿著工具的人不一樣。如果你要的是被講醒，你來對地方了。",
    keywords: "默默超, 趙偉辰, 元壹體系, 賽博玄哲學, 思維訓練, 命理教學",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">創辦人的教學、訓練與服務</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                默默超的元壹體系
              </span>
              <span className="block text-lg md:text-xl text-white/40 font-normal mt-3">MoMo Chao's YuanYi System</span>
            </h1>

            <div className="max-w-2xl mx-auto space-y-4 text-white/60 leading-relaxed mb-12">
              <p className="text-lg md:text-xl">同樣的工具，不同的手。</p>
              <p>
                虹靈御所的產品是中性的——命盤不罵人，占卜系統不諷刺。<br />
                但拿著工具的人不一樣。
              </p>
              <p>
                我是趙偉辰，我說話直接，不打柔光，不給藉口。
              </p>
              <p className="text-white/40">
                如果你要的是溫柔地被理解，虹靈御所的其他服務適合你。<br />
                如果你要的是被講醒，你來對地方了。
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Positioning */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xl md:text-2xl font-serif text-amber-400/80 italic">
              「用玄學幫你看見自己，但拒絕讓玄學替你開脫。」
            </p>
          </motion.div>

          {/* Two audiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8">
              你在選誰當你的<span className="text-amber-400">藉口</span>？
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">如果你已經在用玄學但用錯方式——</h3>
                <p className="text-white/60 leading-relaxed">
                  好的永遠準，壞的永遠質疑。你從一開始就不是在找答案，是在找確認。我會幫你把這個機制拆開。
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">如果你連藉口都沒有——</h3>
                <p className="text-white/60 leading-relaxed">
                  不知道自己怎麼了，不知道自己要什麼，不知道為什麼活成這樣。我有一套很年輕、很新、可能有點奇怪的東西。它不會告訴你你是誰，但它可能會讓你第一次看見自己的輪廓。
                </p>
                <p className="text-white/40 text-sm mt-4">
                  不保證有效。但如果有效，它的效果不是「讓你舒服」，是「讓你終於看得清楚」。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-pages Navigation */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {subPages.map((page) => (
              <motion.div key={page.href} variants={itemVariants}>
                <Link
                  to={page.href}
                  className={`group block bg-gradient-to-br ${page.color} rounded-2xl p-6 md:p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-300 h-full`}
                >
                  <page.icon className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-amber-400/60 text-xs mb-3">{page.subtitle}</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{page.description}</p>
                  <div className="flex items-center text-amber-400 text-sm font-medium">
                    <span>深入了解</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-white/50 mb-8">
              想先了解虹靈御所的中性工具？回到主站看看。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8">
                <Link to="/home">回到虹靈御所</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/reports">看命理報告</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default MomochaoSystemPage;
