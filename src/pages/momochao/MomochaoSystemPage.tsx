/**
 * 銷售頁｜搞定自己和 AI 的工具箱（基礎課）
 * 路由：/momochao-system
 * 文案版本：v3 / 2026-06-19
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Check,
  X,
  Package,
  ChevronRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";
import ogHorizontal from "/og-momochao-system.jpg.asset.json";
import ogSquare from "/og-momochao-system-square.jpg.asset.json";
import ogVertical from "/og-momochao-system-vertical.jpg.asset.json";

const SITE_ORIGIN = "https://chaos-life-compass.lovable.app";

const LINE_URL = "https://line.me/R/ti/p/@momochao";

const painPoints = [
  "你學了一堆 prompt 技巧，AI 還是常常給你一坨看起來很專業的垃圾。",
  "你花時間上過 AI 課，回到工作上不知道怎麼用——因為那些課教的是工具，不是判斷。",
  "你覺得 AI 很強，但說不出自己跟它之間到底是什麼關係——你在用它，還是它在帶你？",
  "你問 AI「我該怎麼辦」，它回你「你好棒」——然後你還覺得被安慰到了。",
  "你做了一個決定，事後發現當初根本沒把問題想清楚，但已經來不及了。",
];

const compareRows: [string, string][] = [
  ["教你怎麼跟 AI 講話（prompt）", "教你怎麼跟自己講話（思維方法）"],
  ["教你用一個 AI 工具", "教你在多個 AI 之間判斷品質"],
  ["上完覺得「學到了」但用不出來", "每堂帶走一個自己做的交付物"],
  ["大班制，講完就散", "一對一，用你自己的真實問題當素材"],
  ["教操作", "教判斷——操作會過時，判斷不會"],
];

const lessons = [
  {
    no: "第 1 堂",
    title: "總論：為什麼你需要這套東西",
    body: "搞清楚 AI 跟你的關係——它是你的鏡子，不是你的老師。你的想法歪，它只會跟著歪，而且不會告訴你。",
    deliver: "「我為什麼需要這套」的判斷地圖",
  },
  {
    no: "第 2 堂",
    title: "六七八（上）：把問題定義對",
    body: "多數決策失敗不是想錯，是題目選錯。這堂教你在動手前，先確認你要解的是不是正確的問題。",
    deliver: "一份自己真實決定的完整分析紀錄",
  },
  {
    no: "第 3 堂",
    title: "六七八（下）：做完整的決定",
    body: "資訊到齊之後，怎麼跑成一個完整、可追蹤、有邊界的決定。教你「找交集」而不是「二選一」。",
    deliver: "用新方法重新拆解一個你正在卡住的選擇",
  },
  {
    no: "第 4 堂",
    title: "思維防護：看穿自我欺騙",
    body: "不是教你每次都想對，是教你辨識「我現在可能在想歪」。十大思維病毒，先教你最常犯的三個。",
    deliver: "你最常犯的 2–3 個思維病毒清單＋解法",
  },
  {
    no: "第 5 堂",
    title: "信任架構：怎麼信 AI 又不被騙",
    body: "不逐句質疑（累死），也不全盤接受（被帶偏）。建立「有底線的信任」。",
    deliver: "你自己的信任地板設定（三條校準觸發條件）",
  },
  {
    no: "第 6 堂",
    title: "組隊寫守則：讓 AI 照你的標準輸出",
    body: "不靠單一 AI 看世界。當堂寫出一份能直接貼進 AI 使用的協作守則。",
    deliver: "你自己的 AI 協作守則 v1",
  },
  {
    no: "第 7 堂",
    title: "辨識 AI 失敗：不被唬住",
    body: "五種 AI 最常見、最難察覺的失敗模式——精緻討好、空洞安慰、表演懺悔、退場迴避、未查證評判。市面上幾乎沒人系統性地教這個。",
    deliver: "五種 AI 失敗辨識卡（症狀＋介入語句）",
  },
];

const faqs = [
  {
    q: "需要會寫程式嗎？",
    a: "不用。這門課教的是思維方法和判斷能力，不是技術操作。",
  },
  {
    q: "需要自備 AI 工具嗎？",
    a: "有免費的 ChatGPT、Claude 帳號就夠了。課堂上會用你自己跟 AI 的真實對話當素材。",
  },
  {
    q: "一對一怎麼排課？",
    a: "報名後加 LINE，直接跟我約時間。每週排一堂或兩堂都可以，按你的節奏走。",
  },
  {
    q: "一對二或一對三可以嗎？",
    a: "可以，朋友同行兩三人一起上沒問題。四人以上不接，因為時間內顧不到每個人。",
  },
  {
    q: "上完可以幹嘛？",
    a: "你會帶走一套自己做的東西：決策分析紀錄、思維病毒清單、信任地板設定、AI 協作守則。這些不是筆記，是你真的可以拿來用的工具。",
  },
  {
    q: "課程有期限嗎？",
    a: "購買後三個月內有效完課。若有需要，可申請延長一個月，限一次。",
  },
  {
    q: "可以退費嗎？",
    a: "因技術性問題（如排課困難、平台故障等非個人喜好因素）可申請退費。退費將扣除 NT$ 5,000 處理費及已提供之講義費用，剩餘依未完成課程時數按比例退還。因個人喜好不退費——建議報名前先把這頁看完，確認這是你要的。",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MomochaoSystemPage = () => {
  useSEO({
    title: "AI 時代的人生避險基金｜搞定自己和 AI 的工具箱（基礎課）",
    description:
      "市面上的 AI 課教你怎麼下 prompt。這門課教你怎麼不被 AI 帶偏——先搞定自己的判斷，再讓 AI 成為可靠的協作夥伴。7 堂一對一，每堂帶走一個能用的東西。",
    keywords: "默默超, 趙偉辰, AI 課程, 思維方法, 人機協作, 元壹體系, 基礎課",
    canonical: "https://chaos-life-compass.lovable.app/momochao-system",
    ogImages: [
      {
        url: "https://chaos-life-compass.lovable.app/og-momochao-system.jpg",
        alt: "AI 時代的人生避險基金｜搞定自己和 AI 的工具箱（基礎課） — 默默超元壹體系",
        width: 1200,
        height: 630,
        type: "image/jpeg",
      },
      {
        url: "https://chaos-life-compass.lovable.app/og-momochao-system-square.jpg",
        alt: "默默超元壹體系基礎課方形社群卡｜AI 時代的人生避險基金",
        width: 1080,
        height: 1080,
        type: "image/jpeg",
      },
      {
        url: "https://chaos-life-compass.lovable.app/og-momochao-system-vertical.jpg",
        alt: "默默超元壹體系基礎課直式手機分享卡｜AI 時代的人生避險基金 NT$ 29,999",
        width: 1080,
        height: 1920,
        type: "image/jpeg",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />

      {/* ① Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">基礎課｜一對一．7 堂</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-5">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                AI 時代的人生避險基金
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10">用對自己，搞定 AI</p>

            <div className="max-w-2xl mx-auto space-y-4 text-white/60 leading-relaxed text-base md:text-lg mb-10">
              <p>市面上的 AI 課教你怎麼下 prompt。</p>
              <p>
                這門課教你怎麼<span className="text-amber-300">不被 AI 帶偏</span>——先搞定自己的判斷，再讓 AI 成為可靠的協作夥伴。
              </p>
              <p>7 堂一對一，每堂帶走一個能用的東西。</p>
            </div>

            {/* 一分鐘了解：三欄資訊圖 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-12 text-left">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                  <X className="w-4 h-4" />
                  這門課不是什麼
                </div>
                <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                  <li>· 不是 prompt 技巧課</li>
                  <li>· 不是 AI 工具操作教學</li>
                  <li>· 不是「AI 會取代你的工作」恐嚇講座</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-amber-300 text-sm mb-4">
                  <Sparkles className="w-4 h-4" />
                  這門課是什麼
                </div>
                <ul className="space-y-2 text-white/80 text-sm leading-relaxed">
                  <li>· 一套讓你在 AI 時代不被帶偏的思維方法</li>
                  <li>· 教你怎麼定義問題、做完整決策、辨識 AI 在唬你</li>
                  <li>· 每堂有交付物，不是聽完就散</li>
                </ul>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                  <Package className="w-4 h-4" />
                  上完你帶走什麼
                </div>
                <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                  <li>· 一套自己的決策流程紀錄</li>
                  <li>· 一份你寫的 AI 協作守則</li>
                  <li>· 五種 AI 失敗模式的辨識能力</li>
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-10 h-12 text-base"
              >
                <a href="#pricing">立即報名</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ② 痛點屏 */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
          >
            你是不是也<span className="text-amber-400">這樣</span>？
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-white/70 text-sm md:text-base leading-relaxed"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 差異屏 */}
      <section className="py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
          >
            這門課跟別的 AI 課<span className="text-amber-400">差在哪</span>
          </motion.h2>

          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-2 bg-white/[0.04]">
              <div className="p-4 text-white/40 text-sm md:text-base font-medium">市面上的 AI 課</div>
              <div className="p-4 text-amber-300 text-sm md:text-base font-medium border-l border-white/10">這門課</div>
            </div>
            {compareRows.map(([a, b], i) => (
              <div key={i} className="grid grid-cols-2 border-t border-white/10">
                <div className="p-4 text-white/40 text-sm md:text-base leading-relaxed">{a}</div>
                <div className="p-4 text-white/85 text-sm md:text-base leading-relaxed border-l border-white/10 bg-amber-500/[0.04]">
                  {b}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-lg md:text-xl text-amber-300 mt-10 italic">
            別的課教你用 AI，這門課教你<span className="font-bold">不被 AI 用</span>。
          </p>
        </div>
      </section>

      {/* ④ 課程內容 */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
          >
            7 堂課你會<span className="text-amber-400">經歷什麼</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((l, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.04 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-colors"
              >
                <div className="text-amber-400/80 text-xs font-medium mb-2">{l.no}</div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-3">{l.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{l.body}</p>
                <div className="flex items-start gap-2 text-amber-300/90 text-xs pt-3 border-t border-white/5">
                  <Package className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>交付物：{l.deliver}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 講師屏 */}
      <section className="py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center"
          >
            <p className="text-amber-400/80 text-sm mb-3">這些東西誰做的</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10">趙偉辰（默默超）</h2>
          </motion.div>

          <div className="space-y-6 text-white/70 leading-relaxed text-base md:text-lg">
            <p>這套東西不是讀書整理出來的，是做出來的。</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              <div className="bg-white/[0.03] border border-amber-500/20 rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">13,156</div>
                <div className="text-white/50 text-xs">人機協作對話 turn</div>
                <div className="text-white/40 text-xs mt-1">糾偏率 3.26% / 討好率 1.64%</div>
              </div>
              <div className="bg-white/[0.03] border border-amber-500/20 rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">~1,400</div>
                <div className="text-white/50 text-xs">次跨域整合</div>
                <div className="text-white/40 text-xs mt-1">經雙系統驗證收斂</div>
              </div>
              <div className="bg-white/[0.03] border border-amber-500/20 rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">16 年</div>
                <div className="text-white/50 text-xs">品牌行銷與跨域實戰</div>
              </div>
            </div>

            <p>一份從 v1 寫到 v3 的人機協作方法論，一套經過多回合哲學攻防仍然站得住的思維框架。</p>
            <p className="text-white/85">
              我不以老師自居。這門課的姿態是分享觀察：把我看見的攤出來，附上來源和理由，你自己判斷要不要拿、拿哪些。
            </p>
            <p>
              <Link to="/about" className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">
                更多關於我 <ChevronRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ⑥ 定價屏 */}
      <section id="pricing" className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-amber-600/5 border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center"
          >
            <p className="text-amber-400/80 text-sm mb-2">基礎課</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">搞定自己和 AI 的工具箱</h2>
            <p className="text-white/40 text-sm mb-1">講師勞務費</p>
            <p className="text-white/40 text-base line-through mb-2">原價 NT$ 35,000</p>
            <div className="text-amber-400 text-xs font-medium mb-2 tracking-wider">上市優惠</div>
            <div className="text-5xl md:text-6xl font-bold text-white mb-2">
              NT$ <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">29,999</span>
            </div>
            <p className="text-white/50 text-sm mb-8">🔸 優惠期間：即日起至 2026 年 9 月 19 日止</p>

            <ul className="text-left max-w-sm mx-auto space-y-3 text-white/75 text-sm mb-10">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />7 堂一對一課程</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />每堂 60–90 分鐘</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />每堂有講義與交付物</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />一對一排課，按你的時間走</li>
            </ul>

            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-14 text-base"
            >
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
                LINE 報名 → @momochao
              </a>
            </Button>

            <div className="mt-10 pt-8 border-t border-white/10 text-left">
              <p className="text-white/60 text-sm leading-relaxed">
                <span className="text-amber-300 font-medium">想更深入？</span><br />
                基礎課教「怎麼用」，進階課教「怎麼想」。上完基礎、有興趣，可以繼續進階。
              </p>
              <p className="text-white/40 text-sm mt-2">
                → 進階課：IPO 你的思維系統<span className="text-white/30">（敬請期待）</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ⑦ FAQ */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
          >
            常見問題
          </motion.h2>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left text-white hover:text-amber-300 text-base md:text-lg">
                  Q：{f.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/65 leading-relaxed text-sm md:text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ⑧ 底部 CTA */}
      <section className="py-24 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-amber-500/[0.04]">
        <div className="container mx-auto text-center max-w-xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">準備好了？</p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-10 h-14 text-base"
            >
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
                加 LINE 報名 → @momochao
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default MomochaoSystemPage;
