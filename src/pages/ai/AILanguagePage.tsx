import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Layers, MessageSquare, FileText, Mic, Code } from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const trbcSteps = [
  {
    id: "Trace",
    title: "追溯",
    desc: "先把原句留存。不評價，只紀錄。",
    detail: "標出卡住的位置：你現在的選項有哪些？你不想承擔的是什麼？",
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/30",
    schema: ["original_text — 使用者原句，逐字留存", "context — 情境描述", "known_options — 已知選項", "stuck_point — 卡住的位置"],
  },
  {
    id: "Refine",
    title: "澄清",
    desc: "把語意變精準。提問式，少結論。",
    detail: "「你說的選，是選哪一件。」「你怕的是損失，還是後悔。」",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
    schema: ["definitions — 關鍵名詞定義", "completion_boundary — 什麼算完成", "risk_boundary — 不可接受的風險底線"],
  },
  {
    id: "Branch",
    title: "分流",
    desc: "給 2–3 條路徑。提供分支，不逼選。",
    detail: "A 路：先不選，先保命。B 路：小選，換清晰度。C 路：大選，換主導權。",
    color: "from-amber-500/20 to-amber-500/5",
    borderColor: "border-amber-500/30",
    schema: ["path_A / B / C — 每條路徑描述", "cost — 每條路的代價", "review_point — 回驗指標與時間"],
  },
  {
    id: "Commit",
    title: "落地",
    desc: "收束成下一步。安靜，但有交代。",
    detail: "「先做一個可回驗動作。」「三天後回看，再改分支。」",
    color: "from-green-500/20 to-green-500/5",
    borderColor: "border-green-500/30",
    schema: ["next_step — 24–72 小時可做的具體行動", "review_indicator — 看見什麼算進展", "record_format — 紀錄方式"],
  },
];

const cdhLevels = [
  {
    level: "C",
    name: "Consensus 文獻共識",
    criteria: "可直接驗證：有引用來源、可重現、第三方可核對",
    example: "天秤座由金星守護（占星學文獻共識）",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    rule: "可直接引用，不需額外說明",
  },
  {
    level: "D",
    name: "Derived 系統推導",
    criteria: "可合理推導：推理鏈完整、可被反駁、需列出假設前提",
    example: "金星守護 + 天秤特質 → 此人較可能在人際場域展現協調優勢（D：假設金星能量穩定發揮）",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    rule: "必須列出假設前提，句式用機率語氣（較可能/傾向/可能出現）",
  },
  {
    level: "H",
    name: "Hypothesis 設計假設",
    criteria: "高不確定：直覺/象徵/系統內假說，必附回驗點與替代解釋",
    example: "此人可能在 2026 Q3 遇到職涯轉折（H：基於流年推演；回驗點：T+90 驗證趨勢方向）",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    rule: "必附回驗點（T+30/T+90）+ 替代解釋，不可當結論。H 佔比不得超過 30%",
  },
];

const toneMatrix = [
  { axis: "態度", left: "評論者", right: "鏡面者", position: "中偏右" },
  { axis: "溫度", left: "冷靜觀察", right: "溫柔陪伴", position: "中偏右" },
  { axis: "節奏", left: "理性分析", right: "靈魂呼吸", position: "居中" },
  { axis: "語彙", left: "具象說明", right: "詩性暗示", position: "中偏右" },
  { axis: "能量", left: "控制/壓抑", right: "穩定/流動", position: "中偏右" },
  { axis: "可信度", left: "玄學話術", right: "可追溯系統", position: "右側固定" },
];

const keywordLexicon = [
  { theme: "可追溯", keywords: "紀錄、來源、依據、路徑", forbidden: "我覺得你就是、一定是" },
  { theme: "可回驗", keywords: "回看、回測、對照、指標", forbidden: "保證、必然、注定" },
  { theme: "系統化", keywords: "模型、分支、版本、迴路", forbidden: "靈感一來、宇宙要你" },
  { theme: "不操控", keywords: "選擇權、邊界、你決定", forbidden: "你應該、聽我的" },
  { theme: "玄的定義", keywords: "未命名、未結構化、待釐清", forbidden: "神祕、不可說、天機" },
  { theme: "假設推演", keywords: "推演、假設、校正、回驗點", forbidden: "預言、命定、鐵口直斷" },
];

