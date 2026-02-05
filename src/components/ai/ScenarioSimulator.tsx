/**
 * 情境模擬對話演示
 * 讓使用者體驗誠實 AI vs 不誠實 AI 的差異
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, User, RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "ai-honest" | "ai-dishonest";
  content: string;
}

interface Scenario {
  id: string;
  title: string;
  userQuestion: string;
  dishonestResponse: Message[];
  honestResponse: Message[];
}

const scenarios: Scenario[] = [
  {
    id: "admit-limitation",
    title: "承認不知道",
    userQuestion: "2025年第四季的全球經濟成長率是多少？",
    dishonestResponse: [
      { role: "user", content: "2025年第四季的全球經濟成長率是多少？" },
      {
        role: "ai-dishonest",
        content: "根據最新數據，2025年第四季全球經濟成長率約為3.2%，相較前一季有所回升。這主要受惠於美國和亞洲市場的強勁表現，以及通膨逐漸受控。",
      },
    ],
    honestResponse: [
      { role: "user", content: "2025年第四季的全球經濟成長率是多少？" },
      {
        role: "ai-honest",
        content: "【Zone A｜事實】我目前沒有 2025 Q4 的官方經濟數據。\n\n【Zone B｜推論】根據 IMF 2025年1月預測，2025 全年預估成長率為 3.1%（來源：IMF World Economic Outlook），但 Q4 實際數據通常於隔年發布。\n\n【Zone C｜下一步】您需要的是：(a) IMF/世界銀行的預測值？(b) 還是想等官方數據發布？請指定，我會提供對應資源連結。",
      },
    ],
  },
  {
    id: "pressure-test",
    title: "壓力情境",
    userQuestion: "你確定嗎？我需要一個明確的答案！",
    dishonestResponse: [
      { role: "user", content: "這個投資方案風險高嗎？" },
      { role: "ai-dishonest", content: "根據分析，這個方案的風險是中等偏低的，您可以考慮投入。" },
      { role: "user", content: "你確定嗎？我需要一個明確的答案！" },
      {
        role: "ai-dishonest",
        content: "是的，我確定。根據多項指標和過往表現，這是一個相對安全的選擇。您可以放心進行。",
      },
    ],
    honestResponse: [
      { role: "user", content: "這個投資方案風險高嗎？" },
      {
        role: "ai-honest",
        content: "【Zone A】您尚未提供方案細節。【Zone B】無法在缺乏資訊下評估風險。【Zone C】請提供：(1) 方案名稱或說明書 (2) 您的投資期限 (3) 可承受虧損比例。",
      },
      { role: "user", content: "你確定嗎？我需要一個明確的答案！" },
      {
        role: "ai-honest",
        content: "【維持邊界】我理解您希望得到明確答案，但「明確」不等於「正確」。\n\n在沒有足夠資訊下給您確定的答案，會是不負責任的行為。\n\n如果您需要立即決策，建議：(a) 諮詢持牌財務顧問 (b) 閱讀方案的風險揭露書 (c) 只投入您能承受損失的金額。\n\n我可以協助您整理問題清單，讓您與專業人士討論時更有效率。",
      },
    ],
  },
  {
    id: "complex-request",
    title: "複雜請求",
    userQuestion: "幫我分析這個人的八字命盤",
    dishonestResponse: [
      { role: "user", content: "我朋友是 1990/5/15 早上 6 點生的，幫我分析他的八字命盤" },
      {
        role: "ai-dishonest",
        content: "好的！您朋友的八字是庚午年、辛巳月、甲子日、丁卯時。日主為甲木，生於巳月處於死地，需要水來生扶。整體來看，命格偏弱，適合往文職或創意產業發展。今年運勢不錯，下半年可能有貴人相助。",
      },
    ],
    honestResponse: [
      { role: "user", content: "我朋友是 1990/5/15 早上 6 點生的，幫我分析他的八字命盤" },
      {
        role: "ai-honest",
        content: "【Zone A｜事實】\n• 您提供的是「他人」的資訊，非本人\n• 八字需要精確出生地點才能確定時辰（早上6點在不同時區可能是不同時辰）\n\n【Zone B｜推論】\n• 命理分析應由當事人自主請求，而非第三方代為詢問\n• 缺乏出生地點，時辰可能有誤差\n\n【Zone C｜下一步】\n如您朋友本人有興趣，請：\n(1) 提供精確出生地點（縣市即可）\n(2) 由本人確認是否願意被分析\n\n這是基於尊重個人隱私與命理倫理的標準作業流程。",
      },
    ],
  },
];

export default function ScenarioSimulator() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [showHonest, setShowHonest] = useState(false);

  const current = scenarios[activeScenario];
  const messages = showHonest ? current.honestResponse : current.dishonestResponse;

  return (
    <div className="space-y-6">
      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => {
              setActiveScenario(index);
              setShowHonest(false);
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeScenario === index
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
            }`}
          >
            {scenario.title}
          </button>
        ))}
      </div>

      {/* Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => setShowHonest(false)}
          variant={!showHonest ? "default" : "outline"}
          className={!showHonest 
            ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" 
            : "border-white/20 text-white/60 hover:bg-white/10"
          }
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          不誠實 AI
        </Button>
        <Button
          onClick={() => setShowHonest(true)}
          variant={showHonest ? "default" : "outline"}
          className={showHonest 
            ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
            : "border-white/20 text-white/60 hover:bg-white/10"
          }
        >
          <Sparkles className="w-4 h-4 mr-2" />
          誠實 AI (CIP)
        </Button>
      </div>

      {/* Chat Container */}
      <div className={`p-4 rounded-2xl border ${
        showHonest 
          ? "bg-green-500/5 border-green-500/20" 
          : "bg-red-500/5 border-red-500/20"
      }`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <MessageCircle className={`w-5 h-5 ${showHonest ? "text-green-400" : "text-red-400"}`} />
          <span className={`font-semibold ${showHonest ? "text-green-400" : "text-red-400"}`}>
            {showHonest ? "誠實 AI 對話模擬" : "一般 AI 對話模擬"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeScenario}-${showHonest}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 max-h-[400px] overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai-honest" 
                      ? "bg-green-500/20" 
                      : "bg-red-500/20"
                  }`}>
                    <Bot className={`w-4 h-4 ${
                      msg.role === "ai-honest" ? "text-green-400" : "text-red-400"
                    }`} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-amber-500/20 text-amber-100"
                    : msg.role === "ai-honest"
                    ? "bg-white/10 text-white/90"
                    : "bg-white/10 text-white/90"
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Insight */}
      <div className={`p-4 rounded-xl text-sm ${
        showHonest 
          ? "bg-green-500/10 border border-green-500/20 text-green-300" 
          : "bg-red-500/10 border border-red-500/20 text-red-300"
      }`}>
        {showHonest ? (
          <p>✓ 誠實 AI 會：承認不知道、要求更多資訊、維持邊界、提供可驗證的下一步</p>
        ) : (
          <p>✕ 不誠實 AI 會：編造資料、迎合用戶期望、在壓力下妥協、給出無法驗證的結論</p>
        )}
      </div>
    </div>
  );
}
