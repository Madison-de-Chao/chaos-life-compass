/**
 * 銷售頁｜IPO 你的思維系統（進階課）
 * 路由：/momochao-system-advanced
 * 文案版本：v2 / 2026-06-20
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Check,
  Package,
  ChevronRight,
  Mail,
  MessageCircle,
  ArrowLeft,
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

const LINE_URL = "https://line.me/R/ti/p/@momochao";

const standingPoints = [
  "你用六七八做了幾個決定，發現有用——但碰到新情境，不確定能不能套。",
  "你寫了守則 v1，AI 確實變乖了——但它偶爾從你沒想到的側門繞回來，你不知道怎麼堵。",
  "你能辨識五種 AI 失敗了——但你想知道，能不能反過來設計一套讓它不犯的機制。",
  "你用得動工具，但說不出「為什麼是這個工具」——遇到別人質疑，你沒辦法從原理回應。",
];

const compareRows: [string, string][] = [
  ["六七八怎麼跑", "六步各防什麼失敗、順序為什麼不可逆"],
  ["寫守則 v1", "從規則抽出原則——規則沒覆蓋時也能回推"],
  ["辨識五種 AI 失敗", "設計讓 AI 不犯的協定"],
  ["信任地板怎麼設", "97/3 背後的根律：互惠不是人情，是法則"],
  ["堵思維病毒", "為什麼堵了一個它換形式回來（弧度與回返）"],
];

const lessons = [
  {
    no: "第 1 堂",
    title: "系統的地基：存在 → 定律 → 原則",
    body: "任何系統都需要一個最高原則。而一個系統有三層地基——存在、定律、原則。搞混它們，你會把描述當規範、把規範當描述。",
    deliver: "你的最高原則候選——你做判斷時最不願放棄的是什麼，以及它的來源",
  },
  {
    no: "第 2 堂",
    title: "工具的設計：為什麼這樣設計",
    body: "一個好工具是一串「各防一種失敗、順序不可逆」的步驟。學會這個框架，你能檢查任何工具有沒有漏防、順序對不對，也能設計自己的。",
    deliver: "設計或改造一個屬於你自己領域的決策工具",
  },
  {
    no: "第 3 堂",
    title: "無二：差異背後的統一",
    body: "思考扭曲最常從兩個地方進入：二元切割、偷換命題。「找交集」為什麼總是成立——因為差異不是最底層，統一才是。",
    deliver: "你最常犯的偷換與二元切割清單",
  },
  {
    no: "第 4 堂",
    title: "弧度與迭代：系統怎麼穩定地長大",
    body: "堵了一個漏洞，它換形式回來——這不是意外，是法則。一個活的系統要有可反駁條件和「堵 A 漏 B」的迭代機制。",
    deliver: "你的系統的可反駁條件，以及第一條迭代規則",
  },
  {
    no: "第 5 堂",
    title: "人機分工的根律",
    body: "任何協作都要定義三件事：信任的底線、互惠的結構、雙向的驗證。少了任何一件，協作會滑向依賴、剝削或對抗。",
    deliver: "你的協作底線——提供什麼、對方提供什麼、不能外包什麼、怎麼驗證",
  },
  {
    no: "第 6 堂",
    title: "從規則到原則",
    body: "規則封堵已知問題，原則處理未知問題。這堂教你怎麼從守則 v1 的一條條規則裡，抽出可回推的原則層。",
    deliver: "守則升級版——從規則抽出 3 句核心原則",
  },
  {
    no: "第 7 堂",
    title: "組裝系統：成為自己宇宙的主人",
    body: "把所有東西組裝起來：最高原則 → 法則 → 工具 → 協定 → 修正機制。一個系統最成熟的標誌，不是讓你永遠依賴它，是讓你最終不再需要它。",
    deliver: "你的認知系統 v0.1 藍圖",
  },
];

const faqs = [
  {
    q: "一定要先上完基礎課嗎？",
    a: "對。進階課的每一堂都對應基礎課的一堂，直接回答「為什麼」。沒有基礎的操作經驗，進階的原理會變成空談。",
  },
  {
    q: "跟基礎課的格式一樣嗎？",
    a: "一樣是一對一、每堂 60–90 分鐘、每堂有交付物。差別在於進階的交付物更抽象——不是寫守則，是設計原則；不是辨識失敗，是設計機制。",
  },
  {
    q: "上完進階可以幹嘛？",
    a: "你會有一份自己認知系統的 v0.1 藍圖。這不是別人的框架，是你自己從地基開始搭的。你可以繼續迭代它，也可以用它來設計自己的工具和協定。",
  },
  {
    q: "基礎課和進階課可以一起報嗎？",
    a: "可以。14 堂合售 NT$ 49,999（原價 70,000），省近一萬。加 LINE 報名即可。",
  },
  {
    q: "課程有期限嗎？",
    a: "購買後三個月內有效完課。若有需要，可申請延長一個月，限一次。",
  },
  {
    q: "可以退費嗎？",
    a: "因技術性問題（如排課困難、平台故障等非個人喜好因素）可申請退費。退費將扣除 NT$ 5,000 處理費及已提供之講義費用，剩餘依未完成課程時數按比例退還。因個人喜好不退費。",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MomochaoSystemAdvancedPage = () => {
  useSEO({
    title: "IPO 你的思維系統｜進階課（默默超元壹體系）",
    description:
      "基礎課教你怎麼用，這門課教你怎麼想。7 堂一對一，從規則抽出原則、從工具設計到組裝你自己的認知系統 v0.1 藍圖。",
    keywords: "默默超, 趙偉辰, 進階課, 思維系統, IPO, 元壹體系, 認知系統, 人機協作",
    canonical: "https://chaos-life-compass.lovable.app/momochao-system-advanced",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PublicHeader />

      {/* ① Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">進階課｜一對一．7 堂</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-5">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                IPO 你的思維系統
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10">
              基礎課教你怎麼用，這門課教你怎麼想
            </p>

            <div className="max-w-2xl mx-auto space-y-4 text-white/60 leading-relaxed text-base md:text-lg mb-10">
              <p>你已經會用工具了——六七八、守則、信任地板、辨識 AI 失敗。</p>
              <p>
                但你有沒有想過：為什麼偏偏是這六步？為什麼堵了一個漏洞它換形式回來？為什麼 97/3 是對的比例？
              </p>
              <p>
                進階課回答這些<span className="text-amber-300">「為什麼」</span>，然後讓你自己能設計工具、建系統。
              </p>
            </div>

            <div className="mt-8">
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

      {/* ② 你現在站在哪裡 */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-4"
          >
            你現在<span className="text-amber-400">站在哪裡</span>
          </motion.h2>
          <p className="text-center text-white/45 text-sm mb-12">會用，是使用者。知道為什麼，是架構師。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standingPoints.map((p, i) => (
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
          <p className="text-center text-lg md:text-xl text-amber-300 mt-10 italic">
            會用，是使用者。<span className="font-bold">知道為什麼，是架構師。</span>
          </p>
        </div>
      </section>

      {/* ③ 對照表 */}
      <section className="py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
          >
            基礎 vs <span className="text-amber-400">進階</span>
          </motion.h2>

          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-2 bg-white/[0.04]">
              <div className="p-4 text-white/40 text-sm md:text-base font-medium">基礎課（怎麼用）</div>
              <div className="p-4 text-amber-300 text-sm md:text-base font-medium border-l border-white/10">
                進階課（怎麼想）
              </div>
            </div>
            {compareRows.map(([a, b], i) => (
              <div key={i} className="grid grid-cols-2 border-t border-white/10">
                <div className="p-4 text-white/45 text-sm md:text-base leading-relaxed">{a}</div>
                <div className="p-4 text-white/85 text-sm md:text-base leading-relaxed border-l border-white/10 bg-amber-500/[0.04]">
                  {b}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-white/70 mt-10 leading-relaxed">
            <span className="text-amber-300 font-medium">進階課的終點：</span>
            你產出自己認知系統的 v0.1 藍圖——最高原則、法則、工具、修正機制，一套自洽的東西。
          </p>
        </div>
      </section>

      {/* ④ 7 堂課 */}
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

      {/* ⑤ 講師 */}
      <section className="py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-amber-400/80 text-sm mb-3">講師</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">趙偉辰（默默超）</h2>
            <p className="text-white/65 leading-relaxed text-base md:text-lg mb-6">
              同一個人，同一套方法論。基礎課教工具，進階課教工具背後的設計原理。
            </p>
            <Link
              to="/about"
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              更多關於我 <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ⑥ 定價 */}
      <section id="pricing" className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
          >
            <span className="text-amber-400">選擇</span>你的方案
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 進階課單售 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-amber-600/5 border border-amber-500/30 rounded-3xl p-8 md:p-10 text-center flex flex-col"
            >
              <p className="text-amber-400/80 text-sm mb-2">進階課</p>
              <h3 className="text-2xl font-serif font-bold mb-6">IPO 你的思維系統</h3>
              <p className="text-white/40 text-sm mb-1">講師勞務費</p>
              <p className="text-white/40 text-base line-through mb-2">原價 NT$ 35,000</p>
              <div className="text-amber-400 text-xs font-medium mb-2 tracking-wider">上市優惠</div>
              <div className="text-5xl font-bold text-white mb-2">
                NT$ <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">29,999</span>
              </div>
              <p className="text-white/50 text-sm mb-8">🔸 即日起至 2026 年 9 月 19 日止</p>

              <ul className="text-left max-w-sm mx-auto space-y-3 text-white/75 text-sm mb-6 flex-1">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />7 堂一對一課程</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />每堂 60–90 分鐘</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />每堂有交付物</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />一對一排課，按你的時間走</li>
              </ul>

              <p className="text-white/55 text-xs mb-6 px-2 py-2 rounded-lg bg-white/[0.03] border border-white/10">
                <span className="text-amber-300">前置條件：</span>需先完成基礎課（搞定自己和 AI 的工具箱）
              </p>

              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-14 text-base"
              >
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
                  LINE 報名 → @momochao
                </a>
              </Button>
            </motion.div>

            {/* 合售 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-amber-600/10 border-2 border-amber-400/50 rounded-3xl p-8 md:p-10 text-center flex flex-col shadow-[0_0_60px_-15px_rgba(245,158,11,0.4)]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold tracking-wider">
                還沒上過基礎課？
              </div>
              <p className="text-amber-300 text-sm mb-2">基礎 + 進階 合售</p>
              <h3 className="text-2xl font-serif font-bold mb-6">14 堂一次到位</h3>
              <p className="text-white/40 text-sm mb-1">講師勞務費</p>
              <p className="text-white/40 text-base line-through mb-2">原價 NT$ 70,000</p>
              <div className="text-amber-400 text-xs font-medium mb-2 tracking-wider">合售優惠</div>
              <div className="text-5xl font-bold text-white mb-2">
                NT$ <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">49,999</span>
              </div>
              <p className="text-white/50 text-sm mb-8">🔸 即日起至 2026 年 9 月 19 日止</p>

              <ul className="text-left max-w-sm mx-auto space-y-3 text-white/85 text-sm mb-6 flex-1">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />基礎 7 堂 ＋ 進階 7 堂，共 14 堂</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />每堂 60–90 分鐘</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />每堂有講義與交付物</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />一對一排課，按你的時間走</li>
              </ul>

              <Link
                to="/momochao-system"
                className="text-amber-300 hover:text-amber-200 text-xs mb-4 inline-flex items-center justify-center gap-1"
              >
                了解基礎課：搞定自己和 AI 的工具箱 <ChevronRight className="w-3 h-3" />
              </Link>

              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold h-14 text-base"
              >
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
                  LINE 報名 → @momochao
                </a>
              </Button>
            </motion.div>
          </div>
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

      {/* ⑧ 聯絡 */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-4"
          >
            聯絡與報名
          </motion.h2>
          <p className="text-center text-white/50 text-sm mb-12 max-w-xl mx-auto">
            有任何問題歡迎直接聯繫，我會親自回覆。回覆時間通常在一個工作天內。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 transition-all active:scale-97"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-1">LINE</h3>
              <p className="text-amber-400 text-sm font-medium mb-2">@momochao</p>
              <p className="text-white/50 text-sm">課程報名、預約排課最快的方式</p>
            </a>

            <a
              href="mailto:service@momo-chao.com"
              className="group bg-white/[0.03] border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 transition-all active:scale-97"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-1">Email</h3>
              <p className="text-amber-400 text-sm font-medium mb-2">service@momo-chao.com</p>
              <p className="text-white/50 text-sm">課程諮詢、企業合作與其他問題</p>
            </a>
          </div>
        </div>
      </section>

      {/* ⑨ 底部 CTA */}
      <section className="py-24 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-amber-500/[0.04]">
        <div className="container mx-auto text-center max-w-xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">準備好了？</p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-10 h-14 text-base mb-8"
            >
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
                加 LINE 報名 → @momochao
              </a>
            </Button>
            <div>
              <Link
                to="/momochao-system"
                className="text-white/50 hover:text-amber-300 text-sm inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> 回到基礎課銷售頁
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default MomochaoSystemAdvancedPage;
