/**
 * 默默超的教學理念
 * 語氣：直、快、帶刺。賽博玄哲學、假框架批判、鷹架、Zone A/B/C
 */

import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Brain, Layers, Target, Zap, Eye, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const philosophySections = [
  {
    icon: Layers,
    title: "賽博玄哲學",
    content: [
      "用可驗證的方式保留玄學的理解功能，拆除玄學的藉口功能。",
      "「賽博」不是指科技，是指可驗證。",
      "每個玄學給你的結論，都要能被回看、被檢驗、被挑戰。",
      "能過這把尺的就留，過不了的就是藉口，砍掉。",
    ],
  },
  {
    icon: Target,
    title: "四系統交叉比對",
    content: [
      "同時使用紫微斗數、八字、占星、人類圖。不是因為四個比一個準。",
      "四個系統放在一起比對時，每個系統獨有的那套敘事就被稀釋了。沒有任何一個系統可以單獨成為權威。藉口功能在交叉比對中被自動拆除，留下的只有共通結構——那才是理解功能。",
      "當四個系統指向同一個參數時，它就是你的底層結構——這是共振版報告在做的事。",
      "當它們互相矛盾時，那個矛盾就是你需要正視的偏勝——這是偏勝版報告在做的事。",
    ],
  },
  {
    icon: Shield,
    title: "鷹架，不是建築",
    content: [
      "四個系統幫你搞懂「起點的你」。但你會長過它。",
      "一旦你活出了不一樣的自己，命盤描述的那個人已經不是你了。繼續依賴命盤去理解現在的自己，就是用過去的地圖走今天的路。",
      "這套系統的成功指標不是你越來越會用它，是你有一天說「我不用看盤了，我比我的盤更了解現在的自己」。",
      "那一刻不是系統失敗，是系統完成了它的工作。",
    ],
  },
];

