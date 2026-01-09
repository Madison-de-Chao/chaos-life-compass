import { useState } from "react";
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
  ziWeiMainStar: string;
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
  ziWeiMainStar: "",
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
    // 這裡用簡化的邏輯來示意，實際會有更複雜的交叉整合演算法
    const baseScore = 50;
    const variance = () => Math.floor(Math.random() * 40) + 30; // 30-70 隨機
    
    return {
      core: formData.ziWeiMainStar ? variance() : baseScore,
      emotion: formData.moonSign ? variance() : baseScore,
      career: formData.tenthHousePlanet ? variance() : baseScore,
      relationship: formData.venusSign ? variance() : baseScore,
    };
  };

  const scores = showResults ? calculateDimensionScores() : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="lg"
          className="group border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 rounded-full px-8 py-6 text-lg"
        >
          <Compass className="w-5 h-5 mr-2 group-hover:rotate-45 transition-transform duration-500" />
          體驗人生羅盤
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] border border-emerald-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-white/10'}`} />
                </div>
              ))}
            </div>
            
            {/* Step Labels */}
            <div className="flex justify-between text-xs text-white/40 mb-8 -mt-4">
              <span className={step === 1 ? 'text-emerald-400' : ''}>基本資訊</span>
              <span className={step === 2 ? 'text-emerald-400' : ''}>紫微斗數</span>
              <span className={step === 3 ? 'text-emerald-400' : ''}>占星</span>
              <span className={step === 4 ? 'text-emerald-400' : ''}>人類圖</span>
            </div>

            {/* Step 1: 基本資訊 */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-lg">基本資訊</h3>
                  <span className="text-xs text-white/40">（用於自動計算八字）</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">出生年</Label>
                    <Input
                      type="number"
                      placeholder="1990"
                      value={formData.birthYear}
                      onChange={(e) => updateFormData("birthYear", e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">出生月</Label>
                    <Select value={formData.birthMonth} onValueChange={(v) => updateFormData("birthMonth", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="月" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)} className="text-white hover:bg-white/10">
                            {i + 1} 月
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">出生日</Label>
                    <Select value={formData.birthDay} onValueChange={(v) => updateFormData("birthDay", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="日" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {[...Array(31)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)} className="text-white hover:bg-white/10">
                            {i + 1} 日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">出生時辰</Label>
                    <Select value={formData.birthHour} onValueChange={(v) => updateFormData("birthHour", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇時辰" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 max-h-60">
                        {["子時 (23-01)", "丑時 (01-03)", "寅時 (03-05)", "卯時 (05-07)", "辰時 (07-09)", "巳時 (09-11)", "午時 (11-13)", "未時 (13-15)", "申時 (15-17)", "酉時 (17-19)", "戌時 (19-21)", "亥時 (21-23)"].map((hour) => (
                          <SelectItem key={hour} value={hour} className="text-white hover:bg-white/10">
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">性別</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateFormData("gender", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇性別" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="male" className="text-white hover:bg-white/10">男</SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-white/10">女</SelectItem>
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
                    <Label className="text-white/60 text-sm">命宮主星</Label>
                    <Select value={formData.ziWeiMainStar} onValueChange={(v) => updateFormData("ziWeiMainStar", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇命宮主星" />
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm">類型</Label>
                    <Select value={formData.hdType} onValueChange={(v) => updateFormData("hdType", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇類型" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {humanDesignTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm">策略</Label>
                    <Select value={formData.hdStrategy} onValueChange={(v) => updateFormData("hdStrategy", v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="選擇策略" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {humanDesignStrategies.map((strategy) => (
                          <SelectItem key={strategy} value={strategy} className="text-white hover:bg-white/10">
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
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                      <SelectValue placeholder="選擇內在權威" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      {humanDesignAuthorities.map((auth) => (
                        <SelectItem key={auth} value={auth} className="text-white hover:bg-white/10">
                          {auth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/60 text-sm mb-2 block">G中心閘門（可多選）</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {gCenterGates.map((gate) => (
                      <label
                        key={gate}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                          formData.hdGCenterGates.includes(gate)
                            ? 'bg-emerald-500/20 border-emerald-500/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Checkbox
                          checked={formData.hdGCenterGates.includes(gate)}
                          onCheckedChange={() => toggleGCenterGate(gate)}
                          className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <span className="text-xs text-white/70">{gate}</span>
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
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={step === 1}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一步
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white"
              >
                {step === totalSteps ? '生成羅盤' : '下一步'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          /* Results View */
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 mb-4">
                <Compass className="w-8 h-8 text-emerald-400 animate-spin-slow" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">你的人生羅盤</h3>
              <p className="text-white/50 text-sm mt-1">四系統交叉整合分析結果</p>
            </div>

            {/* Radar Chart Placeholder - 四維度視覺化 */}
            <div className="relative w-full aspect-square max-w-xs mx-auto">
              {/* Background circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-white/10" />
                <div className="absolute w-3/4 h-3/4 rounded-full border border-white/10" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-white/10" />
                <div className="absolute w-1/4 h-1/4 rounded-full border border-white/10" />
              </div>
              
              {/* Dimension Labels & Scores */}
              {analysisDimensions.map((dim, idx) => {
                const angle = (idx * 90 - 90) * (Math.PI / 180);
                const radius = 45;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                const score = scores ? scores[dim.id as keyof typeof scores] : 50;
                
                return (
                  <div
                    key={dim.id}
                    className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`p-2 rounded-full bg-gradient-to-br ${dim.color} mb-1`}>
                      <dim.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-white/70 font-medium">{dim.name}</span>
                    <span className="text-lg font-bold text-white">{score}</span>
                  </div>
                );
              })}
              
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs font-bold">YOU</span>
                </div>
              </div>
            </div>

            {/* Dimension Details */}
            <div className="grid grid-cols-2 gap-3">
              {analysisDimensions.map((dim) => {
                const score = scores ? scores[dim.id as keyof typeof scores] : 50;
                return (
                  <div key={dim.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${dim.color}`}>
                        <dim.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white">{dim.name}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full bg-gradient-to-r ${dim.color} transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/50">{dim.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Input Summary */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3">您的輸入數據</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-white/40">紫微命宮：<span className="text-purple-300">{formData.ziWeiMainStar || '未填'}</span></div>
                <div className="text-white/40">太陽星座：<span className="text-blue-300">{formData.sunSign || '未填'}</span></div>
                <div className="text-white/40">月亮星座：<span className="text-blue-300">{formData.moonSign || '未填'}</span></div>
                <div className="text-white/40">人類圖類型：<span className="text-emerald-300">{formData.hdType || '未填'}</span></div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl p-4 border border-amber-500/30">
              <p className="text-amber-300/90 text-sm text-center mb-3">
                想要完整的四系統深度解析報告？
              </p>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
                onClick={() => {
                  setOpen(false);
                  document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                查看完整報告方案
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={handleReset}
              className="w-full text-white/40 hover:text-white/60"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重新填寫
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LifeCompassForm;
