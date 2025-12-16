import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Crown, Lock, ChevronRight, Sparkles, Brain, Heart, Compass, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [activeTab, setActiveTab] = useState("standard");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="group bg-card/50 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
        >
          <BookOpen className="h-5 w-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
          免費試閱報告
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[85vh] bg-card border-border/50">
        <DialogHeader className="pb-4 border-b border-border/30">
          <DialogTitle className="font-serif text-2xl text-foreground flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            報告試閱
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">
            體驗「默默超全方位命理解讀報告」的寫作風格與內容深度
          </p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-muted/30">
            <TabsTrigger 
              value="standard" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Brain className="h-4 w-4 mr-2" />
              標準版「看懂自己」
            </TabsTrigger>
            <TabsTrigger 
              value="flagship"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              旗艦版「使用自己」
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="mt-6">
            <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">標準版特色</h4>
                  <p className="text-sm text-muted-foreground">
                    四系統交叉參照分析，幫助你「看懂自己」的運作模式。適合第一次接觸命理報告的讀者。
                  </p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {standardPreviewSections.map((section, index) => (
                  <PreviewSection key={index} section={section} index={index} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="flagship" className="mt-6">
            <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">旗艦版特色</h4>
                  <p className="text-sm text-muted-foreground">
                    整合「默默超思維系統」，不只看懂自己，更學會「使用自己」。包含專屬思維啟動器與四時八字軍團敘事。
                  </p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {flagshipPreviewSections.map((section, index) => (
                  <PreviewSection key={index} section={section} index={index} isFlagship />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            <Lock className="h-4 w-4 inline mr-1" />
            完整報告包含 19+ 章節、80,000+ 字深度解析
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
  isFlagship?: boolean;
}

const PreviewSection = ({ section, index, isFlagship }: PreviewSectionProps) => {
  const accentColor = isFlagship ? "amber-500" : "primary";
  
  return (
    <div 
      className={`
        rounded-xl p-6 transition-all duration-300
        ${section.isLocked 
          ? 'bg-muted/20 border border-dashed border-border/50' 
          : 'bg-card border border-border/30 shadow-sm'
        }
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
          ${isFlagship 
            ? 'bg-amber-500/20 text-amber-600' 
            : 'bg-primary/20 text-primary'
          }
        `}>
          {index + 1}
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          {section.title}
          {section.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
        </h3>
      </div>
      
      <div className={`
        font-serif text-sm leading-relaxed whitespace-pre-line
        ${section.isLocked ? 'text-muted-foreground' : 'text-foreground/90'}
      `}>
        {section.content}
      </div>
      
      {section.isLocked && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>此內容需購買完整報告後解鎖</span>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