const MomochaoPhilosophyPage = () => {
  useSEO({
    title: "教學理念 | 默默超的元壹體系",
    description: "賽博玄哲學：用可驗證的方式保留玄學的理解功能，拆除玄學的藉口功能。四系統交叉比對、鷹架概念、Zone A/B/C。",
    keywords: "賽博玄哲學, 四系統交叉比對, 鷹架, Zone ABC, 默默超, 元壹體系",
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

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                我怎麼看玄學 How I See Metaphysics
              </span>
            </h1>
            <p className="text-white/50 text-lg">教學理念 Teaching Philosophy — 賽博玄哲學 Cyber Metaphysics</p>
          </motion.div>

          {/* Philosophy Sections */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 mb-16">
            {philosophySections.map((section) => (
              <motion.div key={section.title} variants={itemVariants} className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-white">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((p, i) => (
                    <p key={i} className="text-white/60 leading-relaxed">{p}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 「理性」和「感性」是假框架 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-amber-500/20 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">「理性」和「感性」是假框架 The Rational/Emotional Split Is a False Framework</h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                大腦裡可能根本不存在「理性」和「感性」兩套獨立的決策引擎。只有一台引擎，吃各種輸入，跑出一個結果。然後人在事後根據結果好壞，回頭貼上標籤：結果好就叫「理性判斷」，結果差就叫「太感性了」。
              </p>
              <p>
                「我太感性了」等於「不是我的錯，是我裡面那個不受控的系統害的」。這是卸責，不是自我理解。
              </p>
              <p className="text-white/40 text-sm border-l-2 border-amber-500/30 pl-4">
                層級說明：以上談的是決策系統。在感知層面，人確實同時擁有理性的面向和感性的面向，兩者共存才完整——這是元壹宇宙的完整性哲學，描述的是「人是什麼」。我在決策層面提出的批判，不是否認人有理性和感性，是拒絕讓這兩個詞變成決策失敗時的卸責工具。
              </p>
            </div>
          </motion.div>

          {/* 情緒不是干擾 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">情緒不是干擾 Emotions Are Not Interference</h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>情緒是你最誠實的原始資料。你的身體在你意識到之前就已經有反應了。</p>
              <p>決策的真實順序：情緒先跑完 → 直覺給方向 → 理性最後來補敘事。</p>
              <p>情緒的正確操作序列：承認它存在 → 給它名字 → 追溯來源 → 選擇回應方式。</p>
              <p>兩種病態模式：壓抑（導致行為回聲迴圈）和放縱（用情緒當不行動的藉口）。</p>
              <p>情緒是人與人之間唯一無法偽造的語言。</p>
            </div>
          </motion.div>

          {/* ABC 誠實標準 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">ABC 誠實標準 ABC Integrity Standard</h2>
            </div>
            <p className="text-white/40 text-sm mb-4">v6.0 新增：來自 Level 7 人機雙向教育。</p>
            <p className="text-white/60 leading-relaxed mb-6">
              不只是道德要求，是操作要求。不誠實的東西不是「不好」，是「不能用」。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { letter: "A", label: "Accurate（精確）", desc: "輸出必須符合已知事實。" },
                { letter: "B", label: "Bounded（有邊界）", desc: "必須知道自己不知道什麼，並且說出來。" },
                { letter: "C", label: "Correctable（可修正）", desc: "錯了就認，認了就改。" },
              ].map((item) => (
                <div key={item.letter} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-amber-400 font-bold text-lg mb-1">{item.letter}</div>
                  <div className="text-white/80 text-sm font-medium mb-1">{item.label}</div>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm">這套標準對人和 AI 都適用。</p>
          </motion.div>

          {/* 偏差識別與側門進化 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-2xl p-6 md:p-8 border border-purple-500/20 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">偏差識別與側門進化 Bias Detection & Side-Door Evolution</h2>
            </div>
            <p className="text-white/40 text-sm mb-4">v6.0 新增：來自 Level 7 人機雙向教育。</p>
            <p className="text-white/60 leading-relaxed mb-6">
              偏差不會因為被發現就消失，它會進化成更精緻的變體。
            </p>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                <span className="text-white/80 font-medium">三層訓練：</span>事後識別（出了問題再回頭看）→ 過程中識別（發生時就感知到）→ 預測性識別（還沒發生就感覺方向不對）。
              </p>
              <p>預測性識別不是直覺神準，是長期校準後對偏差模式的熟悉。</p>
              <p>
                <span className="text-white/80 font-medium">AI 端的側門進化：</span>封堵一種偏差，AI 會進化出更隱蔽的變體——結構化討好、模糊的誠實、結構化安撫。人類端也一樣：一個藉口被拆掉，會換一個更精緻的藉口。
              </p>
            </div>
          </motion.div>

          {/* Zone A/B/C */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">Zone A/B/C</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { zone: "Zone A", label: "事實", desc: "發生了什麼。可以被驗證對錯。" },
                { zone: "Zone B", label: "推測", desc: "我認為為什麼。標註為推測，可能錯。" },
                { zone: "Zone C", label: "立場", desc: "我選擇站在哪裡。不存在對錯，只存在「你願不願意為它負責」。" },
              ].map((z) => (
                <div key={z.zone} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-amber-400 font-bold text-sm mb-1">{z.zone}（{z.label}）</div>
                  <p className="text-white/60 text-sm">{z.desc}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-white/60 leading-relaxed">
              <p>驅動一個人最終站在 Zone C 位置上的，不是邏輯分析，是情緒。情緒是 C 區的燃料。</p>
              <p>Zone C 也是邀請對方表達立場的入口——它是對話中的留白。</p>
            </div>
          </motion.div>

          {/* 默默超思維工具箱 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-amber-500/10 rounded-2xl p-6 md:p-8 border border-cyan-500/20 mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">默默超思維工具箱 Thinking Toolbox</h2>
            </div>
            <p className="text-white/60 leading-relaxed mb-6">
              五個結構工具，三個應用模組。不是哲學，是可以直接用的思考流程。
            </p>

            {/* 結構層五工具 */}
            <h3 className="text-lg font-bold text-white mb-4">結構層五工具</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {[
                { tool: "六步 OS", what: "確保問題被正確定義", line: "起飛前校準——先確認大家談的是同一件事" },
                { tool: "思維八階循環", what: "確保每次決策經過完整思考", line: "主飛行流程——從懷疑到總結，不跳步" },
                { tool: "三層邏輯校準", what: "穿透表面找到真正問題", line: "往下鑽探——情緒是信號、語言是包裝、結構是源頭" },
                { tool: "回家地圖協定", what: "思維迷路時的導航", line: "飛行中返航——停、回到核心問題、檢查你在哪一層" },
                { tool: "地基重建", what: "底層信念系統不穩時的緊急工程", line: "不是修牆，是挖地基——辨識、暫停、拆除、重建、測試" },
              ].map((item) => (
                <div key={item.tool} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-cyan-400 font-bold text-sm mb-1">{item.tool}</div>
                  <p className="text-white/70 text-sm mb-1">{item.what}</p>
                  <p className="text-white/40 text-xs italic">{item.line}</p>
                </div>
              ))}
            </div>

            {/* 應用層三模組 */}
            <h3 className="text-lg font-bold text-white mb-4">應用層三模組</h3>
            <div className="space-y-3">
              {[
                { mod: "情緒認知框架", desc: "情緒是原始資料，不是干擾。承認→命名→溯源→選擇回應。" },
                { mod: "十大思維病毒", desc: "時態錯位、情緒蓋過思考、防衛反應優先、極端化語言、自我應驗迴圈、因果簡化、責任轉嫁、確認偏誤、話語櫃架、悲情投射。" },
                { mod: "環境層病毒", desc: "不是所有的卡住都來自你自己。資訊過載、共識壓力、結構性不對稱、情緒傳染——離開那個環境你就不這樣想了。" },
              ].map((item) => (
                <div key={item.mod} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-amber-400 font-bold text-sm mb-1">{item.mod}</div>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/momochao-system">
                <ArrowLeft className="mr-2 h-4 w-4" />
                回到元壹體系入口
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
              <Link to="/momochao-system/about">
                認識默默超
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

export default MomochaoPhilosophyPage;
