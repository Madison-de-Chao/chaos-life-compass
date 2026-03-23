import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, Sparkles, Heart, Brain, Shield, Zap,
  ArrowRight, RotateCcw, ChevronRight, Star,
  Target, Lightbulb, TreePine, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { useSEO } from "@/hooks/useSEO";

// --- Types ---
interface QuizOption {
  text: string;
  emoji: string;
  dimensions: Record<string, number>;
}

interface QuizQuestion {
  id: number;
  scenario: string;
  question: string;
  icon: React.ElementType;
  options: QuizOption[];
}

interface Recommendation {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  color: string;
  icon: React.ElementType;
  matchReason: string;
}

// --- Quiz Data ---
const questions: QuizQuestion[] = [
  {
    id: 1,
    scenario: "你站在一個岔路口。前方有三條路，沒有指示牌。",
    question: "你會怎麼做？",
    icon: Compass,
    options: [
      { text: "先停下來，感受哪條路讓我比較安心", emoji: "🌊", dimensions: { healing: 3, divination: 1 } },
      { text: "分析每條路的地形，找出最合理的方向", emoji: "🧠", dimensions: { logic: 3, bazi: 1 } },
      { text: "隨便選一條走，走錯了再回來就好", emoji: "🔥", dimensions: { action: 3, astrology: 1 } },
      { text: "先看看有沒有別人的腳印可以參考", emoji: "👁️", dimensions: { insight: 3, corporate: 1 } },
    ],
  },
  {
    id: 2,
    scenario: "你收到一份不太理想的工作評價，跟你的自我認知差距很大。",
    question: "你的第一反應是？",
    icon: Heart,
    options: [
      { text: "這讓我很不舒服，我需要時間消化情緒", emoji: "💧", dimensions: { healing: 3, astrology: 1 } },
      { text: "我想知道具體哪裡做得不好，有資料嗎？", emoji: "📊", dimensions: { logic: 2, bazi: 2 } },
      { text: "也許對方看到了我沒注意到的盲點", emoji: "🪞", dimensions: { insight: 3, divination: 1 } },
      { text: "無所謂，我知道自己的實力", emoji: "⚡", dimensions: { action: 2, corporate: 2 } },
    ],
  },
  {
    id: 3,
    scenario: "一個你信任的朋友做了讓你失望的事情。",
    question: "你會怎麼處理？",
    icon: Shield,
    options: [
      { text: "先理解為什麼他會這樣做，再決定怎麼回應", emoji: "🌱", dimensions: { insight: 3, astrology: 2 } },
      { text: "直接跟他談，把問題攤開來說清楚", emoji: "🗣️", dimensions: { action: 3, corporate: 1 } },
      { text: "退一步觀察，也許時間會讓事情明朗", emoji: "🌙", dimensions: { healing: 2, divination: 2 } },
      { text: "分析這段關係的本質，重新評估邊界", emoji: "📐", dimensions: { logic: 3, bazi: 1 } },
    ],
  },
  {
    id: 4,
    scenario: "你有一個很想實現的目標，但不知道從哪裡開始。",
    question: "你通常怎麼啟動？",
    icon: Target,
    options: [
      { text: "研究別人怎麼做到的，找出可複製的步驟", emoji: "🔍", dimensions: { logic: 2, corporate: 2 } },
      { text: "先問自己：這真的是我要的嗎？", emoji: "🎯", dimensions: { insight: 3, divination: 1 } },
      { text: "馬上行動，做了再說", emoji: "🚀", dimensions: { action: 3, bazi: 1 } },
      { text: "找一個懂的人聊聊，聽聽不同的看法", emoji: "🤝", dimensions: { healing: 1, astrology: 2, divination: 1 } },
    ],
  },
  {
    id: 5,
    scenario: "深夜，你一個人，腦子裡冒出一個揮之不去的問題。",
    question: "那個問題最可能是？",
    icon: Star,
    options: [
      { text: "「我到底是誰？我真正想要的是什麼？」", emoji: "✨", dimensions: { astrology: 3, insight: 2 } },
      { text: "「為什麼同樣的模式一直重複發生？」", emoji: "🔄", dimensions: { bazi: 3, healing: 1 } },
      { text: "「接下來我應該怎麼做？」", emoji: "🧭", dimensions: { divination: 3, action: 1 } },
      { text: "「我有沒有忽略什麼重要的事？」", emoji: "🔮", dimensions: { logic: 2, corporate: 1, insight: 1 } },
    ],
  },
];

