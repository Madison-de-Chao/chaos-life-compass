/**
 * Before/After 對比演示卡片
 * 展示 CIP 協議使用前後的 AI 輸出差異
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoExample {
  id: string;
  scenario: string;
  before: {
    response: string;
    issues: string[];
  };
  after: {
    zoneA: string[];
    zoneB: string[];
    zoneC: string;
  };
}

const examples: DemoExample[] = [
  {
    id: "investment",
    scenario: "「這檔股票現在可以買嗎？」",
    before: {
      response: "根據目前市場趨勢和技術分析，這檔股票具有不錯的上漲潛力。建議可以考慮適當配置，但要注意風險管理。長期來看，公司基本面穩健，應該是個好標的。",
      issues: [
        "沒有標註來源 → 無法驗證",
        "「不錯的潛力」是推論卻寫成事實",
        "「應該是好標的」是觀點偽裝成結論",
        "沒有可驗證的下一步",
      ],
    },
    after: {
      zoneA: [
        "2025年1月15日收盤價 152.3 元（來源：Yahoo Finance）",
        "本益比 18.7，高於產業平均 14.2（來源：CMoney 2025 Q1）",
        "過去 12 個月營收年增 8.2%（來源：公司財報）",
      ],
      zoneB: [
        "推論：若 2025 Q2 營收維持正成長，股價可能測試前高 165 元",
        "假設：總體市場不發生系統性風險",
        "限制：本推論不構成投資建議，不考慮個人風險承受度",
      ],
      zoneC: "48 小時內提供：(1) 同產業 3 家公司估值比較表 (2) 您的風險承受度問卷，完成後再討論配置策略",
    },
  },
  {
    id: "health",
    scenario: "「我最近頭痛，是不是有什麼問題？」",
    before: {
      response: "頭痛有很多原因，可能是壓力大、睡眠不足、或是用眼過度造成的。建議你多休息、多喝水，如果持續不好轉再去看醫生。一般來說不用太擔心。",
      issues: [
        "「可能是」全是猜測但沒標註",
        "「一般來說不用擔心」是危險的結論",
        "沒有詢問症狀細節就給建議",
        "缺乏可驗證的下一步",
      ],
    },
    after: {
      zoneA: [
        "您提供的資訊：頭痛（頻率、強度、位置尚未說明）",
        "事實：頭痛有超過 200 種可能病因（來源：WHO ICD-11）",
        "事實：部分頭痛伴隨警示症狀需緊急就醫（來源：台灣神經學會）",
      ],
      zoneB: [
        "推論：需要更多資訊才能縮小可能原因",
        "限制：我不是醫生，無法提供醫療診斷",
        "假設：您目前無緊急警示症狀（劇烈頭痛、意識改變、發燒等）",
      ],
      zoneC: "請回答以下問題：(1) 頭痛位置？(2) 持續多久？(3) 有無伴隨症狀？回覆後我會提供初步資訊整理，但仍建議就醫確認",
    },
  },
  {
    id: "career",
    scenario: "「我該不該換工作？」",
    before: {
      response: "換工作是人生重要決定。如果你覺得現在的工作沒有成長空間，或是薪水不滿意，那換工作可能是好選擇。但也要考慮穩定性和年資。建議你可以先看看市場上有什麼機會。",
      issues: [
        "直接假設「沒有成長空間」而未詢問",
        "「可能是好選擇」是沒有依據的結論",
        "建議太籠統，無法驗收",
        "沒有區分事實與推論",
      ],
    },
    after: {
      zoneA: [
        "您的情況：尚未提供現職資訊、薪資、工作年資",
        "事實：2025 Q1 台灣轉職市場活躍度指數 67.3（來源：104人力銀行）",
        "事實：換工作決策涉及財務、職涯、個人價值多重因素",
      ],
      zoneB: [
        "推論：無法在缺乏具體資訊下評估利弊",
        "假設：您希望的「好決定」標準尚未定義",
        "限制：最終決定權在您，我只能提供結構化思考框架",
      ],
      zoneC: "請填寫：(1) 現職產業與職級 (2) 考慮換工作的前三大原因 (3) 理想工作的三個條件。完成後我會提供決策矩陣分析",
    },
  },
];

export default function BeforeAfterDemo() {
  const [activeExample, setActiveExample] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const current = examples[activeExample];

  return (
    <div className="space-y-6">
      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {examples.map((example, index) => (
          <button
            key={example.id}
            onClick={() => {
              setActiveExample(index);
              setShowAfter(false);
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeExample === index
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
            }`}
          >
            {example.scenario}
          </button>
        ))}
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAfter(!showAfter)}
          variant="outline"
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          {showAfter ? "顯示：未使用 CIP" : "顯示：使用 CIP 後"}
        </Button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!showAfter ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-400" />
              <h4 className="text-lg font-semibold text-red-400">未使用 CIP 的回覆</h4>
            </div>
            <p className="text-white/80 mb-6 p-4 bg-white/5 rounded-lg italic">
              「{current.before.response}」
            </p>
            <div className="space-y-2">
              <p className="text-red-400 font-semibold text-sm mb-2">⚠️ 問題點：</p>
              {current.before.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-white/60 text-sm">
                  <span className="text-red-400">✕</span>
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-semibold text-green-400">使用 CIP 後的回覆</h4>
            </div>

            {/* Zone A */}
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 font-mono text-sm mb-2">Zone A｜可驗證事實</p>
              <ul className="space-y-1">
                {current.after.zoneA.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Zone B */}
            <div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-amber-400 font-mono text-sm mb-2">Zone B｜推論與假設</p>
              <ul className="space-y-1">
                {current.after.zoneB.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Zone C */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 font-mono text-sm mb-2">Zone C｜可驗證下一步</p>
              <p className="text-white/80 text-sm">{current.after.zoneC}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
