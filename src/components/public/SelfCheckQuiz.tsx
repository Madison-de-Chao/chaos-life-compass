import { useState, useRef, useCallback } from "react";
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
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Share2,
  Twitter,
  Facebook,
  Copy,
  Download,
  Image,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import logoChaoxuan from "@/assets/logo-chaoxuan.png";
import logoHongling from "@/assets/logo-hongling.png";

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
    subtitle: "內在雷達敏銳者",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    description: "你的內在雷達非常敏銳，情緒是你重要的決策指南針。你能感知他人無法察覺的細微變化，這是你獨特的天賦。",
    strengths: [
      "高度同理心，能深刻理解他人感受",
      "直覺敏銳，常能預感事情走向",
      "情感豐富，創造力與藝術感強",
      "關係經營細膩，重視情感連結"
    ],
    challenges: [
      "容易被情緒淹沒，需要學習情緒疏導",
      "過度在意他人感受，忽略自身需求",
      "決策時可能過於依賴感覺"
    ],
    reportInsight: "在完整報告中，我們會深入分析你的情緒能量來源、最佳情緒管理策略，以及如何將敏感轉化為你的超能力，而非負擔。",
    flagshipBonus: "旗艦版會加入「情緒權威SOP」，幫助你建立個人化的情緒決策流程，讓直覺成為可靠的導航系統。"
  },
  action: {
    title: "行動導向型",
    subtitle: "天生實踐者",
    icon: Zap,
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description: "你是天生的實踐者，習慣用行動來解決問題。「做了再說」是你的人生哲學，這讓你比大多數人更快看到結果。",
    strengths: [
      "執行力強，想到就能做到",
      "不怕失敗，願意反覆嘗試",
      "能在混亂中快速找到出路",
      "帶動團隊士氣，推動事情前進"
    ],
    challenges: [
      "可能衝太快，忽略細節或風險",
      "不耐等待，容易焦躁",
      "有時行動先於思考"
    ],
    reportInsight: "在完整報告中，我們會分析你的最佳「啟動節奏」，找出何時該衝、何時該停，避免無效忙碌和能量耗損。",
    flagshipBonus: "旗艦版會提供「行動策略兵符」，根據你的命盤設計專屬的行動時機判斷法則，讓每次出擊都更精準。"
  },
  mindset: {
    title: "思維導向型",
    subtitle: "邏輯分析師",
    icon: Brain,
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "你擅長邏輯分析，用理性來理解世界。複雜的問題在你面前會被拆解成清晰的步驟，這是你獨特的思維優勢。",
    strengths: [
      "分析能力強，能看穿問題本質",
      "決策有條理，考慮周全",
      "學習能力強，善於歸納整理",
      "能在壓力下保持冷靜判斷"
    ],
    challenges: [
      "可能過度分析，陷入思考迴圈",
      "有時忽略情感因素的重要性",
      "追求完美可能導致行動延遲"
    ],
    reportInsight: "在完整報告中，我們會幫你優化思考迴路，找出你的決策盲點，並建立減少決策疲勞的方法。",
    flagshipBonus: "旗艦版會深入解析你的「心智運算模式」，教你如何在不同情境下切換思維模式，讓理性成為助力而非阻力。"
  },
  value: {
    title: "價值導向型",
    subtitle: "人生定位者",
    icon: Target,
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "你注重意義和方向，追求與內心價值對齊的人生。你不滿足於「做完」，更在乎「為何而做」。",
    strengths: [
      "人生方向感強，不易迷失",
      "能分辨什麼值得投入時間",
      "內在動力穩定，不易被外界動搖",
      "追求深度而非廣度"
    ],
    challenges: [
      "可能對「沒意義」的事缺乏耐心",
      "有時過於理想化，與現實產生衝突",
      "尋找意義的過程可能帶來焦慮"
    ],
    reportInsight: "在完整報告中，我們會幫你明確核心價值，讓每個人生選擇都能與內心使命產生共振，減少內耗。",
    flagshipBonus: "旗艦版會提供「價值校準羅盤」，在人生重大抉擇時刻，幫助你快速判斷這條路是否真正屬於你。"
  },
};

const dimensionColors = {
  emotion: { gradient: "from-rose-400 to-pink-500", icon: Heart, label: "情緒" },
  action: { gradient: "from-amber-400 to-yellow-500", icon: Zap, label: "行動" },
  mindset: { gradient: "from-blue-400 to-cyan-500", icon: Brain, label: "思維" },
  value: { gradient: "from-purple-400 to-violet-500", icon: Target, label: "價值" },
};