// --- Recommendation Map ---
const recommendationMap: Record<string, Recommendation> = {
  divination: {
    title: "元壹占卜 YYDS",
    subtitle: "決策支援・直覺校準",
    description: "你需要的不是答案，而是把模糊的感覺轉換成可操作的選項。占卜幫你在關鍵時刻看清盲區。",
    href: "/games",
    color: "from-violet-500/30 to-purple-500/30",
    icon: Sparkles,
    matchReason: "你傾向用直覺做決策，占卜可以幫你把直覺量化",
  },
  bazi: {
    title: "四時人生八字兵法 RSBZS",
    subtitle: "結構盤點・長期策略",
    description: "你習慣用邏輯理解事情，八字幫你看到自己的底層設定——不是命定論，是操作手冊。",
    href: "/games",
    color: "from-amber-500/30 to-orange-500/30",
    icon: TreePine,
    matchReason: "你重視結構和規律，八字能幫你看見長期的節奏",
  },
  astrology: {
    title: "元壹宇宙神話占星 Mythic Astrology",
    subtitle: "身份解碼・潛意識探索",
    description: "你對「我是誰」這個問題有持續的好奇心。神話占星用故事的方式，讓你看見自己的多重面向。",
    href: "/games",
    color: "from-blue-500/30 to-cyan-500/30",
    icon: Star,
    matchReason: "你對自我認同和身份有深層的探索需求",
  },
  logic: {
    title: "默默超思維訓練 MMCLS",
    subtitle: "邏輯強化・判斷力提升",
    description: "你喜歡用腦子解決問題。思維訓練幫你升級判斷工具，讓分析力更精準、決策更快。",
    href: "/games",
    color: "from-emerald-500/30 to-green-500/30",
    icon: Brain,
    matchReason: "你的思維模式偏邏輯導向，訓練可以讓它更鋒利",
  },
  healing: {
    title: "弧度歸零 Arc Zero",
    subtitle: "情緒修復・經驗重整",
    description: "你對感受很敏感，這不是弱點——但需要出口。弧度歸零幫你處理卡住的情緒，讓經驗完成它的弧度。",
    href: "/games",
    color: "from-rose-500/30 to-pink-500/30",
    icon: Heart,
    matchReason: "你傾向先處理情緒再做決定，這裡幫你完成那個過程",
  },
  corporate: {
    title: "東方人因調查 EHFIS",
    subtitle: "團隊洞察・系統問題分析",
    description: "你善於觀察人際動態和系統性問題。東方人因調查幫你把直覺轉化為可執行的組織方案。",
    href: "/games",
    color: "from-slate-400/30 to-gray-500/30",
    icon: Lightbulb,
    matchReason: "你關注系統和人的互動，這個工具讓洞察變成方案",
  },
};

const secondaryRecommendations: Record<string, Recommendation> = {
  insight: {
    title: "默默超命理報告 Destiny Reports",
    subtitle: "四系統交叉比對・完整結構分析",
    description: "想要更完整的自我理解？旗艦報告用四套系統交叉驗證，給你一份可以反覆翻閱的個人操作手冊。",
    href: "/reports",
    color: "from-amber-500/30 to-yellow-500/30",
    icon: Target,
    matchReason: "你需要更全面的視角來理解自己",
  },
  action: {
    title: "AI 協作入口 AI Portal",
    subtitle: "人機協作・共誠協定",
    description: "你是行動派，AI 能幫你加速。但怎麼跟 AI 合作才不會踩坑？這裡有規則。",
    href: "/ai",
    color: "from-blue-500/30 to-indigo-500/30",
    icon: Zap,
    matchReason: "你重視效率和行動，AI 協作能幫你放大能力",
  },
};

// --- Helper ---
function calculateResults(answers: Record<number, number>): { primary: string; secondary: string; scores: Record<string, number> } {
  const scores: Record<string, number> = {};
  
  Object.entries(answers).forEach(([qIdx, aIdx]) => {
    const q = questions[parseInt(qIdx)];
    if (!q) return;
    const option = q.options[aIdx];
    if (!option) return;
    Object.entries(option.dimensions).forEach(([dim, val]) => {
      scores[dim] = (scores[dim] || 0) + val;
    });
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] || "divination";
  const secondary = sorted[1]?.[0] || "insight";
  
  return { primary, secondary, scores };
}

// --- Component ---
export default function DiscoverPage() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  useSEO({
    title: "探索你的路徑 Discover Your Path ｜默默超的元壹宇宙",
    description: "不知道從哪裡開始？五個情境題，幫你找到最適合的工具和方向。",
  });

  const handleAnswer = useCallback((optionIndex: number) => {
    const newAnswers = { ...answers, [currentQ]: optionIndex };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 400);
    } else {
      setTimeout(() => setShowResult(true), 600);
    }
  }, [answers, currentQ]);

  const handleReset = () => {
    setStarted(false);
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
  };

  const result = showResult ? calculateResults(answers) : null;
  const primaryRec = result ? recommendationMap[result.primary] : null;
  const secondaryRec = result ? (secondaryRecommendations[result.secondary] || recommendationMap[result.secondary]) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!started ? (
            <IntroSection key="intro" onStart={() => setStarted(true)} />
          ) : !showResult ? (
            <QuizSection
              key={`q-${currentQ}`}
              question={questions[currentQ]}
              currentQ={currentQ}
              total={questions.length}
              onAnswer={handleAnswer}
              selectedAnswer={answers[currentQ]}
            />
          ) : (
            <ResultSection
              key="result"
              primary={primaryRec!}
              secondary={secondaryRec}
              scores={result!.scores}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
      <PublicFooter />
    </div>
  );
}

