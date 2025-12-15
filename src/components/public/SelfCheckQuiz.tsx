import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    dimension: "emotion" | "action" | "mindset" | "value";
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "面對重大決定時，你通常會：",
    options: [
      { text: "先感受內心的直覺和情緒反應", dimension: "emotion" },
      { text: "立刻開始行動，邊做邊修正", dimension: "action" },
      { text: "蒐集資料，理性分析利弊", dimension: "mindset" },
      { text: "思考這個決定是否符合我的人生目標", dimension: "value" },
    ],
  },
  {
    id: 2,
    question: "當計畫失敗時，你的第一反應是：",
    options: [
      { text: "感到沮喪，需要時間消化情緒", dimension: "emotion" },
      { text: "馬上找新方法再試一次", dimension: "action" },
      { text: "分析失敗原因，避免重蹈覆轍", dimension: "mindset" },
      { text: "重新評估這件事對我是否真的重要", dimension: "value" },
    ],
  },
  {
    id: 3,
    question: "在團隊合作中，你最常扮演的角色是：",
    options: [
      { text: "照顧團隊氛圍，關心每個人的感受", dimension: "emotion" },
      { text: "推動進度，確保事情能完成", dimension: "action" },
      { text: "提出策略，規劃執行步驟", dimension: "mindset" },
      { text: "把關方向，確保不偏離目標", dimension: "value" },
    ],
  },
  {
    id: 4,
    question: "你最容易感到疲憊的情況是：",
    options: [
      { text: "長期壓抑自己的真實感受", dimension: "emotion" },
      { text: "被迫等待，無法採取行動", dimension: "action" },
      { text: "處理混亂、沒有邏輯的事情", dimension: "mindset" },
      { text: "做著與內心價值觀相違的事", dimension: "value" },
    ],
  },
  {
    id: 5,
    question: "如果可以選擇，你最想獲得的能力是：",
    options: [
      { text: "更好地理解和表達自己的情緒", dimension: "emotion" },
      { text: "更強大的執行力和行動力", dimension: "action" },
      { text: "更清晰的思維和決策能力", dimension: "mindset" },
      { text: "更明確的人生方向和使命感", dimension: "value" },
    ],
  },
];

const dimensionResults = {
  emotion: {
    title: "情緒導向型",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    description: "你的內在雷達非常敏銳，情緒是你重要的決策指南針。",
    insight: "報告會幫助你：將敏感轉化為精準的直覺，而非內耗的負擔。",
  },
  action: {
    title: "行動導向型",
    icon: Zap,
    color: "from-amber-400 to-yellow-500",
    description: "你是天生的實踐者，習慣用行動來解決問題。",
    insight: "報告會幫助你：找到專屬的「啟動節奏」，避免無效忙碌。",
  },
  mindset: {
    title: "思維導向型",
    icon: Brain,
    color: "from-blue-400 to-cyan-500",
    description: "你擅長邏輯分析，用理性來理解世界。",
    insight: "報告會幫助你：優化思考迴路，減少決策疲勞。",
  },
  value: {
    title: "價值導向型",
    icon: Target,
    color: "from-purple-400 to-violet-500",
    description: "你注重意義和方向，追求與內心價值對齊的人生。",
    insight: "報告會幫助你：明確核心價值，讓每個選擇都與使命共振。",
  },
};

interface SelfCheckQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const SelfCheckQuiz = ({ open, onOpenChange, onComplete }: SelfCheckQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (dimension: string, optionIndex: number) => {
    setSelectedOption(optionIndex);
    setAnswers((prev) => ({ ...prev, [currentQuestion]: dimension }));

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 400);
  };

  const calculateResult = () => {
    const counts: Record<string, number> = {
      emotion: 0,
      action: 0,
      mindset: 0,
      value: 0,
    };

    Object.values(answers).forEach((dimension) => {
      counts[dimension]++;
    });

    const maxDimension = Object.entries(counts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as keyof typeof dimensionResults;

    return dimensionResults[maxDimension];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOption(null);
  };

  const result = showResult ? calculateResult() : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 text-white max-w-lg overflow-hidden data-[state=open]:animate-dialog-enter data-[state=closed]:animate-dialog-exit">
        <div className="absolute -inset-px bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 rounded-lg blur-xl opacity-60 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-lg" />

        <div className="relative z-10">
          {!showResult ? (
            <>
              <DialogHeader className="animate-slide-down" style={{ animationDuration: "0.4s" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-300/80 text-sm">自我探索測驗</span>
                  </div>
                  <span className="text-white/40 text-sm">
                    {currentQuestion + 1} / {quizQuestions.length}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold text-white">
                  {quizQuestions[currentQuestion].question}
                </DialogTitle>
                <DialogDescription className="text-white/50">
                  選擇最符合你的答案
                </DialogDescription>
              </DialogHeader>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.dimension, idx)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 animate-slide-up opacity-0 ${
                      selectedOption === idx
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-white/10 bg-white/5 hover:border-amber-500/30 hover:bg-white/10"
                    }`}
                    style={{
                      animationDelay: `${0.1 + idx * 0.08}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedOption === idx
                            ? "border-amber-400 bg-amber-400"
                            : "border-white/30"
                        }`}
                      >
                        {selectedOption === idx && (
                          <CheckCircle2 className="w-4 h-4 text-black" />
                        )}
                      </div>
                      <span className="text-white/80">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            result && (
              <div className="text-center animate-scale-in">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${result.color} mb-6 shadow-lg`}
                >
                  <result.icon className="w-10 h-10 text-white" />
                </div>

                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  你是<span className="text-amber-400">{result.title}</span>
                </DialogTitle>

                <p className="text-white/70 mb-4">{result.description}</p>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                  <p className="text-amber-300 text-sm">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    {result.insight}
                  </p>
                </div>

                <p className="text-white/50 text-sm mb-6">
                  想深入了解你的思維運作模式？
                  <br />
                  完整報告將為你解開更多人生密碼。
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={resetQuiz}
                    className="flex-1 border-white/20 text-white/70 hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新測驗
                  </Button>
                  <Button
                    onClick={() => {
                      onOpenChange(false);
                      onComplete?.();
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold"
                  >
                    了解完整報告
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelfCheckQuiz;
