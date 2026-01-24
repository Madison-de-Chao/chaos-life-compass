import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Crown, Lock, ChevronRight, Sparkles, Brain, Heart, Compass, Zap, Eye, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDrag } from "@use-gesture/react";
import { useIsMobile } from "@/hooks/use-mobile";

// 基本版試閱內容
const basicPreviewSections = [
  {
    title: "開場｜你的四系統在說什麼",
    content: `親愛的旅人：

歡迎踏入這趟認識自己的旅程。這份報告是你的第一面鏡子——簡單、直接，讓你看見自己最核心的樣貌。

在這裡，四個命理系統將第一次為你「交叉對話」：
・紫微斗數告訴你：你的天賦與個性底色
・八字告訴你：你的能量節奏與行為模式
・占星告訴你：你的情感需求與表達方式
・人類圖告訴你：你的決策方式與人生策略

當四個系統同時指向某個特質，那個特質就是你最真實的「底牌」。

準備好認識自己了嗎？`,
    isLocked: false,
  },
  {
    title: "基本資料｜四系統命盤總覽",
    content: `【你的命盤快照】

紫微斗數：天機星坐命
→ 敏銳、善思、腦筋轉得快

八字格局：甲木日主・傷官格
→ 創意豐富、不按牌理出牌

占星配置：太陽雙子・月亮天蠍
→ 表面輕鬆、內心深沉

人類圖類型：顯示生產者 5/1
→ 等待回應、擅長示範與引領

【四系統初步交叉】
✓ 共同指向：思考活躍、表達能力強
✓ 共同指向：對「真相」有執念
✓ 共同注意：容易想太多、耗神`,
    isLocked: false,
  },
  {
    title: "人生羅盤｜四系統統整導航",
    content: `【你的核心定位圖】

┌─────────────────────────────────┐
│        人 生 羅 盤               │
├─────────────────────────────────┤
│  核心本質    │  靈活・敏銳・求真 │
│  情緒模式    │  表面冷靜・內在翻騰│
│  事業方向    │  溝通・分析・創作 │
│  關係互動    │  需要深度連結     │
└─────────────────────────────────┘

【能量分布速覽】

心智能量 ████████░░ 85%
情緒能量 ███████░░░ 70%
行動能量 █████░░░░░ 55%
價值能量 ██████░░░░ 60%

💡 你是心智型主導者——先想清楚，再行動。`,
    isLocked: false,
  },
  {
    title: "你是誰｜內在個性與外在性格",
    content: `【你的核心特質】

你像一座隨時運轉的雷達站——對環境的變化極度敏感，能在第一時間捕捉到別人沒注意到的細節...

⚠️ 更多深度分析請參考標準版或旗艦版...

【基本版提示】
這個卡點，在標準版有完整的八大面向解析。
想要「看懂自己」，請升級標準版。`,
    isLocked: true,
  },
  {
    title: "結語｜圓滿的你",
    content: `【你已經踏出第一步】

認識自己是一趟漫長的旅程，而你已經起步。

基本版讓你看見了「你是誰」的輪廓——
但如果你想知道「你怎麼運作」...
如果你想了解事業、愛情、金錢的深度解析...
如果你想學會「使用自己」而不只是「認識自己」...

⚠️ 標準版與旗艦版，將帶你走得更遠。`,
    isLocked: true,
  },
];