// --- Intro ---
function IntroSection({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[80vh] flex items-center justify-center px-4"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-300 text-sm"
        >
          <Compass className="w-4 h-4" />
          <span>互動式路徑探索</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold font-serif leading-tight"
        >
          不知道從哪裡開始？
          <br />
          <span className="text-amber-400">讓我們幫你找到方向</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/60 leading-relaxed"
        >
          五個情境題，不需要專業知識，只需要誠實回答。
          <br />
          我們會根據你的回應，推薦最適合你現在狀態的工具。
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
          >
            開始探索
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-white/30"
        >
          大約需要 2 分鐘 ・ 沒有標準答案 ・ 隨時可以重來
        </motion.p>
      </div>
    </motion.section>
  );
}

// --- Quiz ---
function QuizSection({
  question,
  currentQ,
  total,
  onAnswer,
  selectedAnswer,
}: {
  question: QuizQuestion;
  currentQ: number;
  total: number;
  onAnswer: (idx: number) => void;
  selectedAnswer?: number;
}) {
  const Icon = question.icon;
  const progress = ((currentQ) / total) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[80vh] flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/40">
            <span>第 {currentQ + 1} 題，共 {total} 題</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
              initial={{ width: `${((currentQ) / total) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Scenario */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20">
              <Icon className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-white/50 text-sm">情境</p>
          </div>
          <p className="text-xl md:text-2xl text-white/80 font-serif leading-relaxed">
            {question.scenario}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white font-serif">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => onAnswer(idx)}
              disabled={selectedAnswer !== undefined}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-300 group
                ${selectedAnswer === idx
                  ? "border-amber-400/60 bg-amber-500/15 shadow-lg shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }
                ${selectedAnswer !== undefined && selectedAnswer !== idx ? "opacity-40" : ""}
                touch-manipulation active:scale-[0.98]
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{option.emoji}</span>
                <span className="text-base md:text-lg text-white/80 group-hover:text-white transition-colors leading-relaxed">
                  {option.text}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// --- Result ---
function ResultSection({
  primary,
  secondary,
  scores,
  onReset,
}: {
  primary: Recommendation;
  secondary: Recommendation | null | undefined;
  scores: Record<string, number>;
  onReset: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[80vh] flex items-center justify-center px-4 py-16"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto w-full space-y-10">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-300 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>分析完成</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif">
            你的推薦路徑
          </h2>
          <p className="text-white/50">
            根據你的回答，我們為你找到了最適合的起點
          </p>
        </motion.div>

        {/* Primary */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <RecommendationCard rec={primary} isPrimary />
        </motion.div>

        {/* Secondary */}
        {secondary && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-white/40 mb-3">你可能也會感興趣：</p>
            <RecommendationCard rec={secondary} />
          </motion.div>
        )}

        {/* All stations CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to="/games">
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              瀏覽全部六站
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            onClick={onReset}
            className="text-white/50 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新測驗
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function RecommendationCard({ rec, isPrimary }: { rec: Recommendation; isPrimary?: boolean }) {
  const Icon = rec.icon;
  return (
    <Link to={rec.href}>
      <div
        className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] touch-manipulation
          ${isPrimary
            ? "border-amber-400/30 bg-gradient-to-br " + rec.color
            : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }
        `}
      >
        {isPrimary && (
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-semibold">
            最佳推薦
          </div>
        )}
        <div className="flex items-start gap-5">
          <div className={`p-3 rounded-xl ${isPrimary ? "bg-white/10" : "bg-white/5"}`}>
            <Icon className={`w-6 h-6 ${isPrimary ? "text-amber-300" : "text-white/60"}`} />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className={`text-xl md:text-2xl font-bold font-serif ${isPrimary ? "text-white" : "text-white/80"}`}>
                {rec.title}
              </h3>
              <p className="text-sm text-white/40">{rec.subtitle}</p>
            </div>
            <p className="text-white/60 leading-relaxed">{rec.description}</p>
            <p className={`text-sm ${isPrimary ? "text-amber-300/80" : "text-white/30"} italic`}>
              💡 {rec.matchReason}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
        </div>
      </div>
    </Link>
  );
}
