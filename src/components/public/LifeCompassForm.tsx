import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Compass,
  Star,
  Target,
  Brain,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Heart,
  Briefcase,
  Users,
  RotateCcw,
} from "lucide-react";

// 紫微斗數 14 主星
const ziWeiStars = [
  "紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府",
  "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "破軍"
];

// 12 星座
const zodiacSigns = [
  "牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座",
  "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"
];

// 第十宮行星選項
const tenthHousePlanets = [
  "太陽", "月亮", "水星", "金星", "火星", "木星", "土星", "天王星", "海王星", "冥王星", "無行星"
];

// 人類圖類型
const humanDesignTypes = [
  "顯示者", "生產者", "顯示生產者", "投射者", "反映者"
];

// 人類圖策略
const humanDesignStrategies = [
  "告知後行動", "等待回應", "等待回應後告知", "等待邀請", "等待月循環"
];

// 人類圖權威
const humanDesignAuthorities = [
  "情緒權威", "薦骨權威", "脾直覺權威", "心臟/自我權威", "G中心權威", "環境權威", "月循環權威"
];

// G中心閘門
const gCenterGates = [
  "1號閘門", "2號閘門", "7號閘門", "10號閘門", "13號閘門", "15號閘門", "25號閘門", "46號閘門"
];

// 分析面向
const analysisDimensions = [
  { id: "core", name: "核心本質", icon: Heart, color: "from-rose-400 to-pink-500", description: "你是誰，內在驅動力與人格基底" },
  { id: "emotion", name: "情緒模式", icon: Sparkles, color: "from-purple-400 to-violet-500", description: "情緒運作方式與敏感觸發點" },
  { id: "career", name: "事業方向", icon: Briefcase, color: "from-amber-400 to-orange-500", description: "適合的發展領域與工作模式" },
  { id: "relationship", name: "關係互動", icon: Users, color: "from-cyan-400 to-blue-500", description: "人際模式與親密關係傾向" },
];

interface FormData {
  // 基本資訊
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  gender: string;
  // 紫微斗數
  ziWeiMainStars: string[];
  ziWeiBodyStar: string;
  // 占星
  sunSign: string;
  moonSign: string;
  venusSign: string;
  tenthHousePlanet: string;
  // 人類圖
  hdType: string;
  hdStrategy: string;
  hdAuthority: string;
  hdGCenterGates: string[];
}

const initialFormData: FormData = {
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  birthHour: "",
  birthMinute: "",
  gender: "",
  ziWeiMainStars: [],
  ziWeiBodyStar: "",
  sunSign: "",
  moonSign: "",
  venusSign: "",
  tenthHousePlanet: "",
  hdType: "",
  hdStrategy: "",
  hdAuthority: "",
  hdGCenterGates: [],
};

