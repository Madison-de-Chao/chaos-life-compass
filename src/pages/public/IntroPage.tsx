import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, Compass, Sparkles, Shield, Heart, BookOpen, Bot, User } from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const IntroPage = () => {
  useSEO({
    title: "一分鐘認識元壹體系｜先看清自己站在哪",
    description: "元壹體系是一套幫你看清現狀、給可執行下一步的工具。命理、AI、思維訓練都只是工具，不是答案。60 秒讀懂這是什麼。",
    keywords: "元壹體系,虹靈御所,默默超,完整性,思維工具,命理結構",
  });

  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* 屏 1 痛點開場 */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>60 秒讀懂元壹體系</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                你不缺答案，<br className="sm:hidden" />缺的是先看清自己站在哪。
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              AI 什麼都能回答，但你得先知道自己要問什麼。<br />
              搞不清現在的狀況，問什麼、做什麼，都是白搭。
            </p>
            <div className="mt-12 flex justify-center">
              <ChevronDown className="w-6 h-6 text-amber-400/60 animate-bounce" />
            </div>
          </motion.div>
        </section>

        {/* 屏 2 這是什麼 */}
        <section className="py-20 px-4 border-t border-white/10">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                這是什麼
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 text-center leading-relaxed mb-6 max-w-3xl mx-auto">
              元壹體系是一套幫你<span className="text-amber-400">看清現狀</span>、給可執行<span className="text-amber-400">下一步</span>的工具。
            </p>
            <p className="text-white/60 text-center mb-12">
              命理、AI、思維訓練都只是工具，不是答案。
            </p>

            <div className="text-center mb-10">
              <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
                不是算命　·　不是心靈雞湯　·　不是課程推銷
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-sm text-white/40 mb-2">一般命理／心靈成長</div>
                <p className="text-white/80">給你一個答案，要你相信。</p>
              </div>
              <div className="p-6 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20">
                <div className="text-sm text-amber-400/80 mb-2">元壹體系</div>
                <p className="text-white">把結構翻給你看，給你選項，<span className="text-amber-400">你自己決定</span>。</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 屏 3 它守三件事 */}
        <section className="py-20 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-amber-500/[0.03]">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                它守三件事
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "說真話", desc: "確定的說確定，不確定的標出來。不用「可能」「大概」糊弄你。", icon: Shield },
                { title: "說人話", desc: "每一段都有實際內容，不說場面話。像信得過的朋友，不像客服。", icon: Heart },
                { title: "守住邊界", desc: "分清事實、推測、立場。不替你做選擇，也不承接不屬於自己的責任。", icon: Check },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-colors">
                  <item.icon className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 屏 4 你可以用到什麼 */}
        <section className="py-20 px-4 border-t border-white/10">
          <motion.div {...fadeUp} className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                你可以用到什麼
              </span>
            </h2>
            <p className="text-white/60 text-center mb-12">
              六站各司其職，用你需要的就好，不綁套餐。
            </p>

            {/* 核心三項 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { title: "虹靈御所", href: "/home", desc: "四系統交叉比對的命理報告，看見你的結構。" },
                { title: "元壹宇宙", href: "/universe", desc: "完整性導向的思維操作系統。沒有錯誤，只有未完成的弧度。" },
                { title: "虹靈御所藏書閣", href: "https://books.rainbow-sanctuary.com", external: true, desc: "三套原創系列線上閱讀：弧度歸零、塔羅冒險、元壹宇宙神話故事集。" },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.07] transition-all group"
                >
                  <h3 className="text-xl font-serif text-amber-400 mb-3 group-hover:text-amber-300">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>進入</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>

            {/* 還有更多 */}
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <span>還有更多</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid md:grid-cols-3 gap-6 mt-6 overflow-hidden"
              >
                {[
                  { title: "超烜創意", href: "/chaoxuan", icon: Sparkles, desc: "說真話的品牌整合夥伴。" },
                  { title: "AI 協作入口", href: "/ai", icon: Bot, desc: "跟 AI 合作的規則：說真話、標來源、守邊界。" },
                  { title: "認識默默超", href: "/about", icon: User, desc: "一個花了四十年把做人的方式變成工具的人。" },
                ].map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="block p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all group"
                  >
                    <item.icon className="w-6 h-6 text-amber-400 mb-3" />
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* 屏 5 適合誰、放心用 */}
        <section className="py-20 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-amber-500/[0.03]">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                適合誰、為什麼可以放心
              </span>
            </h2>

            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-white/10 mb-6">
              <div className="text-sm text-amber-400 mb-2">適合</div>
              <p className="text-lg text-white/85 leading-relaxed">
                卡在決策、想認識自己、不想被「算命」綁住的人。
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="text-sm text-amber-400 mb-4">放心用</div>
              <ul className="space-y-4">
                {[
                  "工具是你的，不是你是工具的。用得上就用，沒用就放著。",
                  "不預測命運、不販售宿命。命盤是診斷工具，不是判決書。",
                  "你永遠有最終決定權。",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-white/80 leading-relaxed">
                    <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* 屏 6 從哪裡開始 */}
        <section className="py-24 px-4 border-t border-white/10">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                從哪裡開始
              </span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-10">
              不知道從哪開始？<br className="sm:hidden" />五個情境題，幫你找到最適合的方向。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 min-h-[56px] px-8 text-base"
              >
                <Link to="/discover">
                  <Compass className="w-5 h-5 mr-2" />
                  做測驗找方向
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-amber-100 min-h-[56px] px-8 text-base"
              >
                <Link to="/home">
                  <BookOpen className="w-5 h-5 mr-2" />
                  進虹靈御所
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-white/70 hover:text-white hover:bg-white/10 min-h-[56px] px-8 text-base"
              >
                <Link to="/momochao-system">
                  <User className="w-5 h-5 mr-2" />
                  認識默默超
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default IntroPage;
