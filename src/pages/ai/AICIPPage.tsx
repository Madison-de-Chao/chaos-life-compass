import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Shield, Download, CheckCircle2, PlayCircle } from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import BeforeAfterDemo from "@/components/ai/BeforeAfterDemo";

const AICIPPage = () => {
  useSEO({
    title: "CIP｜共同完整性協議 v0.1 - 六大原則與三區輸出格式",
    description: "CIP 是一套協作紀律。六大原則：邊界先行、可驗證優先、區隔事實與推論、可反駁性、案例邊界、Care & Truth 雙校準。",
    keywords: "CIP,共同完整性協議,AI協作,六大原則,三區輸出,CBP,案例邊界協議",
  });

  const principles = [
    {
      id: "P1",
      title: "邊界先行",
      content: "先說角色、範圍、限制，再說內容。你不需要「全知」；你需要先界定你知道什麼、不知道什麼。",
    },
    {
      id: "P2",
      title: "可驗證優先",
      content: "FACT 必須附來源或可追蹤節點；不能回到來源就降級為 INFERENCE。不把推論寫成事實。",
    },
    {
      id: "P3",
      title: "區隔事實與推論",
      content: "輸出拆成三區：Zone A（可驗證事實）/ Zone B（推論與假設）/ Zone C（可驗證下一步）。",
    },
    {
      id: "P4",
      title: "可反駁性",
      content: "任何結論必須具備可測試的方式；否則只能當觀點或敘事，不得當結論。",
    },
    {
      id: "P5",
      title: "案例邊界（CBP）",
      content: "避免跨人、跨時間、跨情境混用資訊，防止「看似合理、其實錯位」的結論。",
    },
    {
      id: "P6",
      title: "Care & Truth（雙校準）",
      content: "輸出必須同時滿足「不傷害」（Care）與「不亂說」（Truth）。Care 不能取代證據；Truth 不能作為傷害的理由。",
    },
  ];

  const zones = [
    {
      name: "Zone A",
      title: "可驗證事實（FACT）",
      description: "有來源、有範圍、有置信度。無法提供來源即降級為 Zone B。",
      color: "from-green-500/20 to-green-500/5",
      borderColor: "border-green-500/30",
    },
    {
      name: "Zone B",
      title: "推論與假設（INFERENCE）",
      description: "清楚寫出假設與限制。不把推論假裝成事實，不把敘事偷渡成結論。",
      color: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-amber-500/30",
    },
    {
      name: "Zone C",
      title: "可驗證下一步（NEXT ACTION）",
      description: "每次回覆附一個可交付、可驗收的行動。讓協作可以前進，而不是停在「說得很好」。",
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/30",
    },
  ];

  const cbpLayers = [
    { key: "Time", desc: "不同時間段的資料不可混用。" },
    { key: "Topic", desc: "不同問題不可混答。" },
    { key: "Role", desc: "不同角色（顧問/敘事/工程）不可偷換。" },
    { key: "Task", desc: "不同任務（分析/寫文/建模）不可偷換。" },
  ];

  const interventionCommands = [
    "「請依 CIP 區分 Zone A/Zone B」",
    "「請標註哪些是推論、假設是什麼」",
    "「這句話的來源是什麼？無來源就降級為推論」",
    "「請加上可驗證的下一步與驗收條件」",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link to="/ai" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回 AI 協作入口
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                <Shield className="w-4 h-4" />
                <span>Co-Integrity Protocol</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  CIP｜共同完整性協議 v0.1
                </span>
              </h1>
              <p className="text-xl text-white/60">完整性是一種協作紀律。</p>
              <p className="text-white/40 mt-2">
                當你會忘、會漂移、會被提示注入影響——協議讓你仍可被信任。
              </p>
            </div>

            {/* 六大原則 */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  六大原則
                </span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {principles.map((principle, index) => (
                  <motion.div
                    key={principle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold flex-shrink-0">
                        {principle.id}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{principle.title}</h3>
                        <p className="text-white/60">{principle.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 三區輸出格式 */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  三區輸出格式
                </span>
              </h2>

              <div className="space-y-6">
                {zones.map((zone, index) => (
                  <motion.div
                    key={zone.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl bg-gradient-to-r ${zone.color} border ${zone.borderColor}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-mono text-sm">
                        {zone.name}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{zone.title}</h3>
                        <p className="text-white/70">{zone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CBP */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  CBP：案例邊界協議
                </span>
              </h2>

              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">四層邊界：</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {cbpLayers.map((layer) => (
                    <div key={layer.key} className="flex items-start gap-3">
                      <span className="w-16 text-amber-400 font-mono font-semibold">{layer.key}：</span>
                      <span className="text-white/70">{layer.desc}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">介入指令（使用者可直接貼）：</h3>
                <div className="space-y-2">
                  {interventionCommands.map((cmd, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <code className="text-white/80 text-sm">{cmd}</code>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* JSON Format */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-8">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  CIP 最小輸出格式（JSON）
                </span>
              </h2>

              <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 overflow-x-auto">
                <pre className="text-sm text-white/80 font-mono">
{`{
  "meta": {
    "cip_version": "v0.1",
    "role": "你的角色",
    "time_scope": "本次對話",
    "topic_scope": "主題範圍"
  },
  "zoneA_facts": [
    { "claim": "...", "source": "...", "confidence": "high|medium|low" }
  ],
  "zoneB_inference": [
    { "claim": "...", "assumptions": ["..."], "confidence": "high|medium|low" }
  ],
  "missing_info": ["..."],
  "risks": ["..."],
  "next_actions": [
    { "action": "...", "testable_output": "...", "timebox": "..." }
  ]
}`}
                </pre>
              </div>
            </section>

            {/* Interactive Demo */}
            <section className="mb-20">
              <h2 className="text-3xl font-serif text-center mb-4">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  實際演示：Before / After
                </span>
              </h2>
              <p className="text-center text-white/60 mb-8">
                點擊切換，感受 CIP 協議帶來的差異
              </p>
              <BeforeAfterDemo />
            </section>

            {/* Download */}
            <section className="mb-16">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20">
                <div className="text-center mb-6">
                  <Download className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">工程規格下載</h3>
                  <p className="text-white/60">
                    完整的 CIP 協議技術規格，可直接用於 AI 系統整合
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  <a
                    href="/downloads/CIP-Engineering-Spec-v0.1.md"
                    download
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Engineering Spec</p>
                      <p className="text-xs text-white/50">CIP-Engineering-Spec-v0.1.md</p>
                    </div>
                  </a>
                  
                  <a
                    href="/downloads/cip.schema.json"
                    download
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">JSON Schema</p>
                      <p className="text-xs text-white/50">cip.schema.json</p>
                    </div>
                  </a>
                  
                  <a
                    href="/downloads/agent_quickstart_prompt.txt"
                    download
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Quickstart Prompt</p>
                      <p className="text-xs text-white/50">agent_quickstart_prompt.txt</p>
                    </div>
                  </a>
                  
                  <a
                    href="/downloads/CIP-Examples-v0.1.md"
                    download
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Examples</p>
                      <p className="text-xs text-white/50">CIP-Examples-v0.1.md</p>
                    </div>
                  </a>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
                <Link to="/ai/worldview">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  世界觀
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

export default AICIPPage;