// Personalized card themes based on primary dimension
const cardThemes = {
  emotion: {
    bgGradient: "from-rose-950 via-[#1a0a0f] to-[#0a0a0a]",
    accentGlow1: "from-rose-500/30 to-pink-600/20",
    accentGlow2: "from-pink-400/20 to-rose-500/10",
    pattern: "rose",
    borderAccent: "border-rose-500/30",
  },
  action: {
    bgGradient: "from-amber-950 via-[#1a1008] to-[#0a0a0a]",
    accentGlow1: "from-amber-500/30 to-yellow-600/20",
    accentGlow2: "from-yellow-400/20 to-amber-500/10",
    pattern: "amber",
    borderAccent: "border-amber-500/30",
  },
  mindset: {
    bgGradient: "from-blue-950 via-[#0a1018] to-[#0a0a0a]",
    accentGlow1: "from-blue-500/30 to-cyan-600/20",
    accentGlow2: "from-cyan-400/20 to-blue-500/10",
    pattern: "blue",
    borderAccent: "border-blue-500/30",
  },
  value: {
    bgGradient: "from-purple-950 via-[#120a18] to-[#0a0a0a]",
    accentGlow1: "from-purple-500/30 to-violet-600/20",
    accentGlow2: "from-violet-400/20 to-purple-500/10",
    pattern: "purple",
    borderAccent: "border-purple-500/30",
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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDiagnosticCard, setShowDiagnosticCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

    // Get secondary dimension
    const sortedDimensions = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const secondaryDimension = sortedDimensions[1][1] > 0 
      ? sortedDimensions[1][0] as keyof typeof dimensionResults 
      : null;

    // Get primary dimension key for theming
    const primaryKey = maxDimension;

    return { 
      primary: dimensionResults[maxDimension], 
      primaryKey,
      secondary: secondaryDimension ? dimensionResults[secondaryDimension] : null,
      secondaryKey: secondaryDimension,
      counts 
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOption(null);
    setShowShareMenu(false);
    setShowDiagnosticCard(false);
  };

  const handleShare = (platform: string) => {
    const result = calculateResult();
    const shareText = `我在默默超思維測驗中是「${result.primary.title}」！${result.primary.description.slice(0, 50)}... 來測測你的思維類型 👉`;
    const shareUrl = window.location.origin + "/reports";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "已複製到剪貼簿",
          description: "可以貼到任何地方分享",
        });
        break;
    }
    setShowShareMenu(false);
  };

  const handleDownloadCard = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0a0a0a",
      });

      const link = document.createElement("a");
      const result = calculateResult();
      link.download = `默默超思維診斷書-${result.primary.title}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "下載成功",
        description: "診斷書已儲存到您的裝置",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "下載失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    }
  }, [answers]);

  const result = showResult ? calculateResult() : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 text-white max-w-xl max-h-[90vh] overflow-y-auto data-[state=open]:animate-dialog-enter data-[state=closed]:animate-dialog-exit">
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
          ) : showDiagnosticCard && result ? (
            // Diagnostic Card View
            <div className="animate-scale-in">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDiagnosticCard(false)}
                className="mb-4 text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回結果
              </Button>

              {/* Diagnostic Card for Download */}
              {(() => {
                const theme = cardThemes[result.primaryKey as keyof typeof cardThemes];
                return (
                  <div
                    ref={cardRef}
                    className={`relative w-full bg-gradient-to-br ${theme.bgGradient} rounded-3xl overflow-hidden p-6 border ${theme.borderAccent}`}
                    style={{ aspectRatio: "9/16" }}
                  >
                    {/* Background decorations - personalized by dimension */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {/* Primary glow */}
                      <div className={`absolute top-0 left-0 w-40 h-40 bg-gradient-to-br ${theme.accentGlow1} rounded-full blur-3xl opacity-60`} />
                      <div className={`absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl ${theme.accentGlow2} rounded-full blur-3xl opacity-50`} />
                      
                      {/* Decorative patterns based on dimension */}
                      {result.primaryKey === "emotion" && (
                        <>
                          {/* Heart-shaped decorations for emotion */}
                          <div className="absolute top-16 right-4 text-rose-500/10 text-6xl">♡</div>
                          <div className="absolute bottom-32 left-2 text-pink-400/10 text-4xl">♡</div>
                          <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-rose-400/20" />
                          <div className="absolute top-1/2 left-4 w-3 h-3 rounded-full bg-pink-400/15" />
                          <div className="absolute bottom-1/4 right-12 w-1.5 h-1.5 rounded-full bg-rose-300/25" />
                        </>
                      )}
                      {result.primaryKey === "action" && (
                        <>
                          {/* Lightning/energy decorations for action */}
                          <div className="absolute top-20 right-6 text-amber-500/15 text-5xl">⚡</div>
                          <div className="absolute bottom-40 left-4 text-yellow-400/10 text-3xl">⚡</div>
                          {/* Dynamic lines */}
                          <div className="absolute top-1/4 right-0 w-24 h-0.5 bg-gradient-to-l from-amber-500/20 to-transparent" />
                          <div className="absolute bottom-1/3 left-0 w-16 h-0.5 bg-gradient-to-r from-yellow-500/15 to-transparent" />
                          <div className="absolute top-2/3 right-4 w-2 h-2 rotate-45 bg-amber-400/20" />
                        </>
                      )}
                      {result.primaryKey === "mindset" && (
                        <>
                          {/* Geometric/circuit decorations for mindset */}
                          <div className="absolute top-16 right-8 w-8 h-8 border border-blue-400/15 rounded-lg rotate-12" />
                          <div className="absolute bottom-36 left-6 w-6 h-6 border border-cyan-400/10 rounded-md -rotate-12" />
                          {/* Circuit-like lines */}
                          <div className="absolute top-1/4 right-2 w-12 h-px bg-blue-400/20" />
                          <div className="absolute top-1/4 right-2 w-px h-8 bg-blue-400/20" />
                          <div className="absolute bottom-1/4 left-4 w-8 h-px bg-cyan-400/15" />
                          <div className="absolute top-1/2 right-6 w-3 h-3 rounded-full border border-blue-300/20" />
                        </>
                      )}
                      {result.primaryKey === "value" && (
                        <>
                          {/* Compass/star decorations for value */}
                          <div className="absolute top-20 right-6 text-purple-500/15 text-4xl">✦</div>
                          <div className="absolute bottom-36 left-4 text-violet-400/10 text-3xl">✧</div>
                          <div className="absolute top-1/3 right-10 text-purple-300/10 text-2xl">◇</div>
                          {/* Subtle rings */}
                          <div className="absolute top-1/2 left-8 w-6 h-6 rounded-full border border-violet-400/10" />
                          <div className="absolute bottom-1/3 right-8 w-4 h-4 rounded-full border border-purple-300/15" />
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col z-10">
                      {/* Header with logos */}
                      <div className="flex items-center justify-between mb-4">
                        <img src={logoChaoxuan} alt="超烜創意" className="h-6 object-contain" />
                        <img src={logoHongling} alt="虹靈御所" className="h-6 object-contain" />
                      </div>

                      {/* Title */}
                      <div className="text-center mb-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${result.primary.bgColor} ${result.primary.borderColor} border mb-2`}>
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-300 text-xs font-medium">默默超思維診斷書</span>
                        </div>
                        <h2 className="text-sm text-white/60 font-medium">你的思維類型是</h2>
                      </div>

                      {/* Main result */}
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${result.primary.color} flex items-center justify-center mb-4 shadow-xl shadow-black/30`}
                        >
                          <result.primary.icon className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-1 text-center">
                          {result.primary.title}
                        </h1>
                        <p className="text-white/60 text-xs mb-3">{result.primary.subtitle}</p>

                        <p className="text-white/70 text-center text-xs leading-relaxed px-2 mb-4">
                          {result.primary.description}
                        </p>

                        {/* Dimension bars with themed colors */}
                        <div className="w-full space-y-1.5">
                          {Object.entries(result.counts).map(([key, value]) => {
                            const config = dimensionColors[key as keyof typeof dimensionColors];
                            const DimIcon = config.icon;
                            const percentage = (value / 5) * 100;
                            const isPrimary = key === result.primaryKey;
                            
                            return (
                              <div key={key} className={`flex items-center gap-2 ${isPrimary ? 'opacity-100' : 'opacity-70'}`}>
                                <DimIcon className={`w-3 h-3 flex-shrink-0 ${isPrimary ? 'text-white' : 'text-white/60'}`} />
                                <span className={`text-[10px] w-8 ${isPrimary ? 'text-white/80 font-medium' : 'text-white/40'}`}>{config.label}</span>
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full ${isPrimary ? 'shadow-sm' : ''}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className={`text-[10px] w-4 text-right ${isPrimary ? 'text-white/80' : 'text-white/40'}`}>{value}</span>
                              </div>
                            );
                          })}
                        </div>

                        {result.secondary && (
                          <p className="text-white/50 text-[10px] mt-3 text-center">
                            次要傾向：{result.secondary.title}
                          </p>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className={`mt-auto pt-4 border-t ${theme.borderAccent}`}>
                        <div className="text-center">
                          <p className="text-amber-400 text-xs font-medium mb-1">
                            想深入了解如何運用你的思維優勢？
                          </p>
                          <p className="text-white/50 text-[10px]">
                            momo-chao.com/reports
                          </p>
                        </div>
                      </div>

                      {/* Watermark */}
                      <p className="text-white/20 text-[8px] text-center mt-2">© 默默超全方位命理解讀報告</p>
                    </div>
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={handleDownloadCard}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold gap-2"
                >
                  <Download className="w-4 h-4" />
                  下載診斷書圖片
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                    className="border-white/20 text-white/70 hover:bg-white/10 gap-1 text-xs"
                  >
                    <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                    className="border-white/20 text-white/70 hover:bg-white/10 gap-1 text-xs"
                  >
                    <Facebook className="w-3.5 h-3.5 text-[#4267B2]" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("copy")}
                    className="border-white/20 text-white/70 hover:bg-white/10 gap-1 text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    複製
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            result && (
              <div className="animate-scale-in">
                {/* Result Header */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${result.primary.color} mb-4 shadow-lg`}
                  >
                    <result.primary.icon className="w-10 h-10 text-white" />
                  </div>

                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    你是<span className="text-amber-400">{result.primary.title}</span>
                  </DialogTitle>
                  <p className="text-white/50 text-sm">{result.primary.subtitle}</p>
                </div>

                {/* Main Description */}
                <p className="text-white/70 text-center mb-6 leading-relaxed">
                  {result.primary.description}
                </p>

                {/* Strengths */}
                <div className={`p-4 rounded-xl ${result.primary.bgColor} ${result.primary.borderColor} border mb-4`}>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    你的優勢
                  </h4>
                  <ul className="space-y-2">
                    {result.primary.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                  <h4 className="text-white font-semibold mb-3">可能的挑戰</h4>
                  <ul className="space-y-2">
                    {result.primary.challenges.map((challenge, i) => (
                      <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Secondary Type */}
                {result.secondary && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <p className="text-white/60 text-sm">
                      <span className="text-white/80 font-medium">次要傾向：</span>{" "}
                      {result.secondary.title} — 你同時具備{result.secondary.subtitle}的特質
                    </p>
                  </div>
                )}

                {/* Report Insights */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 mb-4">
                  <h4 className="text-amber-300 font-semibold mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    完整報告會告訴你
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    {result.primary.reportInsight}
                  </p>
                  <div className="pt-3 border-t border-amber-500/20">
                    <p className="text-purple-300/90 text-sm">
                      <span className="font-semibold">🚀 旗艦版加值：</span>{" "}
                      {result.primary.flagshipBonus}
                    </p>
                  </div>
                </div>

                {/* Share & Actions */}
                <div className="space-y-3">
                  {/* Generate Diagnostic Card Button */}
                  <Button
                    onClick={() => setShowDiagnosticCard(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold gap-2"
                  >
                    <Image className="w-4 h-4" />
                    生成診斷書圖片分享
                  </Button>

                  {/* Share Button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="w-full border-white/20 text-white/70 hover:bg-white/10 gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      文字分享結果
                    </Button>
                    
                    {showShareMenu && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-xl animate-slide-up z-50">
                        <button
                          onClick={() => handleShare("twitter")}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                          <span className="text-white/80">分享到 Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare("facebook")}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Facebook className="w-5 h-5 text-[#4267B2]" />
                          <span className="text-white/80">分享到 Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare("copy")}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Copy className="w-5 h-5 text-amber-400" />
                          <span className="text-white/80">複製連結</span>
                        </button>
                      </div>
                    )}
                  </div>

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
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelfCheckQuiz;
