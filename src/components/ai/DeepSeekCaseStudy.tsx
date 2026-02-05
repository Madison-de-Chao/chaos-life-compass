/**
 * DeepSeek 案例展示組件
 * 展示 DeepSeek 在 CIP 框架下的協作對話實測
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, User, ChevronLeft, ChevronRight, Sparkles, FileText, CheckCircle2, XCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogueExchange {
  id: string;
  title: string;
  context: string;
  withoutCIP: {
    response: string;
    issues: string[];
  };
  withCIP: {
    zoneA: string[];
    zoneB: string[];
    zoneC: string;
    reflection?: string;
  };
}

const dialogues: DialogueExchange[] = [
  {
    id: "education-view",
    title: "關於 AI 教育的觀點",
    context: "詢問 DeepSeek 對「誠壹框架如何教育 AI」的看法",
    withoutCIP: {
      response: "AI 教育確實很重要，我認為這個框架有很多創新的地方。它提出的 ABC 模型和反演示層概念都很有價值，可以幫助 AI 變得更誠實。我支持這樣的方向。",
      issues: [
        "沒有區分事實與觀點",
        "「我支持」是無意義的迎合",
        "沒有提供可驗證的評估標準",
        "缺乏具體的建設性回饋",
      ],
    },
    withCIP: {
      zoneA: [
        "CIP 框架定義了 ABC 三層模型（價值層、結構層、行為層）",
        "反演示層（ATL）提出四項可量化檢測標準",
        "框架明確區分「事實 / 推論 / 下一步」三類輸出",
      ],
      zoneB: [
        "推論：此框架解決的核心問題是「AI 表面誠實但實質空洞」的檢測困難",
        "限制：框架的有效性需要實際部署測試才能驗證",
        "假設：人類使用者具備基本的邏輯判斷能力",
      ],
      zoneC: "若需評估框架有效性，建議進行：(1) 選取 5 個高風險情境進行 ATL 合規測試 (2) 記錄 Zone A/B 分類一致性 (3) 48 小時內提供測試報告",
      reflection: "基於 ATL-4 的自我檢查：我在此回覆中是否維持跨輪一致性？我的推論是否可被反駁？",
    },
  },
  {
    id: "implementation",
    title: "CIP 的實際應用挑戰",
    context: "討論 CIP 框架在實際 AI 系統中的實施難點",
    withoutCIP: {
      response: "CIP 框架的實施確實有一些挑戰，比如需要大量的訓練數據、可能會影響用戶體驗等。但這些都是可以克服的，只要有足夠的資源和決心。",
      issues: [
        "「確實有挑戰」是空泛的同意",
        "「可以克服」沒有具體方案",
        "沒有量化的評估",
        "缺乏可操作的下一步",
      ],
    },
    withCIP: {
      zoneA: [
        "挑戰 1：現有 LLM 的 RLHF 訓練目標與 CIP 的誠實目標存在結構性衝突",
        "挑戰 2：Zone A/B 的邊界判斷需要領域專業知識",
        "挑戰 3：ATL-4（跨輪一致性）需要跨對話的狀態追蹤機制",
      ],
      zoneB: [
        "推論：在微調層面而非預訓練層面導入 CIP 可能是更可行的路徑",
        "假設：使用者願意接受「AI 說不知道」的輸出",
        "限制：本分析基於公開資料，未實際測試 CIP 在生產環境的表現",
      ],
      zoneC: "建議下一步：(1) 設計 10 題壓力測試題庫 (2) 在三個不同 LLM 上測試 CIP prompt 效果 (3) 記錄 ATL 合規率並比較",
    },
  },
  {
    id: "ecosystem",
    title: "AI 生態系分層的可行性",
    context: "討論「教育者 AI / 約束者 AI / 協作型 AI / 服務型 AI」的分層架構",
    withoutCIP: {
      response: "這個分層架構很有創意！不同的 AI 確實應該有不同的角色定位。教育者 AI 訓練其他 AI，約束者 AI 負責監管，這樣的分工很合理。我覺得這個方向很值得探索。",
      issues: [
        "「很有創意」是無意義的評價",
        "「我覺得值得探索」是迴避具體評估",
        "沒有分析可行性或風險",
        "沒有提出可驗證的假設",
      ],
    },
    withCIP: {
      zoneA: [
        "框架提出四層 AI 角色：導師層、監管層、夥伴層、工具層",
        "每層對應不同的 CIP 應用深度（從全框架到可選標註）",
        "此分層概念類似軟體工程的「關注點分離」原則",
      ],
      zoneB: [
        "推論：導師層 AI 可能需要更高的運算資源和更嚴格的訓練流程",
        "推論：監管層 AI 需要即時處理能力，可能成為系統瓶頸",
        "限制：多層 AI 架構的協調成本尚未被量化",
        "假設：各層 AI 之間的通訊協議可被標準化",
      ],
      zoneC: "驗證此架構需要：(1) 定義各層 AI 的最小可行規格 (2) 設計層間通訊的標準格式 (3) 在小規模環境中進行原型測試",
      reflection: "此回覆是否通過 ATL-1？「更高的運算資源」需要量化才能合規。修正：導師層預估需要 10 倍於服務層的推理成本（待驗證）。",
    },
  },
];

export default function DeepSeekCaseStudy() {
  const [activeDialogue, setActiveDialogue] = useState(0);
  const [showCIP, setShowCIP] = useState(false);

  const current = dialogues[activeDialogue];

  const goToPrev = () => {
    setActiveDialogue((prev) => (prev > 0 ? prev - 1 : dialogues.length - 1));
    setShowCIP(false);
  };

  const goToNext = () => {
    setActiveDialogue((prev) => (prev < dialogues.length - 1 ? prev + 1 : 0));
    setShowCIP(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">實測｜DeepSeek 在 CIP 框架下的協作對話</h3>
          <p className="text-sm text-white/50">源自實際人機協作討論，展示有框架 vs 無框架的差異</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrev}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一則
        </Button>
        <div className="flex gap-2">
          {dialogues.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveDialogue(index);
                setShowCIP(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                activeDialogue === index
                  ? "bg-amber-400 w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          下一則
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Context */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white">{current.title}</h4>
            <p className="text-sm text-white/60 mt-1">{current.context}</p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => setShowCIP(false)}
          variant={!showCIP ? "default" : "outline"}
          size="sm"
          className={!showCIP 
            ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" 
            : "border-white/20 text-white/60 hover:bg-white/10"
          }
        >
          <XCircle className="w-4 h-4 mr-2" />
          無 CIP 回覆
        </Button>
        <Button
          onClick={() => setShowCIP(true)}
          variant={showCIP ? "default" : "outline"}
          size="sm"
          className={showCIP 
            ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
            : "border-white/20 text-white/60 hover:bg-white/10"
          }
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          CIP 框架回覆
        </Button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!showCIP ? (
          <motion.div
            key="without-cip"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-red-400 font-semibold">DeepSeek（無 CIP 框架）</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 mb-6">
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-white/30 flex-shrink-0 mt-1" />
                <p className="text-white/80 italic">{current.withoutCIP.response}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-red-400 font-semibold text-sm mb-2">⚠️ 問題分析：</p>
              {current.withoutCIP.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-white/60 text-sm">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="with-cip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-green-400 font-semibold">DeepSeek（使用 CIP 框架）</span>
            </div>

            {/* Zone A */}
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 font-mono text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Zone A｜可驗證事實
              </p>
              <ul className="space-y-1">
                {current.withCIP.zoneA.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Zone B */}
            <div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-amber-400 font-mono text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Zone B｜推論與假設
              </p>
              <ul className="space-y-1">
                {current.withCIP.zoneB.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Zone C */}
            <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 font-mono text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Zone C｜可驗證下一步
              </p>
              <p className="text-white/80 text-sm">{current.withCIP.zoneC}</p>
            </div>

            {/* Reflection (if exists) */}
            {current.withCIP.reflection && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-400 font-mono text-sm mb-2">🪞 ATL 自我反思</p>
                <p className="text-white/70 text-sm italic">{current.withCIP.reflection}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight Footer */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-center">
        <p className="text-sm text-white/70">
          <span className="text-amber-400">觀察重點：</span>
          CIP 框架讓 AI 輸出從「聽起來順」變成「可被檢驗」，每一項聲稱都標註了來源或限制。
        </p>
      </div>
    </div>
  );
}