const LifeCompassForm = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setStep(1);
    setShowResults(false);
  };

  const updateFormData = (key: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleGCenterGate = (gate: string) => {
    const current = formData.hdGCenterGates;
    if (current.includes(gate)) {
      updateFormData("hdGCenterGates", current.filter(g => g !== gate));
    } else {
      updateFormData("hdGCenterGates", [...current, gate]);
    }
  };

  // 計算各維度分數（示意）
  const calculateDimensionScores = () => {
    const baseScore = 50;
    const variance = () => Math.floor(Math.random() * 40) + 30;
    return {
      core: formData.ziWeiMainStars.length > 0 ? variance() : baseScore,
      emotion: formData.moonSign ? variance() : baseScore,
      career: formData.tenthHousePlanet ? variance() : baseScore,
      relationship: formData.venusSign ? variance() : baseScore,
    };
  };

  const scoresRef = useRef<ReturnType<typeof calculateDimensionScores> | null>(null);
  if (showResults && !scoresRef.current) {
    scoresRef.current = calculateDimensionScores();
  }
  if (!showResults) {
    scoresRef.current = null;
  }
  const scores = scoresRef.current;

  // Animated count-up hook
  const [animatedScores, setAnimatedScores] = useState({ core: 0, emotion: 0, career: 0, relationship: 0 });
  const [revealStage, setRevealStage] = useState(0); // 0=hidden, 1=radar, 2=cards, 3=summary, 4=cta

  useEffect(() => {
    if (!showResults || !scores) {
      setAnimatedScores({ core: 0, emotion: 0, career: 0, relationship: 0 });
      setRevealStage(0);
      return;
    }
    // Stagger reveal stages
    const t1 = setTimeout(() => setRevealStage(1), 300);
    const t2 = setTimeout(() => setRevealStage(2), 900);
    const t3 = setTimeout(() => setRevealStage(3), 1400);
    const t4 = setTimeout(() => setRevealStage(4), 1800);

    // Animate scores counting up
    const duration = 1200;
    const startTime = Date.now();
    const target = scores;
    const frame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScores({
        core: Math.round(target.core * ease),
        emotion: Math.round(target.emotion * ease),
        career: Math.round(target.career * ease),
        relationship: Math.round(target.relationship * ease),
      });
      if (progress < 1) requestAnimationFrame(frame);
    };
    const startDelay = setTimeout(() => requestAnimationFrame(frame), 400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(startDelay); };
  }, [showResults, scores]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="lg"
          className="group border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[52px] active:scale-95"
        >
          <Compass className="w-5 h-5 mr-2 group-hover:rotate-45 transition-transform duration-500" />
          體驗人生羅盤
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] border border-emerald-500/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            人生羅盤
          </DialogTitle>
          <DialogDescription className="text-white/60">
            輸入四系統數據，生成你的專屬人生定位圖
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <>
            {/* Progress Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`flex-1 h-1.5 sm:h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-white/10'}`} />
                </div>
              ))}
            </div>
            
            {/* Step Labels */}
            <div className="flex justify-between text-[10px] sm:text-xs text-white/40 mb-6 sm:mb-8 -mt-2 sm:-mt-4">
              <span className={step === 1 ? 'text-emerald-400 font-medium' : ''}>基本資訊</span>
              <span className={step === 2 ? 'text-emerald-400 font-medium' : ''}>紫微斗數</span>
              <span className={step === 3 ? 'text-emerald-400 font-medium' : ''}>占星</span>
              <span className={step === 4 ? 'text-emerald-400 font-medium' : ''}>人類圖</span>
            </div>

            {/* Step 1: 基本資訊 */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-lg">基本資訊</h3>
                  <span className="text-xs text-white/40">（用於自動計算八字）</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">出生年</Label>
                    <Input
                      type="number"
                      placeholder="1990"
                      value={formData.birthYear}
                      onChange={(e) => updateFormData("birthYear", e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">出生月</Label>
                    <Select value={formData.birthMonth} onValueChange={(v) => updateFormData("birthMonth", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                        <SelectValue placeholder="月" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)} className="text-white hover:bg-white/10 min-h-[44px]">
                            {i + 1} 月
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">出生日</Label>
                    <Select value={formData.birthDay} onValueChange={(v) => updateFormData("birthDay", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                        <SelectValue placeholder="日" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {[...Array(31)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)} className="text-white hover:bg-white/10 min-h-[44px]">
                            {i + 1} 日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">出生時辰</Label>
                    <Select value={formData.birthHour} onValueChange={(v) => updateFormData("birthHour", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                        <SelectValue placeholder="選擇時辰" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {["子時 (23-01)", "丑時 (01-03)", "寅時 (03-05)", "卯時 (05-07)", "辰時 (07-09)", "巳時 (09-11)", "午時 (11-13)", "未時 (13-15)", "申時 (15-17)", "酉時 (17-19)", "戌時 (19-21)", "亥時 (21-23)"].map((hour) => (
                          <SelectItem key={hour} value={hour} className="text-white hover:bg-white/10 min-h-[44px] text-sm">
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">性別</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateFormData("gender", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                        <SelectValue placeholder="選擇性別" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="male" className="text-white hover:bg-white/10 min-h-[44px]">男</SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-white/10 min-h-[44px]">女</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <p className="text-amber-300/80 text-sm">
                    💡 系統將根據您的出生資料自動計算八字命盤（日主五行格局）
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: 紫微斗數 */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-lg">紫微斗數配置</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60 text-sm">命宮主星（可選 1-2 顆）</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {ziWeiStars.map((star) => {
                        const isSelected = formData.ziWeiMainStars.includes(star);
                        const isDisabled = !isSelected && formData.ziWeiMainStars.length >= 2;
                        return (
                          <button
                            key={star}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              const current = formData.ziWeiMainStars;
                              if (isSelected) {
                                updateFormData("ziWeiMainStars", current.filter((s: string) => s !== star) as any);
                              } else {
                                updateFormData("ziWeiMainStars", [...current, star] as any);
                              }
                            }}
                            className={`px-2 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
                              isSelected
                                ? 'bg-purple-500/30 border-purple-400/60 text-purple-200 border'
                                : isDisabled
                                ? 'bg-white/3 border-white/5 text-white/20 border cursor-not-allowed'
                                : 'bg-white/5 border-white/10 text-white/70 border hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {star}
                          </button>
                        );
                      })}
                    </div>
                    {formData.ziWeiMainStars.length > 0 && (
                      <p className="text-xs text-purple-300/70 mt-1.5">
                        已選：{formData.ziWeiMainStars.join('、')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-white/60 text-sm">身宮主星</Label>
                    <Select value={formData.ziWeiBodyStar} onValueChange={(v) => updateFormData("ziWeiBodyStar", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇身宮主星" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {ziWeiStars.map((star) => (
                          <SelectItem key={star} value={star} className="text-white hover:bg-white/10">
                            {star}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <p className="text-purple-300/80 text-sm">
                    ✦ 紫微斗數揭示先天人格結構與一生運勢走向
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: 占星 */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <Compass className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-lg">占星配置</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">太陽星座</Label>
                    <Select value={formData.sunSign} onValueChange={(v) => updateFormData("sunSign", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇太陽星座" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign} value={sign} className="text-white hover:bg-white/10">
                            {sign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">月亮星座</Label>
                    <Select value={formData.moonSign} onValueChange={(v) => updateFormData("moonSign", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇月亮星座" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign} value={sign} className="text-white hover:bg-white/10">
                            {sign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">金星星座</Label>
                    <Select value={formData.venusSign} onValueChange={(v) => updateFormData("venusSign", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇金星星座" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign} value={sign} className="text-white hover:bg-white/10">
                            {sign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">第十宮行星</Label>
                    <Select value={formData.tenthHousePlanet} onValueChange={(v) => updateFormData("tenthHousePlanet", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇行星" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {tenthHousePlanets.map((planet) => (
                          <SelectItem key={planet} value={planet} className="text-white hover:bg-white/10">
                            {planet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-blue-300/80 text-sm">
                    ☿ 占星映照心理動態、關係模式與人生課題
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: 人類圖 */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-lg">人類圖配置</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">類型</Label>
                    <Select value={formData.hdType} onValueChange={(v) => updateFormData("hdType", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                        <SelectValue placeholder="選擇類型" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {humanDesignTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-white/10 min-h-[44px] text-base sm:text-sm">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">策略</Label>
                    <Select value={formData.hdStrategy} onValueChange={(v) => updateFormData("hdStrategy", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                        <SelectValue placeholder="選擇策略" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {humanDesignStrategies.map((strategy) => (
                          <SelectItem key={strategy} value={strategy} className="text-white hover:bg-white/10 min-h-[44px] text-base sm:text-sm">
                            {strategy}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white/60 text-sm">內在權威</Label>
                  <Select value={formData.hdAuthority} onValueChange={(v) => updateFormData("hdAuthority", v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 min-h-[48px] text-base sm:text-sm">
                      <SelectValue placeholder="選擇內在權威" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      {humanDesignAuthorities.map((auth) => (
                        <SelectItem key={auth} value={auth} className="text-white hover:bg-white/10 min-h-[44px] text-base sm:text-sm">
                          {auth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/60 text-sm mb-2 block">G中心閘門（可多選）</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {gCenterGates.map((gate) => (
                      <label
                        key={gate}
                        className={`flex items-center gap-2 p-3 sm:p-2 rounded-lg border cursor-pointer transition-all min-h-[48px] active:scale-95 ${
                          formData.hdGCenterGates.includes(gate)
                            ? 'bg-emerald-500/20 border-emerald-500/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Checkbox
                          checked={formData.hdGCenterGates.includes(gate)}
                          onCheckedChange={() => toggleGCenterGate(gate)}
                          className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-5 h-5 sm:w-4 sm:h-4"
                        />
                        <span className="text-sm sm:text-xs text-white/70">{gate}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-emerald-300/80 text-sm">
                    ◉ 人類圖定義決策權威與能量運作方式
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 sm:mt-8 gap-3">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={step === 1}
                className="text-white/60 hover:text-white hover:bg-white/10 min-h-[48px] px-4 sm:px-6 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 mr-1" />
                <span className="text-base sm:text-sm">上一步</span>
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white min-h-[48px] px-6 sm:px-6 active:scale-95"
              >
                <span className="text-base sm:text-sm">{step === totalSteps ? '生成羅盤' : '下一步'}</span>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          /* Results View */
          <div className="space-y-6">
            {/* Header - always visible */}
            <div className={`text-center mb-6 transition-all duration-700 ${revealStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 mb-4">
                <Compass className={`w-8 h-8 text-emerald-400 ${revealStage >= 1 ? 'animate-spin' : ''}`} style={{ animationDuration: '2s', animationIterationCount: 1 }} />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">你的人生羅盤</h3>
              <p className="text-muted-foreground text-sm mt-1">四系統交叉整合分析結果</p>
            </div>

            {/* Radar Chart */}
            <div className={`transition-all duration-700 delay-200 ${revealStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="relative w-full aspect-square max-w-xs mx-auto">
                {/* Background circles with pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[100, 75, 50, 25].map((size, i) => (
                    <div
                      key={size}
                      className={`absolute rounded-full border border-white/10 transition-all duration-700`}
                      style={{
                        width: `${size}%`,
                        height: `${size}%`,
                        transitionDelay: `${i * 150}ms`,
                        opacity: revealStage >= 1 ? 1 : 0,
                        transform: revealStage >= 1 ? 'scale(1)' : 'scale(0.5)',
                      }}
                    />
                  ))}
                </div>
                
                {/* Dimension Labels & Animated Scores */}
                {analysisDimensions.map((dim, idx) => {
                  const angle = (idx * 90 - 90) * (Math.PI / 180);
                  const radius = 45;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);
                  const animScore = animatedScores[dim.id as keyof typeof animatedScores];
                  
                  return (
                    <div
                      key={dim.id}
                      className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transitionDelay: `${idx * 200 + 400}ms`,
                        opacity: revealStage >= 1 ? 1 : 0,
                        transform: `translate(-50%, -50%) ${revealStage >= 1 ? 'scale(1)' : 'scale(0)'}`,
                      }}
                    >
                      <div className={`p-2 rounded-full bg-gradient-to-br ${dim.color} mb-1 transition-shadow duration-500`}
                        style={{ boxShadow: revealStage >= 1 ? `0 0 20px ${idx === 0 ? 'rgba(168,85,247,0.4)' : idx === 1 ? 'rgba(239,68,68,0.4)' : idx === 2 ? 'rgba(59,130,246,0.4)' : 'rgba(16,185,129,0.4)'}` : 'none' }}>
                        <dim.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{dim.name}</span>
                      <span className="text-lg font-bold text-foreground tabular-nums">{animScore}</span>
                    </div>
                  );
                })}
                
                {/* Center pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center transition-all duration-700 ${revealStage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <span className="text-emerald-400 text-xs font-bold">YOU</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension Detail Cards - staggered */}
            <div className="grid grid-cols-2 gap-3">
              {analysisDimensions.map((dim, idx) => {
                const animScore = animatedScores[dim.id as keyof typeof animatedScores];
                return (
                  <div
                    key={dim.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-500"
                    style={{
                      transitionDelay: `${idx * 150}ms`,
                      opacity: revealStage >= 2 ? 1 : 0,
                      transform: revealStage >= 2 ? 'translateY(0)' : 'translateY(20px)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${dim.color}`}>
                        <dim.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{dim.name}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full bg-gradient-to-r ${dim.color} rounded-full`}
                        style={{
                          width: `${animScore}%`,
                          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{dim.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Input Summary */}
            <div
              className="bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-500"
              style={{
                opacity: revealStage >= 3 ? 1 : 0,
                transform: revealStage >= 3 ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              <h4 className="text-sm font-bold text-foreground mb-3">您的輸入數據</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-muted-foreground">紫微命宮：<span className="text-purple-300">{formData.ziWeiMainStar || '未填'}</span></div>
                <div className="text-muted-foreground">太陽星座：<span className="text-blue-300">{formData.sunSign || '未填'}</span></div>
                <div className="text-muted-foreground">月亮星座：<span className="text-blue-300">{formData.moonSign || '未填'}</span></div>
                <div className="text-muted-foreground">人類圖類型：<span className="text-emerald-300">{formData.hdType || '未填'}</span></div>
              </div>
            </div>

            {/* CTA */}
            <div
              className="transition-all duration-500"
              style={{
                opacity: revealStage >= 4 ? 1 : 0,
                transform: revealStage >= 4 ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
              }}
            >
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl p-4 border border-amber-500/30">
                <p className="text-amber-300/90 text-sm text-center mb-3">
                  想要完整的四系統深度解析報告？
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold min-h-[48px] text-base active:scale-95"
                  onClick={() => {
                    setOpen(false);
                    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  查看完整報告方案
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={handleReset}
                className="w-full text-muted-foreground hover:text-foreground mt-3 min-h-[48px] text-base active:scale-95"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                重新填寫
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LifeCompassForm;