// 標準版試閱內容
const standardPreviewSections = [
  {
    title: "開場自序",
    content: `親愛的旅人：

歡迎來到你的內在宇宙。這份報告不是一張地圖，而是一面鏡子——它不會告訴你該往哪裡走，但會讓你看清自己此刻站在哪裡。

在接下來的閱讀中，你會遇見熟悉的自己，也可能遇見陌生的自己。無論是哪一個，都請溫柔以待。

這裡沒有對錯，只有理解。
這裡沒有預言，只有倒影。

準備好了嗎？讓我們開始。`,
    isLocked: false,
  },
  {
    title: "基本資料與命盤總覽",
    content: `【四系統交叉參照分析】

您的命盤呈現出獨特的能量配置：

紫微斗數：天府星坐命，具備沉穩內斂的特質
八字分析：日主為癸水，思緒細膩，善於觀察
占星配置：太陽金牛、月亮雙魚，務實與浪漫並存
人類圖類型：投射者，擅長引導他人看見可能性

這四個系統共同指向一個核心特質：你是一位天生的「觀察者」與「整合者」...`,
    isLocked: false,
  },
  {
    title: "人生羅盤",
    content: `【你的命盤核心數據】

┌─────────────────────────────────────┐
│           人 生 羅 盤               │
├─────────────────────────────────────┤
│  紫微斗數    │  天府星坐命宮        │
│  主星特質    │  穩重、包容、務實    │
├─────────────────────────────────────┤
│  八字格局    │  癸水日主・食神格    │
│  五行配置    │  水3 木2 火1 土2 金2 │
├─────────────────────────────────────┤
│  占星配置    │  太陽金牛・月亮雙魚  │
│  上升星座    │  處女座              │
├─────────────────────────────────────┤
│  人類圖      │  投射者 2/4          │
│  內在權威    │  薦骨權威            │
└─────────────────────────────────────┘

【四系統交叉驗證】

當四個系統指向同一特質時，該特質的可信度極高：

✓ 共同指向：觀察力強、善於整合資訊
✓ 共同指向：決策前需要充分醞釀
✓ 共同指向：適合幕後策劃型角色

【能量分布圖】

情緒能量 ████████░░ 80%
行動能量 ██████░░░░ 60%
心智能量 █████████░ 90%
價值能量 ███████░░░ 70%`,
    isLocked: false,
  },
  {
    title: "內在個性分析",
    content: `【你的內在運作模式】

在你的內心深處，存在著一種獨特的節奏——不急不徐，像是深海中的暗流，表面平靜卻蘊含力量。

你的思考方式傾向於「全局式觀察」，在做決定之前，你會本能地收集各種訊息，在腦中建構完整的圖像...

⚠️ 以下內容為付費完整版...`,
    isLocked: true,
  },
  {
    title: "事業解析",
    content: `【職涯能量與發展方向】

根據四系統交叉分析，你的職業天賦集中在以下領域...

⚠️ 此章節為付費內容`,
    isLocked: true,
  },
];

// 旗艦版試閱內容
const flagshipPreviewSections = [
  {
    title: "開場自序",
    content: `親愛的旅人：

歡迎來到你的內在宇宙。這份報告不僅是一面鏡子，更是一套完整的生命操作手冊。

在標準版的基礎上，旗艦版將帶你進入更深層的領域——不只是「看懂自己」，而是「學會使用自己」。

你將學會：
・如何將命盤特質轉化為日常行動
・如何在關鍵時刻啟動正確的思維模式
・如何建立專屬於你的決策框架

這是一場從「認識」到「運用」的完整旅程。`,
    isLocked: false,
  },
  {
    title: "人生羅盤（進階版）",
    content: `【命盤深度解析儀表板】

┌─────────────────────────────────────────────┐
│         人 生 羅 盤 ・ 旗 艦 版             │
├─────────────────────────────────────────────┤
│  紫微斗數    │  天府星坐命宮              │
│  主星特質    │  穩重、包容、務實          │
│  輔星加持    │  文昌化科・左輔同宮        │
├─────────────────────────────────────────────┤
│  八字格局    │  癸水日主・食神格          │
│  五行配置    │  水3 木2 火1 土2 金2       │
│  大運走勢    │  目前行「甲木」運（2020-2030）│
├─────────────────────────────────────────────┤
│  占星配置    │  太陽金牛・月亮雙魚        │
│  上升星座    │  處女座                    │
│  關鍵相位    │  日月三分・金冥四分        │
├─────────────────────────────────────────────┤
│  人類圖      │  投射者 2/4                │
│  內在權威    │  薦骨權威                  │
│  定義中心    │  G中心・喉輪・薦骨         │
└─────────────────────────────────────────────┘

【四系統深度交叉驗證】

當四個系統指向同一特質時，該特質的可信度極高：

✓✓✓ 高度一致：觀察力強、善於整合資訊
✓✓✓ 高度一致：決策前需要充分醞釀
✓✓  中度一致：適合幕後策劃型角色
✓    單一指向：藝術敏感度（需環境激發）

【能量分布與思維系統對應】

情緒能量 ████████░░ 80% → 情緒維度優勢
行動能量 ██████░░░░ 60% → 需要策略支持
心智能量 █████████░ 90% → 心智維度優勢
價值能量 ███████░░░ 70% → 價值校準中

【旗艦版專屬：運作建議】
・情緒高峰期：適合創意發想、人際溝通
・心智高峰期：適合分析決策、學習吸收
・低能量期：建議休息觀察，避免重大決定`,
    isLocked: false,
  },
  {
    title: "默默超思維系統導入",
    content: `【四維運作框架】

默默超思維系統建立在四個核心維度之上：

🔴 情緒維度（Emotion）
識別並理解情緒背後的訊息，將情緒從「干擾」轉化為「資訊」。

🟡 行動維度（Action）
建立與你命盤能量匹配的行動模式，避免「逆勢而為」的耗損。

🔵 心智維度（Mindset）
發展彈性思維，在複雜情境中保持清晰。

🟢 價值維度（Value）
錨定內在羅盤，在選擇中不迷失方向。`,
    isLocked: false,
  },
  {
    title: "思維啟動器：關鍵金句",
    content: `【專屬於你的思維觸發器】

根據你的命盤特質，我們為你設計了以下「思維啟動器」——當你在生活中遇到特定情境時，可以用這些金句快速校準狀態：

✦ 當你感到猶豫不決時：
「我不需要完美的答案，只需要誠實的第一步。」

✦ 當你承受外在壓力時：
「外界的期待是參考，內在的聲音是指南。」

✦ 當你陷入自我懷疑時：
「懷疑是思考的開始，不是能力的終結。」

⚠️ 更多個人化啟動器請見完整版...`,
    isLocked: true,
  },
  {
    title: "四時八字軍團：你的內在兵符",
    content: `【RPG 式命盤解讀】

在旗艦版中，我們將你的八字轉化為一支專屬軍團——每個「兵符」代表你內在的一種能量...

⚠️ 此章節為旗艦版專屬內容`,
    isLocked: true,
  },
];

