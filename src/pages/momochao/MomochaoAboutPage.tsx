/**
 * 關於默默超（個人版）
 * 語氣：直誠銳利。創辦人個人敘事。
 */

import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, User, Heart, Eye, CircleDot, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { OptimizedImage } from "@/components/ui/optimized-image";
import momoPortraitCosmic from "@/assets/momo-portrait-cosmic.jpg";
import { useSEO } from "@/hooks/useSEO";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MomochaoAboutPage = () => {
  useSEO({
    title: "關於默默超 | 創辦人個人版",
    description: "我是趙偉辰，多數人叫我默默超。不是老師，不是先知，不是聖人。打工人，做過公關、活動、行銷專案。",
    keywords: "默默超, 趙偉辰, MomoChao, 元壹體系, 創辦人",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <Link to="/momochao-system" className="inline-flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            默默超的元壹體系
          </Link>

          {/* Hero with Portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  我是誰 Who I Am
                </span>
              </h1>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>我是趙偉辰，多數人叫我默默超。</p>
                <p>不是老師，不是先知，不是聖人。打工人，做過公關、活動、行銷專案。</p>
                <p className="text-white/80">
                  我知道自己很行。我願意幫忙。相信的自然會靠近，不信的我也不勉強。
                </p>
                <p>
                  不是人見人愛的那種。但我發言的時候，不會被捨棄或無視。有重要事情的時候，人們還是會願意問我的意見。
                </p>
                <p className="text-white/40">
                  如果我說錯，下次就不會有人再來問我。所以我不能說錯，也不會為了讓你舒服而說假話。
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <OptimizedImage src={momoPortraitCosmic} alt="默默超 MomoChao" className="w-full aspect-[3/4]" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute -inset-3 border border-amber-500/15 rounded-3xl -z-10" />
            </motion.div>
          </div>

          {/* 我不是工程師 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-12"
          >
            <h2 className="text-xl font-serif font-bold text-white mb-4">我不是工程師 I'm Not an Engineer</h2>
            <p className="text-white/60 leading-relaxed">
              但我不接受「我不是理科腦所以我做不了」這個前提。我用 AI 把需求說清楚，工具替我執行，六個站點就是這樣建出來的。不預設自己做不到，不畫地自限。
            </p>
          </motion.div>

          {/* Care & Truth — 我的版本 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20 mb-12"
          >
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">Care & Truth — 我的版本 My Version</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-amber-400 font-bold mb-2">Truth（真誠）</h3>
                <p className="text-white/60">不是讓你舒服，是讓你正確收到正確的東西。負責不失真。</p>
              </div>
              <div>
                <h3 className="text-amber-400 font-bold mb-2">Care（關懷）</h3>
                <p className="text-white/60">不是給你想聽的，是給你需要聽的。負責不失焦。</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-white/40 text-sm italic">
                  第三層：在乎但不追。東西已經準備好了，放在這裡，你來的時候它在。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 喚醒 / 篩選 / 賦能 — 我的版本 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-8 text-center">
              喚醒 / 篩選 / 賦能 — 我的版本
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Eye,
                  title: "喚醒",
                  subtitle: "Awaken",
                  content: "讓你重新信任你的第一反應——那個在你開始想之前就已經知道的東西。不是教你新東西，是讓你知道你只看到了一面。",
                },
                {
                  icon: Heart,
                  title: "篩選",
                  subtitle: "Filter",
                  content: "學會分辨哪些是你真正的感受，哪些是別人教你應該有的感受。教你在判斷之前先清空自己的框架。",
                },
                {
                  icon: CircleDot,
                  title: "賦能",
                  subtitle: "Empower",
                  content: "你的身體比你的腦子更早知道答案。把那個信任還給你自己。不是給你能力，是把你本來就有的還給你。",
                },
              ].map((v) => (
                <motion.div key={v.title} variants={itemVariants} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <v.icon className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-lg font-serif font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-amber-400/60 text-xs mb-3">{v.subtitle}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{v.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/momochao-system/philosophy">
                <ArrowLeft className="mr-2 h-4 w-4" />
                教學理念
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
              <Link to="/momochao-system/education">
                教育體系
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default MomochaoAboutPage;