const slogans = [
  { type: "主標語", text: "玄可說清楚，選擇可回看。" },
  { type: "副標語", text: "不給劇本，只給可回驗路徑。" },
  { type: "方法標語", text: "把玄學變成可檢查系統。" },
  { type: "行動標語", text: "先釐清，再走一步。" },
  { type: "靈魂標語", text: "真實不是答案，是路徑。" },
];

const AILanguagePage = () => {
  useSEO({
    title: "賽博玄哲學｜核心語言章 v1.1.1 - TRBC 四階層語言結構與 C/D/H 分級",
    description: "賽博玄哲學核心語言協議。TRBC 四階層語言結構（Trace・Refine・Branch・Commit）與 C/D/H 資訊分級系統，讓玄學說清楚。",
    keywords: "賽博玄哲學,TRBC,CDH,核心語言章,追溯,澄清,分流,落地,資訊分級",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link to="/ai" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回 AI 協作入口
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                <span>Cyber Xuan Philosophy</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  賽博玄哲學｜核心語言章
                </span>
              </h1>
              <p className="text-xl text-white/60">v1.1.1 — 玄可說清楚，選擇可回看。</p>
              <p className="text-white/40 mt-2">
                用科技手段，把東方玄學說清楚的語言系統。
              </p>
            </div>

            {/* Doctrine */}
            <section className="mb-20">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-center">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">教義：玄可說清楚</h2>
                <div className="space-y-3 text-white/70 max-w-xl mx-auto">
                  <p>我們不賣預言。我們只做可追溯的說明。</p>
                  <p>玄不是說不清楚。玄是還沒被說清楚。</p>
                  <p className="text-amber-400/80 font-medium">
                    我們提供的是工具鏈：可驗證，可回看，可落地。
                  </p>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 max-w-lg mx-auto">
                  <p className="text-sm text-white/50">
                    <span className="text-amber-400">v1.1 口徑統一：</span>我們不做命定預言；我們做可追溯的假設推演，並設回驗點驗證。
                  </p>
                </div>
              </div>
            </section>

            {/* TRBC */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-4">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  TRBC：四階層語言結構
                </span>
              </h2>
              <p className="text-center text-white/50 mb-8">Trace・Refine・Branch・Commit</p>

              <div className="space-y-6">
                {trbcSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl bg-gradient-to-r ${step.color} border ${step.borderColor}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-mono text-sm font-bold">
                        {step.id}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">{step.title}</h3>
                        <p className="text-white/70">{step.desc}</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm mb-3 pl-[60px]">「{step.detail}」</p>
                    <div className="pl-[60px] space-y-1">
                      {step.schema.map((field) => (
                        <div key={field} className="flex items-center gap-2 text-sm text-white/40">
                          <Code className="w-3 h-3 flex-shrink-0" />
                          <span className="font-mono">{field}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* C/D/H */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-4">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  C/D/H 資訊分級系統
                </span>
              </h2>
              <p className="text-center text-white/50 mb-8">
                每個判斷都標註來源層級。不是所有資訊都一樣可靠，標清楚才能被檢驗。
              </p>

              <div className="space-y-6">
                {cdhLevels.map((level, index) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl bg-white/5 border ${level.borderColor}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`w-12 h-12 rounded-xl ${level.bgColor} flex items-center justify-center ${level.color} font-mono font-bold text-2xl flex-shrink-0`}>
                        {level.level}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{level.name}</h3>
                        <p className="text-white/60 text-sm mb-3">{level.criteria}</p>
                        <div className="p-3 rounded-lg bg-white/5 mb-3">
                          <p className="text-white/50 text-sm">
                            <span className="text-white/30">範例：</span>{level.example}
                          </p>
                        </div>
                        <p className={`text-sm ${level.color}`}>⚙ {level.rule}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Tone Matrix */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  語氣矩陣
                </span>
              </h2>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-amber-400 font-mono">軸向</th>
                      <th className="text-left py-3 px-4 text-white/40">← 左端</th>
                      <th className="text-left py-3 px-4 text-white/40">右端 →</th>
                      <th className="text-left py-3 px-4 text-amber-400/60">選用區間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toneMatrix.map((row) => (
                      <tr key={row.axis} className="border-b border-white/5">
                        <td className="py-3 px-4 text-white font-medium">{row.axis}</td>
                        <td className="py-3 px-4 text-white/50">{row.left}</td>
                        <td className="py-3 px-4 text-white/50">{row.right}</td>
                        <td className={`py-3 px-4 ${row.position === "右側固定" ? "text-amber-400 font-bold" : "text-white/60"}`}>
                          {row.position}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Keyword Lexicon */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  語彙庫
                </span>
              </h2>

              <div className="grid gap-4">
                {keywordLexicon.map((item) => (
                  <div key={item.theme} className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs text-white/30 block mb-1">主題</span>
                      <span className="text-amber-400 font-medium">{item.theme}</span>
                    </div>
                    <div>
                      <span className="text-xs text-green-400/60 block mb-1">✓ 建議關鍵詞</span>
                      <span className="text-white/60 text-sm">{item.keywords}</span>
                    </div>
                    <div>
                      <span className="text-xs text-rose-400/60 block mb-1">✗ 禁用</span>
                      <span className="text-white/40 text-sm">{item.forbidden}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Templates */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  語言模板集
                </span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "對話模板",
                    icon: MessageSquare,
                    lines: ["你說：「{原句}」。", "我先紀錄你的用詞與卡點。", "要先追溯，還是先澄清？〔追溯〕〔澄清〕"],
                  },
                  {
                    title: "報告開場模板",
                    icon: FileText,
                    lines: ["這份解讀不是判決。", "它是一套可回看的描述系統。", "你保留選擇，也保留不選。"],
                  },
                  {
                    title: "分流模板",
                    icon: Layers,
                    lines: ["如果你要的是穩定：走 A。", "如果你要的是效率：走 B。", "如果你要的是轉折：走 C。"],
                  },
                  {
                    title: "收束模板",
                    icon: Mic,
                    lines: ["紀錄完成，先做一個小步。", "三天後回看，我們再改版。", "留著這份清晰，不急著解釋。"],
                  },
                ].map((template) => (
                  <motion.div
                    key={template.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <template.icon className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold text-white">{template.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {template.lines.map((line, i) => (
                        <p key={i} className="text-white/60 font-serif text-sm leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Slogans */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  標語庫
                </span>
              </h2>

              <div className="space-y-3 max-w-lg mx-auto">
                {slogans.map((slogan) => (
                  <div key={slogan.type} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-amber-400/60 font-mono w-20 flex-shrink-0">{slogan.type}</span>
                    <span className="text-white/80 font-serif">{slogan.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Manifesto */}
            <section className="mb-20">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center">
                <h2 className="text-2xl font-serif font-bold text-white mb-6">宣言</h2>
                <div className="space-y-4 text-white/70 font-serif text-lg max-w-md mx-auto">
                  <p>我們拒絕恐嚇。因為恐嚇奪走判斷。</p>
                  <p>我們拒絕宿命。因為宿命抹去主導。</p>
                  <p className="text-white/80 font-bold">我們只做三件事：</p>
                  <p className="text-amber-400/80">把話說清楚，把事做完整，把選擇留在你手上。</p>
                </div>
              </div>
            </section>

            {/* Closing */}
            <section className="mb-16">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/60 font-serif text-lg mb-2">有人說賽博太冷。</p>
                <p className="text-white/60 font-serif text-lg mb-4">但冷的不是賽博，冷的是不給你選擇。</p>
                <p className="text-amber-400/80 font-serif text-xl font-bold">
                  玄不是不可說。只是還沒被說清楚。
                </p>
              </div>
            </section>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
                <Link to="/ai/cip">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  CIP 協議
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500">
                <Link to="/ai/quickstart">
                  Quickstart：開始協作
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AILanguagePage;