const ReportPreview = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const isMobile = useIsMobile();
  
  const tabs = ["basic", "standard", "flagship"] as const;
  
  const handleSwipe = useCallback((direction: "left" | "right") => {
    const currentIndex = tabs.indexOf(activeTab as typeof tabs[number]);
    if (direction === "left" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === "right" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  }, [activeTab]);
  
  const bind = useDrag(
    ({ swipe: [swipeX], direction: [dirX], velocity: [vx], movement: [mx], cancel }) => {
      // Only handle horizontal swipes with sufficient velocity
      if (Math.abs(vx) > 0.3 || Math.abs(mx) > 50) {
        if (swipeX !== 0) {
          handleSwipe(swipeX > 0 ? "right" : "left");
        } else if (Math.abs(mx) > 50) {
          handleSwipe(mx > 0 ? "right" : "left");
          cancel();
        }
      }
    },
    { 
      axis: "x",
      filterTaps: true,
      threshold: 10,
      swipe: { velocity: 0.3, distance: 50 }
    }
  );

  const currentIndex = tabs.indexOf(activeTab as typeof tabs[number]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="group bg-card/50 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 min-h-[52px] px-6 sm:px-8 active:scale-95"
        >
          <BookOpen className="h-5 w-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-base sm:text-lg">免費試閱報告</span>
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[85vh] bg-card border-border/50 p-3 sm:p-6 mx-2 sm:mx-auto w-[calc(100vw-16px)] sm:w-auto">
        <DialogHeader className="pb-2 sm:pb-4 border-b border-border/30">
          <DialogTitle className="font-serif text-lg sm:text-2xl text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            報告試閱
          </DialogTitle>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            體驗三種版本的內容風格
          </p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2 sm:mt-4">
          <TabsList className="grid grid-cols-3 w-full bg-muted/30 h-auto p-1 gap-1">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5 min-h-[44px] px-2 sm:px-4 touch-manipulation active:scale-95 transition-transform"
            >
              <BookOpen className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">認識自己</span>
            </TabsTrigger>
            <TabsTrigger 
              value="standard" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5 min-h-[44px] px-2 sm:px-4 touch-manipulation active:scale-95 transition-transform"
            >
              <Eye className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">看懂自己</span>
            </TabsTrigger>
            <TabsTrigger 
              value="flagship"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5 min-h-[44px] px-2 sm:px-4 touch-manipulation active:scale-95 transition-transform"
            >
              <Crown className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">使用自己</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Swipe hint for mobile */}
          {isMobile && (
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <ChevronLeft className="h-3 w-3" />
              <span>左右滑動切換版本</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
          
          {/* Swipeable content area */}
          <div {...(isMobile ? bind() : {})} className="touch-pan-y">
            {/* Basic Version */}
            <TabsContent value="basic" className="mt-3 sm:mt-6">
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-500/10 border border-slate-500/20">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">基本版特色</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      入門首選——讓你知道「你是誰」＋「有解」。5 章節精華。
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-420px)] sm:h-[400px] -mx-3 px-3 sm:mx-0 sm:px-0 sm:pr-4">
                <div className="space-y-4 sm:space-y-6 pb-4">
                  {basicPreviewSections.map((section, index) => (
                    <PreviewSection key={index} section={section} index={index} variant="basic" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          
            {/* Standard Version */}
            <TabsContent value="standard" className="mt-3 sm:mt-6">
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">標準版特色</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      完整八大面向解析，幫助你「看懂自己」的運作模式。
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-420px)] sm:h-[400px] -mx-3 px-3 sm:mx-0 sm:px-0 sm:pr-4">
                <div className="space-y-4 sm:space-y-6 pb-4">
                  {standardPreviewSections.map((section, index) => (
                    <PreviewSection key={index} section={section} index={index} variant="standard" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Flagship Version */}
            <TabsContent value="flagship" className="mt-3 sm:mt-6">
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">旗艦版特色</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      整合「默默超思維系統」，學會「使用自己」。
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-420px)] sm:h-[400px] -mx-3 px-3 sm:mx-0 sm:px-0 sm:pr-4">
                <div className="space-y-4 sm:space-y-6 pb-4">
                  {flagshipPreviewSections.map((section, index) => (
                    <PreviewSection key={index} section={section} index={index} variant="flagship" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left flex items-center gap-1">
            <Lock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>完整報告：基本版 5 章、標準版 8 章、旗艦版 10 章</span>
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto min-h-[44px] touch-manipulation active:scale-95 transition-transform"
            onClick={() => window.location.href = '/report'}
          >
            <Zap className="h-4 w-4 mr-2" />
            了解完整方案
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PreviewSectionProps {
  section: {
    title: string;
    content: string;
    isLocked: boolean;
  };
  index: number;
  variant?: "basic" | "standard" | "flagship";
}

const PreviewSection = ({ section, index, variant = "standard" }: PreviewSectionProps) => {
  const getAccentColors = () => {
    switch (variant) {
      case "basic":
        return {
          badge: "bg-slate-500/20 text-slate-400",
          border: "border-slate-500/30",
          hover: "hover:border-slate-500/40",
        };
      case "standard":
        return {
          badge: "bg-blue-500/20 text-blue-400",
          border: "border-blue-500/30",
          hover: "hover:border-blue-500/40",
        };
      case "flagship":
        return {
          badge: "bg-amber-500/20 text-amber-600",
          border: "border-amber-500/30",
          hover: "hover:border-amber-500/40",
        };
    }
  };

  const colors = getAccentColors();
  
  return (
    <div 
      className={`
        rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-300
        ${section.isLocked 
          ? 'bg-muted/20 border border-dashed border-border/50' 
          : `bg-card border ${colors.border} ${colors.hover} shadow-sm`
        }
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${colors.badge}`}>
          {index + 1}
        </div>
        <h3 className="font-serif text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="break-words">{section.title}</span>
          {section.isLocked && <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />}
        </h3>
      </div>
      
      <div className={`
        font-serif text-xs sm:text-sm leading-relaxed whitespace-pre-line overflow-x-auto
        ${section.isLocked ? 'text-muted-foreground' : 'text-foreground/90'}
      `}>
        <div className="min-w-0 break-words">
          {section.content}
        </div>
      </div>
      
      {section.isLocked && (
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3 flex-shrink-0" />
          <span>此內容需購買完整報告後解鎖</span>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;