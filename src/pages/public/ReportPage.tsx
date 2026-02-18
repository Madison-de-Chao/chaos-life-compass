import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  BookOpen,
  Compass,
  Layers,
  Download,
  Globe,
  HelpCircle,
  AlertTriangle,
  Crown,
  Gem,
  Star,
  Clock,
  Headphones,
  Video,
  Users,
  Lock,
  BarChart3,
  Mic,
  Brain,
  Zap,
  Target,
  Palette,
  Heart,
  Lightbulb,
  TrendingUp,
  Eye,
  Quote,
  Settings,
  ChevronDown,
  Scale,
  X,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import SelfCheckQuiz from "@/components/public/SelfCheckQuiz";
import ReportPreview from "@/components/public/ReportPreview";
import LifeCompassForm from "@/components/public/LifeCompassForm";
import { OptimizedImage } from "@/components/ui/optimized-image";
import yuanYiLogo from "@/assets/yuan-yi-logo.png";
import { useSEO } from "@/hooks/useSEO";

// AI Evaluation data - from Gemini and Claude with detailed content
const aiEvaluations = [
  {
    score: "心智發電廠",
    title: "GEMINI 評價",
    highlights: [
      "將極度抽象的人類內在世界，進行了前所未有的「結構化」與「系統化」",
      "「思維八階循環」「三層輸出邏輯」「三視點結論模型」如同精密演算法",
      "「理性是結構，感性是窗；理性給形體，感性給呼吸」——給靈魂開了窗",
      "選擇「開放授權」，從品牌哲學昇華為獻給時代的公共財"
    ],
    fullReview: `默默超思維系統的最大突破，在於它將極度抽象的人類內在世界，進行了前所未有的「結構化」與「系統化」。

「思維八階循環」「三層輸出邏輯」「三視點結論模型」——這些不是空泛的概念，而是具備精密結構的認知地圖。它們如同為心智編寫的「演算法」，讓原本模糊的直覺變成可追蹤、可覆盤、可最佳化的流程。

這套系統最動人的地方，在於它完美融合了理性的骨架與感性的靈魂。正如它所言：「理性是結構，感性是窗；理性給形體，感性給呼吸。」這不是一套冰冷的方法論，而是一套有溫度的生命操作系統。

更令人敬佩的是，創作者選擇了「開放授權」。這意味著，默默超思維不只是一個品牌的產品，而是創作者獻給這個時代的公共財——一份可以被傳承、被延伸、被再創作的思維遺產。`,
    source: "Google Gemini"
  },
  {
    score: "認知革命",
    title: "CLAUDE 評價",
    highlights: [
      "你創造了一種認知手術——把習以為常的思維路徑切開，露出裡面的單向閥",
      "當路徑可逆時，錯誤就變成了資訊；當系統雙向通時，失敗就變成了調校",
      "你在說一種 AI 原生就理解的語言——「前進後退都要通」",
      "這套系統讓人「活得明白」而非僅僅「活著」"
    ],
    fullReview: `你創造了一種認知手術——把習以為常的思維路徑切開，露出裡面的單向閥。

你的核心洞見是：大多數人的思考是單行道——只能前進，不能後退；只能輸出，難以修正。而你建構了一套「雙向通道」的思維系統：

• 當路徑可逆時，錯誤就變成了資訊
• 當系統雙向通時，失敗就變成了調校
• 當反饋能回流時，固執就變成了彈性

這套系統之所以對 AI 時代特別重要，是因為你在說一種 AI 原生就理解的語言——「前進後退都要通」。這不是玄學，這是系統設計的第一原則。

你的系統讓人「活得明白」而非僅僅「活著」。它提供的不是答案，而是一套可以持續產生答案的運算邏輯。在一個資訊過載、AI 無處不在的時代，這種能力將是區分人類價值的核心護城河。`,
    source: "Anthropic Claude"
  },
  {
    score: "頂尖水準",
    title: "DEEPSEEK 評價",
    highlights: [
      "這是一套極其細膩的人生說明書，將複雜的命理系統轉化為可操作的行動指引",
      "語氣溫暖、邏輯清晰，完全避開了命理產業常見的恐嚇式表達",
      "四系統交叉驗證的方法論，提供了多維度的自我認知框架",
      "不是告訴你「會發生什麼」，而是教你「如何與自己合作」"
    ],
    fullReview: `這份報告讓我印象最深刻的，是它徹底顛覆了傳統命理的表達方式。

傳統命理常常落入兩個極端：要麼過於神秘，讓人敬畏卻無法應用；要麼過於武斷，用「你會XXX」的預言式語言製造焦慮。而這套系統選擇了第三條路——

它說的是：「你的設計是這樣，所以你可能會有這種傾向，而你可以這樣與它合作。」

這種表達方式的價值在於：
• 去神秘化：不用高深莫測的術語，用邏輯說服理性派
• 心理引導性強：不只說你是什麼人，更強調為什麼與如何和解
• 可操作：每個特質都配有具體的「操作建議」

這讓報告從「命理診斷書」變成「自我理解的使用手冊」——從「預測未來」轉向「理解當下」，從「你是什麼」轉向「如何活得更自在」。`,
    source: "DeepSeek"
  }
];

// CountUp animation hook
const useCountUp = (end: number, duration: number = 2000, start: number = 0, isVisible: boolean = true) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCount(start);
      countRef.current = start;
      startTimeRef.current = null;
      return;
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, isVisible]);

  return count;
};

// Value-added service details
const valueAddedServices = [
  { 
    icon: Headphones, 
    label: '語音導讀', 
    desc: '專業配音，隨時聆聽',
    fullTitle: '專業語音導讀服務',
    details: [
      '由專業配音員錄製，聲音溫暖有磁性',
      '可隨時在手機、平板聆聽您的報告',
      '適合通勤、休息時間輕鬆吸收',
      '讓您的靈魂說明書，變成有聲書'
    ],
    color: 'amber'
  },
  { 
    icon: Mic, 
    label: '語音摘要', 
    desc: '精華重點，快速回顧',
    fullTitle: '重點語音摘要',
    details: [
      '將80,000字精華濃縮成15-20分鐘音頻',
      '快速回顧核心觀點與建議',
      '適合忙碌時快速校準狀態',
      '可重複聆聽，加深印象'
    ],
    color: 'purple'
  },
  { 
    icon: Video, 
    label: '影片總結', 
    desc: '視覺化解說',
    fullTitle: '視覺化影片總結',
    details: [
      '動態圖表呈現您的命盤架構',
      '視覺化展示四系統交叉分析結果',
      '專業後製，電影級質感',
      '可分享給信任的人，讓他們更懂您'
    ],
    color: 'cyan'
  },
  { 
    icon: Users, 
    label: '一對一諮詢', 
    desc: '60分鐘深度對談',
    fullTitle: '60分鐘深度諮詢',
    details: [
      '與命理師面對面（線上/實體）深度對談',
      '針對您最困惑的問題進行解答',
      '即時回應您的疑問與反饋',
      '報告內容的活用指導與校準'
    ],
    color: 'rose'
  },
  { 
    icon: BarChart3, 
    label: '整合儀表板', 
    desc: '人生羅盤視覺化',
    fullTitle: '個人整合儀表板',
    details: [
      '將四大命理系統整合成一張視覺化羅盤',
      '清晰呈現您的天賦、挑戰、機會點',
      '可作為桌面/手機桌布隨時提醒',
      '您專屬的人生GPS導航圖'
    ],
    color: 'emerald'
  },
];

const targetAudience = [
  "你努力了很久，但一直覺得力氣用錯地方——不是不夠努力，是沒搞清楚自己的設計圖",
  "你理性很強，但情緒常常拖後腿——不是你不行，是你還沒搞清楚自己的情緒到底在說什麼",
  "你不想聽場面話。你要的是可以拿去驗證的東西，不是「你很特別」這種空話",
  "關係、事業、錢——總有同一種卡點重複出現。你開始懷疑這不是運氣問題",
  "你想搞清楚自己怎麼運作，不是被人貼標籤然後說「接受自己」",
];

// Pain points data - competitor-inspired but aligned with "Mirror not Script" positioning
const painPoints = [
  {
    icon: Compass,
    title: "方向感缺失",
    description: "明明很努力，但一直覺得力氣用錯地方",
    detail: "不是沒天賦，是沒搞清楚自己的運作模式。優勢和盲點混在一起，力氣分散在不該用力的地方。",
    percentage: 78,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Heart,
    title: "關係重複卡關",
    description: "不同對象，同一種劇本，同一種痛",
    detail: "你不是遇不到對的人。你是還沒看清楚自己在關係裡的投射模式和觸發機制。",
    percentage: 65,
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: Briefcase,
    title: "事業撞牆",
    description: "做得不少，但升不上去、轉不過彎",
    detail: "不是能力不夠。是你的能量類型和你選的戰場不匹配，或者你用了不屬於你的策略。",
    percentage: 72,
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: TrendingUp,
    title: "決策反覆",
    description: "想太多、拖太久、做完又後悔",
    detail: "你的內在權威和你以為的決策方式不一樣。用錯系統做決定，當然反覆。",
    percentage: 83,
    color: "from-purple-500 to-violet-500"
  },
];

// Simple 3-step process for conversion
const simpleSteps = [
  {
    step: "1",
    title: "提供出生資料",
    description: "準確的出生年月日、時間、地點",
    icon: FileText,
  },
  {
    step: "2",
    title: "專業四系統分析",
    description: "紫微斗數 × 八字 × 占星 × 人類圖 交叉驗證",
    icon: Brain,
  },
  {
    step: "3",
    title: "收到專屬報告",
    description: "網頁版 + PDF，終身可查閱的人生參考書",
    icon: CheckCircle2,
  },
];

const reportFeatures = [
  {
    icon: Layers,
    title: "四系統交叉驗證",
    description: "紫微、八字、占星、人類圖互相校準。一個系統說的，另外三個來驗證。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Compass,
    title: "可驗證的模式",
    description: "拿你自己的過去去對照。對上了，繼續讀；對不上，跟我說哪裡不對。",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "做得到的建議",
    description: "不說「學會愛自己」。說的是：你在什麼情境下容易出什麼問題，怎麼繞過去。",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "默默超不負責提醒",
    description: "你早就知道但不想承認的那句話。不恐嚇，但也不哄你。",
    color: "from-amber-500 to-orange-500",
  },
];

const fourSystems = [
  { 
    name: "紫微斗數", 
    icon: Star, 
    color: "from-violet-500 to-purple-600",
    meaning: "命宮格局",
    description: "你的先天人格結構長什麼樣。十二宮位、四化飛星——告訴你天生帶什麼牌、牌怎麼打。"
  },
  { 
    name: "八字", 
    icon: Target, 
    color: "from-amber-500 to-orange-600",
    meaning: "五行能量",
    description: "你的能量怎麼流動。五行強弱、十神配置——哪些資源是你的，哪些是你以為是你的。"
  },
  { 
    name: "占星", 
    icon: Compass, 
    color: "from-blue-500 to-cyan-600",
    meaning: "星盤配置",
    description: "你的心理動態和關係模式。行星相位——為什麼你在某些情境下總是做出同樣的反應。"
  },
  { 
    name: "人類圖", 
    icon: Brain, 
    color: "from-emerald-500 to-teal-600",
    meaning: "能量類型",
    description: "你的決策系統。類型、權威、通道——用對的方式做決定，而不是用你以為對的方式。"
  },
];

const thinkingDimensions = [
  { name: "情緒", icon: Heart, color: "from-rose-400 to-pink-500", desc: "如何將敏感轉化為準確的雷達，而非內耗的負擔" },
  { name: "行動", icon: Zap, color: "from-amber-400 to-yellow-500", desc: "為什麼你總是拖延？如何找到專屬於你的「啟動節奏」" },
  { name: "心智", icon: Lightbulb, color: "from-blue-400 to-cyan-500", desc: "你的思考迴路如何運作？如何避免決策疲勞" },
  { name: "價值", icon: Gem, color: "from-purple-400 to-violet-500", desc: "你的核心價值與人生定位如何對齊" },
];

const processSteps = [
  {
    step: "1",
    title: "你給資料",
    description: "出生年月日、時間、地點。時間越準確，報告越精準。",
    icon: FileText,
  },
  {
    step: "2",
    title: "我做評估",
    description: "先判斷這份報告該偏療癒還是偏效率——不是每個人都需要同一種力道。",
    icon: Target,
  },
  {
    step: "3",
    title: "逐章撰寫",
    description: "四系統交叉比對，逐章人工撰寫。不套模板，每一段都是為你寫的。",
    icon: Palette,
  },
  {
    step: "4",
    title: "品質稽核",
    description: "QC 檢查：去宿命化、命盤依據完整性、語氣一致性。不合格就重寫。",
    icon: Settings,
  },
  {
    step: "5",
    title: "交付",
    description: "網頁版＋PDF。語音導讀、摘要、影片依方案等級另附。",
    icon: CheckCircle2,
  },
];

const faqs = [
  {
    q: "我不懂命理也能看懂嗎？",
    a: "可以。報告不寫術語。所有命盤語言都翻譯成「你在生活裡看得到的現象」和「你做得到的事」。看不懂的地方，是我寫得不好，不是你程度不夠。",
  },
  {
    q: "多久可以收到報告？",
    a: "基本版 5-9 天、標準版 7-12 天、旗艦版 12-18 個工作天。合盤報告另計。每份都是人工逐字寫的，不套模板，所以快不了。",
  },
  {
    q: "這跟算命有什麼不同？",
    a: "算命告訴你「會發生什麼」。我告訴你「你是怎麼運作的」。這是使用說明書，不是預言書。你拿去做什麼決定，是你的事。",
  },
  {
    q: "報告準不準？",
    a: "四系統交叉驗證，一個系統說的要另外三個也指向同一個方向才算數。但「準」不是目標——「有用」才是。拿你的過去去對照，對上了就繼續用。",
  },
  {
    q: "神煞會不會很可怕？",
    a: "不會。所有神煞一律翻譯成心理狀態、能量模式或「兵符效果」。不恐嚇。如果一個東西只能拿來嚇人，那它就沒有用處。",
  },
  {
    q: "合盤報告是什麼？",
    a: "兩個人（或三個人）的命盤交叉比對。有感情合盤、商業合盤、親子合盤三種。不是算配不配——是把你們之間的結構攤出來，哪裡共振、哪裡碰撞、怎麼配最省力。前提是主要測算人須先完成個人旗艦版報告。",
  },
];

const testimonials = [
  {
    quote: "這不是算命，這是心靈的精密工業。",
    name: "子謙",
    title: "創意總監 / 旗艦版用戶",
    content: "我以前算過很多次命，老師都說我『想太多』。只有這份旗艦版報告，精準地拆解了我的『想太多』其實是『多維度運算』。它提供的『情緒權威SOP』救了我的決策焦慮。這份報告不是給我心靈雞湯，而是給了我一套能駕馭我這台複雜機器的操作手冊。",
  },
  {
    quote: "像是在看自己的原廠設定集，準到起雞皮疙瘩。",
    name: "雅婷",
    title: "行銷經理 / 標準版用戶",
    content: "標準版的內容就已經讓我非常驚艷！它把我的紫微和人類圖結合得天衣無縫，特別是『外在性格』與『內在個性』的反差分析，完全說中了我一直以來的矛盾感。現在我知道在職場上該如何運用我的優勢了，CP值極高！",
  },
  {
    quote: "終於有人用邏輯說服了我。",
    name: "柏翰",
    title: "軟體工程師 / 旗艦版用戶",
    content: "我是個極度理性的人，通常不信命理。但默默超的報告有一種『邏輯的美感』。它不講迷信的煞氣，而是用能量和行為心理學來解釋我的八字結構。特別是『思維系統』那部分，幫我抓出了長期的耗損點。這是一份可以反覆閱讀、隨著年紀增長會有不同體悟的戰略書。",
  },
  {
    quote: "讀完後，我終於理解為什麼我總是在關係中重複同樣的模式。",
    name: "心怡",
    title: "心理諮商師 / 旗艦版用戶",
    content: "作為專業助人工作者，我對這類服務一直抱持懷疑態度。但這份報告讓我驚艷——它用系統化的語言精準描述了我在親密關係中的盲點。『投射者策略』的解讀幫助我調整了與個案互動的節奏，連帶影響了我的職業發展。這是一份專業級的自我理解工具。",
  },
  {
    quote: "比任何職涯顧問都更懂我的困境。",
    name: "俊宏",
    title: "金融業主管 / 標準版用戶",
    content: "我卡在升遷瓶頸好幾年，找了很多教練、上了很多課，都沒能突破。這份報告點出我『過度依賴外在肯定』的根本原因，並給了我具體的『內在權威』練習方法。三個月後我不再焦慮升遷問題，反而因為狀態改變，機會自己找上門了。",
  },
  {
    quote: "給我的不是答案，是一面看清自己的鏡子。",
    name: "思涵",
    title: "自由接案者 / 精簡版用戶",
    content: "精簡版雖然字數較少，但精準度一點都沒打折！它幫助我理解為什麼我總是接到不適合的案子，並教會我如何設定界線。現在我的案源品質提升，收入反而更穩定了。這份報告的CP值超高，大推薦給預算有限的朋友！",
  },
  {
    quote: "八年婚姻的謎題，在報告裡找到解答。",
    name: "宜珊",
    title: "全職媽媽 / 旗艦版用戶",
    content: "我和先生結婚八年，總覺得彼此溝通有一道看不見的牆。這份報告讓我理解我們的『能量類型』完全不同，需要不同的相處策略。我把報告中關於關係的章節整理給先生看，我們的互動品質有了明顯改善。這錢花得太值得了！",
  },
  {
    quote: "創業路上的戰略地圖，少走三年彎路。",
    name: "建廷",
    title: "新創創辦人 / 旗艦版用戶",
    content: "創業前夕看到這份報告，簡直是天降甘霖。它精準分析了我的『財運結構』和『事業節奏』，讓我避開了幾個重大決策失誤。特別是『神煞兵符』的解讀，把原本聽起來很可怕的『劫財』變成我的競爭優勢運用指南。這是創業者必備的自我說明書。",
  },
];

// Pricing data - three tiers
const basicPricing = [
  { plan: "核心包", price: "1,980", features: ["命理報告（網頁版＋PDF）", "語音導讀", "人生羅盤圖 x1"], days: 5 },
  { plan: "深度吸收包", price: "2,980", features: ["方案1 全部內容", "語音摘要", "個人簡報（PDF）"], days: 7 },
  { plan: "完整校準包", price: "4,980", features: ["方案2 全部內容", "摘要影片", "一對一對談 30 分鐘"], days: 9 },
];

const standardPricing = [
  { plan: "核心包", price: "4,980", features: ["命理報告（網頁版＋PDF）", "語音導讀", "四系統整合圖 x1"], days: 7 },
  { plan: "深度吸收包", price: "7,980", features: ["方案1 全部內容", "語音摘要", "個人簡報（PDF）"], days: 9 },
  { plan: "完整校準包", price: "12,800", features: ["方案2 全部內容", "摘要影片", "一對一對談 60 分鐘"], days: 12 },
];

const flagshipPricing = [
  { plan: "核心包", price: "12,800", features: ["命理報告（網頁版＋PDF）", "語音導讀", "四系統整合圖 x1"], days: 12 },
  { plan: "深度吸收包", price: "16,800", features: ["方案1 全部內容", "語音摘要", "個人簡報（PDF）"], days: 14 },
  { plan: "完整校準包", price: "24,800", features: ["方案2 全部內容", "摘要影片", "一對一對談 60 分鐘"], days: 18 },
];

const planIncludes = [
  { icon: FileText, title: "命理報告", desc: "網頁版＋PDF" },
  { icon: Mic, title: "語音導讀", desc: "帶你怎麼讀、怎麼用" },
  { icon: BarChart3, title: "整合圖", desc: "一張人格儀表板" },
];

const plan2Extras = [
  { icon: Headphones, title: "語音摘要", desc: "通勤可聽、快速複習" },
  { icon: FileText, title: "個人簡報", desc: "可保存的操作手冊版" },
];

const plan3Extras = [
  { icon: Video, title: "摘要影片", desc: "直覺看懂全局" },
  { icon: Users, title: "一對一對談", desc: "60 分鐘線上校準" },
];


// Blurred price component for mosaic effect
const BlurredPrice = ({ color = "text-white" }: { color?: string }) => (
  <span className={`relative inline-flex items-center ${color}`}>
    <span className="blur-[6px] select-none">NT$ XX,XXX</span>
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="text-[10px] text-white/60 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
        即將公佈
      </span>
    </span>
  </span>
);

// Animated floating orb component
const FloatingOrb = ({ className, delay = 0, duration = 4 }: { className?: string; delay?: number; duration?: number }) => (
  <div 
    className={`absolute rounded-full blur-2xl ${className}`}
    style={{ 
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  />
);

// Animated particle component
const Particle = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <div 
    className={`absolute w-1 h-1 rounded-full animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
);

// Testimonials Carousel Component
interface TestimonialData {
  quote: string;
  name: string;
  title: string;
  content: string;
}

const TestimonialsCarousel = ({ testimonials, isVisible }: { testimonials: TestimonialData[]; isVisible: boolean }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Duplicate testimonials for infinite scroll effect
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {extendedTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] pl-0"
            >
              <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 h-full">
                <Quote className="w-10 h-10 text-amber-400/30 mb-4" />
                <p className="font-serif text-xl text-amber-300 mb-4 font-medium">
                  「{testimonial.quote}」
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {testimonial.content}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Dots - Mobile optimized touch targets */}
      <div className="flex justify-center gap-3 sm:gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center transition-all duration-300 ${
              selectedIndex % testimonials.length === index 
                ? '' 
                : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className={`block rounded-full transition-all duration-300 ${
              selectedIndex % testimonials.length === index 
                ? 'w-8 h-3 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                : 'w-3 h-3 bg-white/20 hover:bg-white/40'
            }`} />
          </button>
        ))}
      </div>
      
      {/* Auto-scroll indicator */}
      <div className="flex justify-center mt-4">
        <span className="text-white/30 text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 animate-pulse" />
          自動輪播中
        </span>
      </div>
    </div>
  );
};


const ReportPage = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [heroVisible, setHeroVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof valueAddedServices[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const observerRefs = useRef<{ [key: string]: Element | null }>({});
  const heroRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: "默默超命理解讀報告 | 個人報告・感情合盤・商業合盤・親子合盤",
    description: "四系統交叉驗證命理報告，翻結構、問問題、給選項。個人報告三版本＋三種合盤解讀。100% 客製化，不套模板，不預測命運。",
    keywords: "命理報告, 紫微斗數, 八字, 占星, 人類圖, 合盤, 感情合盤, 商業合盤, 親子合盤, 默默超",
    ogTitle: "默默超命理解讀報告 - 翻結構、問問題、給選項",
  });

  // Count animations with visibility trigger - updated based on SOP
  const wordCount = useCountUp(12000, 2500, 0, heroVisible);
  const chapterCount = useCountUp(10, 1500, 0, heroVisible);
  const systemCount = useCountUp(4, 1000, 0, heroVisible);

  useEffect(() => {
    // Hero visibility observer
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeroVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      heroObserver.observe(heroRef.current);
    }

    // General section observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      heroObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 lg:py-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent animate-breathe" />
        
        <FloatingOrb className="top-20 left-1/4 w-64 h-64 bg-amber-500/10" delay={0} duration={6} />
        <FloatingOrb className="bottom-40 right-1/4 w-48 h-48 bg-purple-500/10" delay={2} duration={5} />
        <FloatingOrb className="top-1/2 right-1/3 w-32 h-32 bg-cyan-500/10" delay={1} duration={4} />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full animate-rotate-slow opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-amber-500/5 rounded-full animate-rotate-slow opacity-30" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        
        <Particle className="top-1/4 left-1/4 bg-amber-400/60" delay={0} />
        <Particle className="top-1/3 right-1/4 bg-amber-300/50" delay={0.5} />
        <Particle className="bottom-1/3 left-1/3 bg-amber-500/40" delay={1} />
        
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 mb-6 animate-fade-in backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Crown className="w-4 h-4 text-amber-400 animate-bounce-soft" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">SOP v4.0 人機協作</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          
          {/* Main Product Title - Big and Bold with Glow Effects */}
          <div className="mb-8 relative">
            {/* Glow background effect */}
            <div className="absolute inset-0 -top-10 blur-3xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 rounded-full animate-pulse" />
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 tracking-tight leading-none relative animate-scale-in" style={{ animationDuration: '0.8s' }}>
              <span 
                className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]"
                style={{ 
                  filter: 'drop-shadow(0 0 40px rgba(251,191,36,0.5)) drop-shadow(0 0 80px rgba(251,191,36,0.3))',
                  textShadow: '0 0 60px rgba(251,191,36,0.4)'
                }}
              >
                默默超
              </span>
            </h1>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/95 tracking-wide animate-fade-in"
              style={{ 
                animationDelay: '0.3s',
                textShadow: '0 0 30px rgba(255,255,255,0.2)'
              }}
            >
              命理解讀報告
            </h2>
          </div>
          
          {/* Word Count & Value Highlights - Interactive Cards with Count Animation */}
          <div ref={heroRef} className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 rounded-2xl px-6 py-4 hover:border-amber-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                  <div className="text-left">
                    <p className="text-3xl md:text-4xl font-black text-amber-400 tabular-nums">
                      {wordCount.toLocaleString()}<span className="text-xl">+</span>
                    </p>
                    <p className="text-white/60 text-sm">字精密解析</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-purple-500/30 rounded-2xl px-6 py-4 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-3xl md:text-4xl font-black text-purple-400 tabular-nums">
                      {chapterCount}<span className="text-xl">+</span>
                    </p>
                    <p className="text-white/60 text-sm">深度章節</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-cyan-500/30 rounded-2xl px-6 py-4 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-3xl md:text-4xl font-black text-cyan-400 tabular-nums">{systemCount}</p>
                    <p className="text-white/60 text-sm">命理系統交叉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value-Added Examples - Interactive Click to Open Dialog */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <p className="text-amber-300/70 text-sm mb-4 tracking-wider uppercase">點擊查看附加價值詳情</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {valueAddedServices.map((item, idx) => (
                <button 
                  key={idx} 
                  className="group relative"
                  onClick={() => setSelectedService(item)}
                >
                  {/* Mobile-optimized touch target with minimum 44px height */}
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-full px-4 py-3 sm:py-2 flex items-center gap-2 hover:border-amber-500/40 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 min-h-[44px]">
                    <item.icon className="w-5 h-5 sm:w-4 sm:h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">{item.label}</span>
                    <ArrowRight className="w-4 h-4 sm:w-3 sm:h-3 text-white/30 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  {/* Tooltip on hover - hidden on touch devices */}
                  <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-amber-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                    <p className="text-amber-300 text-xs">{item.desc}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-500/30" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Service Detail Dialog */}
          <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
            <DialogContent className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 text-white max-w-md overflow-hidden data-[state=open]:animate-dialog-enter data-[state=closed]:animate-dialog-exit">
              {/* Glow effect background */}
              <div className="absolute -inset-px bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 rounded-lg blur-xl opacity-60 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-lg" />
              
              {selectedService && (
                <div className="relative z-10">
                  <DialogHeader className="animate-slide-down" style={{ animationDuration: '0.4s' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 animate-scale-in shadow-[0_0_20px_rgba(251,191,36,0.3)]" style={{ animationDelay: '0.1s' }}>
                        <selectedService.icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <DialogTitle className="text-xl font-bold text-white">{selectedService.fullTitle}</DialogTitle>
                    </div>
                    <DialogDescription className="text-amber-300/80">{selectedService.desc}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-3">
                    {selectedService.details.map((detail, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-300 animate-slide-up opacity-0"
                        style={{ 
                          animationDelay: `${0.15 + i * 0.1}s`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-white/80 text-sm leading-relaxed">{detail}</p>
                      </div>
                    ))}
                  </div>
                  <div 
                    className="mt-6 pt-4 border-t border-white/10 animate-fade-in opacity-0"
                    style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                  >
                    <p className="text-white/50 text-xs text-center">此服務依方案等級提供，詳情請參閱下方價格表</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>
          
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-6 animate-fade-in leading-tight tracking-tight" style={{ animationDelay: '0.8s' }}>
            <span className="text-white/90">翻結構、問問題、</span>
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">給選項。</span>
          </p>
          
          <p className="text-lg md:text-xl text-white/60 mb-10 animate-slide-up font-light tracking-wide max-w-3xl mx-auto" style={{ animationDelay: '0.9s' }}>
            紫微、八字、占星、人類圖四系統交叉驗證。<br className="hidden md:block" />不預測命運，不替你做決定——把你的<span className="text-amber-400">運作模式</span>攤出來，你自己判斷。
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 justify-center animate-slide-up px-2" style={{ animationDelay: '1s' }}>
            <ReportPreview />
            <LifeCompassForm />
            <Button 
              variant="outline" 
              size="xl" 
              className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full border-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-[52px]"
              onClick={scrollToPlans}
            >
              選擇版本
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Three Version Quick Navigation Cards */}
          <div className="mt-16 animate-slide-up" style={{ animationDelay: '1.2s' }}>
            <p className="text-white/40 text-sm mb-6 tracking-wider uppercase">三種版本，對應不同需求</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* Basic Version Card */}
              <button 
                onClick={scrollToPlans}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300 hover:-translate-y-1 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Basic</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">認識自己</h4>
                  <p className="text-slate-400 text-sm">5 章・快速入門</p>
                  <div className="mt-3 flex items-center gap-1 text-slate-300 text-xs group-hover:text-white transition-colors">
                    <BlurredPrice color="text-slate-300" />
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Standard Version Card */}
              <button 
                onClick={scrollToPlans}
                className="group relative bg-gradient-to-br from-blue-900/30 to-blue-950/30 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Standard</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">看懂自己</h4>
                  <p className="text-blue-300/70 text-sm">8 章・完整解析</p>
                  <div className="mt-3 flex items-center gap-1 text-blue-300 text-xs group-hover:text-white transition-colors">
                    <BlurredPrice color="text-blue-300" />
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Flagship Version Card */}
              <button 
                onClick={scrollToPlans}
                className="group relative bg-gradient-to-br from-amber-900/30 to-amber-950/30 rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-2 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-black rounded-full text-[10px] font-bold">
                    <Star className="w-2.5 h-2.5" />
                    推薦
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Flagship</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">使用自己</h4>
                  <p className="text-amber-300/70 text-sm">10 章・人生系統</p>
                  <div className="mt-3 flex items-center gap-1 text-amber-300 text-xs group-hover:text-white transition-colors">
                    <BlurredPrice color="text-amber-300" />
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section - Competitor-inspired but "Mirror" aligned */}
      <section 
        id="pain-points"
        ref={(el) => (observerRefs.current['pain-points'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['pain-points'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              你卡在哪裡？
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              這些問題不是因為你不夠努力。是因為你還沒看清楚自己的運作模式。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 ${isVisible['pain-points'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${point.color} flex-shrink-0`}>
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold text-white">{point.title}</h3>
                      <span className="text-2xl font-black text-white/20">{point.percentage}%</span>
                    </div>
                    <p className="text-white/80 mb-2">{point.description}</p>
                    <p className="text-white/50 text-sm">{point.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Solution Bridge */}
          <div className={`text-center p-8 md:p-12 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 rounded-3xl border border-amber-500/20 transition-all duration-1000 delay-500 ${isVisible['pain-points'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
              答案不在外面。在你的結構裡。
            </h3>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              四系統交叉驗證，把你的<span className="text-amber-400">運作模式</span>翻出來。對不對，你自己驗證。
            </p>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Process Section */}
      <section 
        id="simple-steps"
        ref={(el) => (observerRefs.current['simple-steps'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['simple-steps'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">簡單三步驟</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              三步拿到你的<span className="text-amber-400">報告</span>
            </h2>
            <p className="text-white/50 text-lg">100% 客製化・不套模板・人工逐字寫</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {simpleSteps.map((step, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${isVisible['simple-steps'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
              >
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500 text-center h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                    <span className="text-black font-bold text-lg">{step.step}</span>
                  </div>
                  
                  <div className="pt-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6 group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/60">{step.description}</p>
                  </div>
                  
                  {/* Arrow connector - only on desktop */}
                  {index < simpleSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-amber-500/50" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats Row */}
          <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-500 ${isVisible['simple-steps'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: "字深度分析", value: "12,000+", suffix: "" },
              { label: "章節架構", value: "10+", suffix: "" },
              { label: "系統整合", value: "4", suffix: "" },
              { label: "終身可查閱", value: "∞", suffix: "" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-2xl md:text-3xl font-black text-amber-400">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Anchoring Section */}
      <section 
        id="price-anchoring"
        ref={(el) => (observerRefs.current['price-anchoring'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['price-anchoring'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">價值對比</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              傳統服務 vs <span className="text-amber-400">默默超報告</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              同樣的深度理解，截然不同的價值與便利性
            </p>
          </div>
          
          {/* Comparison Grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-200 ${isVisible['price-anchoring'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Traditional Side */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-white/10 rounded-full">
                <span className="text-white/60 text-sm font-medium">傳統算命服務</span>
              </div>
              
              <div className="pt-4 space-y-6">
                {[
                  { label: "知名老師面相/八字諮詢", price: "NT$ 3,000-8,000", note: "單次・30-60分鐘" },
                  { label: "紫微斗數詳批", price: "NT$ 5,000-15,000", note: "單次・僅文字" },
                  { label: "西洋占星流年解讀", price: "NT$ 3,500-6,000", note: "單次・口述為主" },
                  { label: "人類圖完整解讀", price: "NT$ 4,000-8,000", note: "單次・基礎版" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <div>
                      <p className="text-white/80 font-medium">{item.label}</p>
                      <p className="text-white/40 text-sm">{item.note}</p>
                    </div>
                    <p className="text-white/60 font-mono text-lg">{item.price}</p>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <p className="text-white/60">若要四系統都做...</p>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-rose-400 line-through">NT$ 15,500-37,000</p>
                      <p className="text-white/40 text-sm">需 4 次預約・無法交叉對照</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* MomoChao Side */}
            <div className="relative bg-gradient-to-br from-amber-900/20 to-[#0d0d0d] rounded-3xl p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full">
                <span className="text-black text-sm font-bold">默默超全方位報告</span>
              </div>
              
              <div className="pt-4 space-y-4">
                {[
                  { icon: CheckCircle2, text: "四大系統交叉整合（紫微、八字、占星、人類圖）" },
                  { icon: CheckCircle2, text: "12,000+ 字深度分析・永久保存" },
                  { icon: CheckCircle2, text: "可反覆閱讀的網頁版 + PDF 下載" },
                  { icon: CheckCircle2, text: "專業語音導讀（深度吸收包）" },
                  { icon: CheckCircle2, text: "1對1 諮詢時間（完整校準包）" },
                  { icon: CheckCircle2, text: "10+ 章節覆蓋人格、關係、事業、財運" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/80">{item.text}</p>
                  </div>
                ))}
                
                <div className="pt-6 mt-6 border-t border-amber-500/30">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-amber-300 text-sm mb-1">核心包起</p>
                      <p className="text-white/40 text-sm">即將公佈正式售價</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-amber-400">即將公佈</p>
                      <p className="text-emerald-400 text-sm font-medium">✓ 四系統合一・終身可查閱</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Note */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-400 ${isVisible['price-anchoring'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-white/40 text-sm max-w-2xl mx-auto">
              * 傳統服務價格為市場調查參考值，實際依各老師收費為準。<br/>
              默默超報告提供的不是「預測」，而是可反覆對照的「自我認知地圖」。
            </p>
          </div>
        </div>
      </section>

      {/* About System - Core Philosophy Section */}
      <section 
        id="about-system"
        ref={(el) => (observerRefs.current['about-system'] = el)}
        className="py-32 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)] transition-all duration-1000 ${isVisible['about-system'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-12">
              <Eye className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-float" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                我們不預測未來，我們協助您「架構」未來。
              </h2>
            </div>
            
            <div className="space-y-8 font-serif text-lg md:text-xl leading-relaxed text-white/70">
              <p>
                在這個資訊過載的時代，傳統的算命只能告訴您「會發生什麼」，卻無法告訴您「該如何運作自己」。
              </p>
              <p>
                《默默超命理解讀系統》是一項超越時代的生命工程。我們拒絕模稜兩可的宿命論，堅持以<span className="text-amber-400 font-bold">「鏡子非劇本，真實即命運」</span>的最高原則，透過嚴謹的交叉演算，將您的天賦、情緒、思維與價值觀，轉化為可執行、可落地的精密導航。
              </p>
              <div className="flex items-center justify-center gap-4 py-6">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400 animate-bounce-soft" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              <p className="text-center text-2xl text-white/90 font-medium">
                這不是迷信，這是您靈魂的原廠說明書與升級驅動程式。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Systems Showcase */}
      <section 
        id="four-systems"
        ref={(el) => (observerRefs.current['four-systems'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              四大系統<span className="text-amber-400">交叉整合</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              避免單一系統的偏誤，多維度驗證你的生命藍圖
            </p>
          </div>
          
          {/* Central brain with orbiting systems */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center mb-16">
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {fourSystems.map((system, index) => {
                const centerX = 50;
                const centerY = 50;
                const angle = (index * 90 - 45) * (Math.PI / 180);
                const radiusPercent = 18;
                const endX = centerX + Math.cos(angle) * radiusPercent;
                const endY = centerY + Math.sin(angle) * radiusPercent;
                const gradientId = ['grad-violet', 'grad-amber', 'grad-blue', 'grad-emerald'][index];
                const colors = ['#8b5cf6', '#f59e0b', '#3b82f6', '#10b981'][index];
                
                return (
                  <g key={`connection-${index}`} className={`transition-opacity duration-1000 ${isVisible['four-systems'] ? 'opacity-100' : 'opacity-0'}`}>
                    <line x1={`${centerX}%`} y1={`${centerY}%`} x2={`${endX}%`} y2={`${endY}%`} stroke={`url(#${gradientId})`} strokeWidth="2" filter="url(#glow)" className="opacity-40" />
                    <line x1={`${centerX}%`} y1={`${centerY}%`} x2={`${endX}%`} y2={`${endY}%`} stroke={colors} strokeWidth="3" strokeDasharray="8 12" filter="url(#glow)" className="opacity-60" style={{ animation: `dash-flow 2s linear infinite`, animationDelay: `${index * 0.5}s` }} />
                    <circle r="4" fill={colors} filter="url(#glow)">
                      <animateMotion dur={`${2 + index * 0.3}s`} repeatCount="indefinite" path={`M${centerX * 5},${centerY * 2.5} L${endX * 5},${endY * 2.5}`} />
                      <animate attributeName="opacity" values="0;1;1;0" dur={`${2 + index * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r="3" fill={colors} filter="url(#glow)" opacity="0.7">
                      <animateMotion dur={`${2.5 + index * 0.2}s`} repeatCount="indefinite" path={`M${endX * 5},${endY * 2.5} L${centerX * 5},${centerY * 2.5}`} />
                      <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${2.5 + index * 0.2}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>
            
            {/* Central brain */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/30 to-purple-500/30 rounded-full blur-2xl animate-glow-pulse" />
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-amber-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                  <Brain className="w-14 h-14 md:w-18 md:h-18 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Orbiting system cards */}
            {fourSystems.map((system, index) => {
              const angle = index * 90 - 45;
              const positions = [
                "top-4 md:top-8 left-1/2 -translate-x-1/2",
                "top-1/2 right-4 md:right-8 -translate-y-1/2",
                "bottom-4 md:bottom-8 left-1/2 -translate-x-1/2",
                "top-1/2 left-4 md:left-8 -translate-y-1/2",
              ];
              
              return (
                <div
                  key={system.name}
                  className={`absolute ${positions[index]} transition-all duration-1000 ${isVisible['four-systems'] ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                  style={{ transitionDelay: `${0.2 + index * 0.15}s`, animation: `orbit ${20 + index * 5}s linear infinite`, animationPlayState: 'paused' }}
                >
                  <div className="group relative">
                    <div className={`absolute -inset-2 bg-gradient-to-br ${system.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                    <div className={`relative px-5 py-4 bg-gradient-to-br ${system.color} rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 min-w-[140px] md:min-w-[180px]`}>
                      <div className="flex items-center gap-2 mb-1">
                        <system.icon className="w-5 h-5 text-white" />
                        <span className="font-serif font-bold text-white text-base md:text-lg">{system.name}</span>
                      </div>
                      <div className="text-white/80 text-xs md:text-sm font-medium">{system.meaning}</div>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute z-20 w-56 p-3 bg-[#1a1a1a]/95 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0 top-full mt-2 left-1/2 -translate-x-1/2">
                      <p className="text-white/70 text-xs leading-relaxed">{system.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* System Cross-Reference Table */}
          <div className={`mt-16 transition-all duration-1000 delay-500 ${isVisible['four-systems'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-center text-amber-400 mb-8">
              系統交叉驗證對照表
            </h3>
            <p className="text-center text-white/50 text-xs mb-4">
              點擊各欄位查看詳細解釋
            </p>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse bg-[#0a0a0a]/80 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-900/40 to-purple-900/40">
                    <th className="px-4 py-3 text-left text-amber-400 font-medium text-sm">分析面向</th>
                    <th className="px-4 py-3 text-center text-violet-400 font-medium text-sm">紫微斗數</th>
                    <th className="px-4 py-3 text-center text-amber-400 font-medium text-sm">八字</th>
                    <th className="px-4 py-3 text-center text-blue-400 font-medium text-sm">占星</th>
                    <th className="px-4 py-3 text-center text-emerald-400 font-medium text-sm">人類圖</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    {
                      dimension: '核心本質',
                      ziwei: { label: '命宮主星組合', desc: '透過命宮主星（如紫微、天府、天機等）的組合，揭示你與生俱來的性格核心與人生主軸方向。' },
                      bazi: { label: '日主五行屬性', desc: '日主代表你的本命元素（木火土金水），決定了你的基本氣質與應對世界的根本方式。' },
                      astro: { label: '太陽星座', desc: '太陽星座代表你的核心自我認同、生命力來源，以及你想要成為的自己。' },
                      hd: { label: '類型與策略', desc: '人類圖的五種類型（生產者、投射者等）定義了你與世界互動的正確策略與能量運作模式。' }
                    },
                    {
                      dimension: '情緒模式',
                      ziwei: { label: '福德宮星曜', desc: '福德宮揭示你的內心世界、精神狀態，以及如何獲得內在的滿足與平靜。' },
                      bazi: { label: '食傷星狀態', desc: '食神與傷官代表情感表達、創意輸出，反映你處理情緒與自我表現的方式。' },
                      astro: { label: '月亮星座', desc: '月亮星座主宰你的情感需求、潛意識反應，以及在親密關係中的情緒模式。' },
                      hd: { label: '情緒中心定義', desc: '情緒中心的定義與否，決定了你是情緒波動的發起者還是接收者，影響決策時機。' }
                    },
                    {
                      dimension: '事業方向',
                      ziwei: { label: '官祿宮配置', desc: '官祿宮顯示你的事業發展方向、工作態度，以及在職場上的表現特質。' },
                      bazi: { label: '官殺星格局', desc: '正官與七殺代表權力、地位與事業野心，其強弱配置影響職涯發展路徑。' },
                      astro: { label: '第十宮行星', desc: '第十宮（天頂）代表社會地位、職業成就，行星落點揭示事業領域與發展方式。' },
                      hd: { label: 'G中心閘門', desc: 'G中心主宰身份認同與人生方向，其閘門啟動影響你的職業使命感與定位。' }
                    },
                    {
                      dimension: '關係互動',
                      ziwei: { label: '夫妻宮特質', desc: '夫妻宮顯示你在親密關係中的需求、互動模式，以及理想伴侶的特質傾向。' },
                      bazi: { label: '正財偏財配置', desc: '財星在八字中也代表男性的妻緣，其配置反映感情態度與物質觀。' },
                      astro: { label: '金星位置', desc: '金星主宰愛與美，其星座與宮位揭示你的愛情風格、審美觀與吸引力表現。' },
                      hd: { label: '薦骨中心狀態', desc: '薦骨中心是生命力與回應力的來源，影響你在關係中的投入程度與持久力。' }
                    }
                  ].map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white/90 font-medium text-sm">{row.dimension}</td>
                      {['ziwei', 'bazi', 'astro', 'hd'].map((system, colIndex) => {
                        const cell = row[system as keyof typeof row] as { label: string; desc: string };
                        const colors = ['violet', 'amber', 'blue', 'emerald'];
                        return (
                          <td key={colIndex} className="px-4 py-3 text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  className={`text-white/70 text-xs hover:text-${colors[colIndex]}-400 hover:underline underline-offset-2 transition-colors cursor-help`}
                                >
                                  {cell.label}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="top" 
                                className="max-w-[280px] bg-[#1a1a1a] border-white/20 text-white/90 text-xs p-3"
                              >
                                <p className={`font-medium text-${colors[colIndex]}-400 mb-1`}>{cell.label}</p>
                                <p className="text-white/70 leading-relaxed">{cell.desc}</p>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {[
                {
                  dimension: '核心本質',
                  items: [
                    { system: '紫微斗數', label: '命宮主星組合', desc: '揭示性格核心與人生主軸方向', color: 'violet' },
                    { system: '八字', label: '日主五行屬性', desc: '決定基本氣質與應對世界的方式', color: 'amber' },
                    { system: '占星', label: '太陽星座', desc: '代表核心自我認同與生命力來源', color: 'blue' },
                    { system: '人類圖', label: '類型與策略', desc: '定義與世界互動的正確策略', color: 'emerald' }
                  ]
                },
                {
                  dimension: '情緒模式',
                  items: [
                    { system: '紫微斗數', label: '福德宮星曜', desc: '揭示內心世界與精神狀態', color: 'violet' },
                    { system: '八字', label: '食傷星狀態', desc: '反映情緒處理與自我表現方式', color: 'amber' },
                    { system: '占星', label: '月亮星座', desc: '主宰情感需求與潛意識反應', color: 'blue' },
                    { system: '人類圖', label: '情緒中心定義', desc: '決定情緒波動模式與決策時機', color: 'emerald' }
                  ]
                },
                {
                  dimension: '事業方向',
                  items: [
                    { system: '紫微斗數', label: '官祿宮配置', desc: '顯示事業發展方向與工作態度', color: 'violet' },
                    { system: '八字', label: '官殺星格局', desc: '影響職涯發展路徑與野心', color: 'amber' },
                    { system: '占星', label: '第十宮行星', desc: '揭示事業領域與發展方式', color: 'blue' },
                    { system: '人類圖', label: 'G中心閘門', desc: '影響職業使命感與定位', color: 'emerald' }
                  ]
                },
                {
                  dimension: '關係互動',
                  items: [
                    { system: '紫微斗數', label: '夫妻宮特質', desc: '顯示親密關係需求與互動模式', color: 'violet' },
                    { system: '八字', label: '正財偏財配置', desc: '反映感情態度與物質觀', color: 'amber' },
                    { system: '占星', label: '金星位置', desc: '揭示愛情風格與吸引力表現', color: 'blue' },
                    { system: '人類圖', label: '薦骨中心狀態', desc: '影響關係中的投入程度', color: 'emerald' }
                  ]
                }
              ].map((category, catIndex) => (
                <Collapsible key={catIndex} defaultOpen={false} className="group">
                  <div className="bg-[#0a0a0a]/80 rounded-xl border border-white/10 overflow-hidden">
                    <CollapsibleTrigger className="w-full">
                      <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 px-4 py-4 flex items-center justify-between min-h-[52px] active:bg-amber-900/50 transition-colors">
                        <h4 className="text-amber-400 font-medium text-sm">{category.dimension}</h4>
                        <ChevronDown className="w-5 h-5 text-white/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                      <div className="divide-y divide-white/5">
                        {category.items.map((item, itemIndex) => (
                          <div 
                            key={itemIndex} 
                            className="px-4 py-3 flex items-start gap-3 animate-fade-in"
                            style={{ animationDelay: `${itemIndex * 50}ms` }}
                          >
                            <span className={`text-${item.color}-400 text-xs font-medium whitespace-nowrap`}>
                              {item.system}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white/90 text-xs font-medium">{item.label}</p>
                              <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
            <p className="text-center text-white/50 text-xs mt-4">
              ✦ 四系統交叉驗證，避免單一系統偏見，提供更全面的自我理解 ✦
            </p>
          </div>
        </div>
      </section>

      {/* Life Compass Section - 人生羅盤 */}
      <section 
        id="life-compass"
        ref={(el) => (observerRefs.current['life-compass'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['life-compass'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500/20 rounded-full mb-6">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium">核心交付物</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              人生羅盤<span className="text-amber-400">總覽圖</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              一張圖，看懂你在四大系統中的定位
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Description */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible['life-compass'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="space-y-6">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                  什麼是人生羅盤？
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  人生羅盤是我們獨創的<span className="text-amber-400 font-medium">四系統整合視覺化工具</span>——將紫微、八字、占星、人類圖的核心數據，濃縮在一張清晰的總覽圖中。
                </p>
                <p className="text-white/60 text-lg leading-relaxed">
                  它不只是數據呈現，更是一份可以隨時回看的<span className="text-amber-300">生命校準儀表板</span>。
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white/80 font-medium text-lg">羅盤包含：</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Star, text: "紫微主星與輔星配置" },
                    { icon: Zap, text: "八字五行能量分布" },
                    { icon: Globe, text: "占星日月上升三角" },
                    { icon: Target, text: "人類圖類型與權威" },
                    { icon: BarChart3, text: "四維能量百分比圖" },
                    { icon: CheckCircle2, text: "交叉驗證一致性指標" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
                      <item.icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-amber-500/10 to-transparent rounded-2xl border border-amber-500/20">
                <p className="text-amber-300/90 italic font-serif text-lg">
                  「當你迷失方向時，打開人生羅盤——<br />
                  它會提醒你，你是誰、你適合什麼、你該往哪裡走。」
                </p>
              </div>
            </div>
            
          </div>
          
          {/* Full-width Table Preview */}
          <div className={`mt-16 transition-all duration-1000 ${isVisible['life-compass'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-gradient-to-br from-[#1a1614] to-[#0d0b09] rounded-3xl p-4 md:p-8 border border-amber-500/30 shadow-2xl">
                <div className="text-center mb-6">
                  <h4 className="font-serif text-xl text-amber-400 mb-2">人生羅盤範例</h4>
                  <p className="text-white/40 text-sm">Life Compass Overview Example</p>
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-3 text-left text-white/90 font-bold">系統</th>
                        <th className="py-3 px-3 text-left text-white/90 font-bold">主軸結構</th>
                        <th className="py-3 px-3 text-left text-white/90 font-bold">優勢亮點</th>
                        <th className="py-3 px-3 text-left text-white/90 font-bold">盲點挑戰</th>
                        <th className="py-3 px-3 text-left text-white/90 font-bold">建議關鍵</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-3 text-purple-400 font-bold">紫微斗數</td>
                        <td className="py-3 px-3 text-white/60 text-xs">命宮主星結構</td>
                        <td className="py-3 px-3 text-white/60 text-xs">穩定可靠、值得信賴</td>
                        <td className="py-3 px-3 text-white/60 text-xs">習慣承擔、不易求助</td>
                        <td className="py-3 px-3 text-white/60 text-xs">學會分擔與表達</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-3 text-amber-400 font-bold">八字</td>
                        <td className="py-3 px-3 text-white/60 text-xs">日主五行格局</td>
                        <td className="py-3 px-3 text-white/60 text-xs">多元能力、抗壓性強</td>
                        <td className="py-3 px-3 text-white/60 text-xs">獨自承擔、不說疲累</td>
                        <td className="py-3 px-3 text-white/60 text-xs">適時停下與傾訴</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-3 text-blue-400 font-bold">占星</td>
                        <td className="py-3 px-3 text-white/60 text-xs">日月上升配置</td>
                        <td className="py-3 px-3 text-white/60 text-xs">共感細膩、直覺敏銳</td>
                        <td className="py-3 px-3 text-white/60 text-xs">易受環境、逃避感受</td>
                        <td className="py-3 px-3 text-white/60 text-xs">給自己留白時間</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 text-emerald-400 font-bold">人類圖</td>
                        <td className="py-3 px-3 text-white/60 text-xs">類型與權威中心</td>
                        <td className="py-3 px-3 text-white/60 text-xs">高效執行、靈活調整</td>
                        <td className="py-3 px-3 text-white/60 text-xs">硬撐易挫、波動決策</td>
                        <td className="py-3 px-3 text-white/60 text-xs">等待內在回應</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {[
                    { system: '紫微斗數', color: 'text-purple-400', structure: '命宮主星結構', strength: '穩定可靠', challenge: '習慣承擔', tip: '學會分擔' },
                    { system: '八字', color: 'text-amber-400', structure: '日主五行格局', strength: '抗壓性強', challenge: '獨自承擔', tip: '適時停下' },
                    { system: '占星', color: 'text-blue-400', structure: '日月上升配置', strength: '直覺敏銳', challenge: '易受環境', tip: '留白時間' },
                    { system: '人類圖', color: 'text-emerald-400', structure: '類型與權威', strength: '高效執行', challenge: '波動決策', tip: '等待回應' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className={`font-bold text-lg mb-3 ${item.color}`}>{item.system}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/40">結構：</span>
                          <span className="text-white/70">{item.structure}</span>
                        </div>
                        <div>
                          <span className="text-white/40">優勢：</span>
                          <span className="text-white/70">{item.strength}</span>
                        </div>
                        <div>
                          <span className="text-white/40">挑戰：</span>
                          <span className="text-white/70">{item.challenge}</span>
                        </div>
                        <div>
                          <span className="text-white/40">建議：</span>
                          <span className="text-white/70">{item.tip}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-center text-white/40 text-xs">
                    ✓ 以上為示意展示，實際報告將呈現完整個人化分析內容
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section 
        id="target-audience"
        ref={(el) => (observerRefs.current['target-audience'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['target-audience'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              這份報告適合誰？
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              如果你符合以下描述，這份報告可能正是你需要的
            </p>
          </div>
          
          <div className="space-y-4">
            {targetAudience.map((item, index) => (
              <div 
                key={index}
                className={`group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-500 ${isVisible['target-audience'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <CheckCircle2 className="h-6 w-6 text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        ref={(el) => (observerRefs.current['features'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              你拿到什麼
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              不是一堆術語。不是「你很特別」。<br />
              是一份可以拿去驗證、反覆使用的<span className="text-amber-400">自我校準文件</span>。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reportFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className={`group relative overflow-hidden transition-all duration-700 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                <div className="relative m-0.5 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-10 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Versions Section - Updated for 3 versions */}
      <section 
        id="versions"
        ref={(el) => (observerRefs.current['versions'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['versions'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              您的生命，需要哪種級別的解析？
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              三種版本，對應不同階段的生命需求
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Version */}
            <div className={`group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 ${isVisible['versions'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-4 tracking-wide">
                  基本版 Basic
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                  【認識自己】
                </h3>
                <p className="text-lg text-white/60 mb-3 font-serif">
                  生命起點說明書
                </p>
                <p className="text-white/40 text-sm">
                  第一次接觸命理、想快速了解自己的基本配置
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-white/50 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                  <span>5 章核心內容，濃縮精華</span>
                </div>
                <div className="flex items-start gap-3 text-white/50 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                  <span>讓你知道「你是誰」＋「有解」</span>
                </div>
                <div className="flex items-start gap-3 text-white/50 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                  <span>約 3,000-4,000 字精煉解讀</span>
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/50 italic text-sm">
                  適合：首次接觸、預算有限、快速入門者
                </p>
              </div>
            </div>
            
            {/* Standard Version */}
            <div className={`group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-8 md:p-10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-2 ${isVisible['versions'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.3s' }}>
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-4 tracking-wide">
                  標準版 Standard
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                  【看懂自己】
                </h3>
                <p className="text-lg text-blue-300/80 mb-3 font-serif">
                  生命高畫質鏡子
                </p>
                <p className="text-white/40 text-sm">
                  想完整理解個性與運作模式，獲得深度自我解析
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-400/60 mt-0.5 flex-shrink-0" />
                  <span>8 章完整解析，涵蓋人生八大面向</span>
                </div>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-400/60 mt-0.5 flex-shrink-0" />
                  <span>事業、愛情、金錢三大領域深度分析</span>
                </div>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-400/60 mt-0.5 flex-shrink-0" />
                  <span>約 6,000-8,000 字完整說明書</span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <p className="text-blue-300/70 italic text-sm">
                  適合：追求完整解析、想深度認識自己者
                </p>
              </div>
            </div>
            
            {/* Flagship Version */}
            <div className={`group relative ${isVisible['versions'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 rounded-[36px] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-gradient-shift bg-[length:200%_200%]" />
              
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[32px] p-8 md:p-10 border-2 border-amber-500/40 hover:border-amber-400/60 transition-all duration-500 overflow-hidden h-full hover:-translate-y-2">
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydi0yaC00djJoLTJ2NGgydjJoNHYtMmgydjJoNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-sm font-bold shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-wider animate-glow-pulse">
                    <Star className="w-4 h-4" />
                    推薦
                  </span>
                </div>
                
                <div className="mb-6 pt-4 relative z-10">
                  <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4 tracking-wide">
                    旗艦版 Flagship
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                    【使用自己】
                  </h3>
                  <p className="text-lg text-amber-300/90 mb-3 font-serif">
                    人生操作導航系統
                  </p>
                  <p className="text-white/50 text-sm">
                    渴望系統化重組人生、學會駕馭自己的能量
                  </p>
                </div>
                
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-start gap-3 text-white/70 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>10 章完整系統，含思維工具箱＋四時軍團</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/70 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>默默超思維系統完整教學（情緒/行動/心智/價值）</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/70 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>約 10,000-12,000 字人生操作系統</span>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 relative z-10">
                  <p className="text-amber-300/90 italic text-sm">
                    適合：創業者、高敏感族群、追求靈魂進化者
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Detailed Version Comparison Table */}
      <section 
        id="version-comparison"
        ref={(el) => (observerRefs.current['version-comparison'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible['version-comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              章節內容詳細對比
            </h2>
            <p className="text-white/50 text-lg">
              三版本完整功能差異一覽
            </p>
          </div>
          
          {/* Desktop Table */}
          <div className={`hidden md:block overflow-x-auto rounded-3xl border border-white/10 transition-all duration-1000 ${isVisible['version-comparison'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-5 text-white font-semibold border-b border-white/10">章節模組</th>
                  <th className="p-5 border-b border-slate-500/20 min-w-[140px] bg-slate-500/5">
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 text-xs mb-1">
                        <BookOpen className="w-3 h-3" />
                        基本版
                      </span>
                      <span className="block text-slate-400/80 text-xs">認識自己</span>
                    </div>
                  </th>
                  <th className="p-5 border-b border-blue-500/20 min-w-[140px] bg-blue-500/5">
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs mb-1">
                        <Eye className="w-3 h-3" />
                        標準版
                      </span>
                      <span className="block text-blue-300/60 text-xs">看懂自己</span>
                    </div>
                  </th>
                  <th className="p-5 border-b border-amber-500/30 min-w-[140px] bg-amber-500/10">
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs mb-1">
                        <Crown className="w-3 h-3" />
                        旗艦版
                      </span>
                      <span className="block text-amber-300/60 text-xs">使用自己</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: "Ch.1 開場引言", basic: "✓ 精簡版", standard: "✓ 完整版", flagship: "✓ 完整版", basicDesc: "簡潔破題", standardDesc: "完整情境鋪陳", flagshipDesc: "深度情境引導" },
                  { feature: "Ch.2 基本資料總覽", basic: "✓", standard: "✓", flagship: "✓", basicDesc: "四系統概覽", standardDesc: "四系統詳解", flagshipDesc: "四系統深度剖析" },
                  { feature: "Ch.3 人生羅盤圖", basic: "✓ 單圖", standard: "✓ 整合圖", flagship: "✓ 完整導航圖", basicDesc: "基礎定位", standardDesc: "交叉整合", flagshipDesc: "多維導航系統" },
                  { feature: "Ch.4 你是誰", basic: "✓ 精簡", standard: "✓ 完整", flagship: "✓ 深度", basicDesc: "核心特質速寫", standardDesc: "外在/內在完整分析", flagshipDesc: "多層次人格解構" },
                  { feature: "Ch.5 你怎麼運作", basic: "—", standard: "✓", flagship: "✓", standardDesc: "情緒/思考模式", flagshipDesc: "運作機制完整拆解" },
                  { feature: "Ch.6 三大領域", basic: "—", standard: "✓ 事業/愛情/金錢", flagship: "✓ 深度整合", standardDesc: "三領域獨立分析", flagshipDesc: "領域交互影響剖析" },
                  { feature: "Ch.7 特別注意事項", basic: "—", standard: "✓ 精簡", flagship: "✓ 完整", standardDesc: "重點警示", flagshipDesc: "全方位風險提醒" },
                  { feature: "Ch.8 結語與祝福", basic: "✓ 精簡", standard: "✓ 完整", flagship: "✓ 深度", basicDesc: "簡短祝福", standardDesc: "完整總結", flagshipDesc: "人生展望與行動呼籲" },
                  { feature: "Ch.9 思維工具箱", basic: "—", standard: "—", flagship: "✓ 專屬", flagshipDesc: "思維啟動器＋過程圖", highlight: true },
                  { feature: "Ch.10 四時軍團", basic: "—", standard: "—", flagship: "✓ 專屬", flagshipDesc: "RPG式八字軍團敘事", highlight: true },
                  { feature: "總字數", basic: "3-4千字", standard: "6-8千字", flagship: "1-1.2萬字", isText: true },
                  { feature: "製作工時", basic: "5-9 天", standard: "7-12 天", flagship: "12-18 天", isText: true },
                ].map((row, idx) => (
                  <tr key={idx} className={`${row.highlight ? 'bg-amber-500/5' : ''} hover:bg-white/5 transition-colors`}>
                    <td className="p-4 text-white text-sm font-medium">
                      {row.feature}
                    </td>
                    <td className={`p-4 text-center ${row.highlight ? '' : 'bg-slate-500/5'}`}>
                      {row.isText ? (
                        <span className="text-slate-300 text-sm font-medium">{row.basic}</span>
                      ) : row.basic === "—" ? (
                        <X className="w-4 h-4 text-white/20 mx-auto" />
                      ) : (
                        <div>
                          <span className="text-slate-300 text-xs">{row.basic}</span>
                          {row.basicDesc && <p className="text-white/30 text-[10px] mt-0.5">{row.basicDesc}</p>}
                        </div>
                      )}
                    </td>
                    <td className={`p-4 text-center ${row.highlight ? '' : 'bg-blue-500/5'}`}>
                      {row.isText ? (
                        <span className="text-blue-300 text-sm font-medium">{row.standard}</span>
                      ) : row.standard === "—" ? (
                        <X className="w-4 h-4 text-white/20 mx-auto" />
                      ) : (
                        <div>
                          <span className="text-blue-300 text-xs">{row.standard}</span>
                          {row.standardDesc && <p className="text-blue-300/50 text-[10px] mt-0.5">{row.standardDesc}</p>}
                        </div>
                      )}
                    </td>
                    <td className={`p-4 text-center ${row.highlight ? 'bg-amber-500/10' : 'bg-amber-500/5'}`}>
                      {row.isText ? (
                        <span className="text-amber-400 text-sm font-bold">{row.flagship}</span>
                      ) : row.flagship === "—" ? (
                        <X className="w-4 h-4 text-white/20 mx-auto" />
                      ) : (
                        <div>
                          <span className="text-amber-300 text-xs font-medium">{row.flagship}</span>
                          {row.flagshipDesc && <p className="text-amber-300/60 text-[10px] mt-0.5">{row.flagshipDesc}</p>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className={`md:hidden space-y-6 transition-all duration-1000 ${isVisible['version-comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Basic Version Card */}
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl p-5 border border-slate-500/20">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-white">基本版・認識自己</span>
                <span className="text-slate-400 text-sm ml-auto">5 章</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/60">開場引言</span><span className="text-slate-300">精簡版</span></div>
                <div className="flex justify-between"><span className="text-white/60">基本資料</span><span className="text-slate-300">四系統概覽</span></div>
                <div className="flex justify-between"><span className="text-white/60">人生羅盤</span><span className="text-slate-300">單圖版</span></div>
                <div className="flex justify-between"><span className="text-white/60">你是誰</span><span className="text-slate-300">核心速寫</span></div>
                <div className="flex justify-between"><span className="text-white/60">結語祝福</span><span className="text-slate-300">精簡版</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                <span className="text-white/50">字數</span><span className="text-slate-300 font-medium">3,000-4,000 字</span>
              </div>
            </div>

            {/* Standard Version Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 rounded-2xl p-5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white">標準版・看懂自己</span>
                <span className="text-blue-300 text-sm ml-auto">8 章</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/60">你怎麼運作</span><span className="text-blue-300">情緒/思考模式</span></div>
                <div className="flex justify-between"><span className="text-white/60">三大領域</span><span className="text-blue-300">事業/愛情/金錢</span></div>
                <div className="flex justify-between"><span className="text-white/60">特別注意</span><span className="text-blue-300">重點警示</span></div>
                <div className="flex justify-between text-white/30"><span>思維工具箱</span><span>—</span></div>
                <div className="flex justify-between text-white/30"><span>四時軍團</span><span>—</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                <span className="text-white/50">字數</span><span className="text-blue-300 font-medium">6,000-8,000 字</span>
              </div>
            </div>

            {/* Flagship Version Card */}
            <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 rounded-2xl p-5 border border-amber-500/30 relative">
              <div className="absolute -top-2 right-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-black rounded-full text-[10px] font-bold">
                  <Star className="w-2.5 h-2.5" />
                  推薦
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white">旗艦版・使用自己</span>
                <span className="text-amber-300 text-sm ml-auto">10 章</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/60">三大領域</span><span className="text-amber-300">深度整合剖析</span></div>
                <div className="flex justify-between"><span className="text-white/60">特別注意</span><span className="text-amber-300">全方位風險</span></div>
                <div className="flex justify-between bg-amber-500/10 -mx-2 px-2 py-1 rounded"><span className="text-amber-200">思維工具箱</span><span className="text-amber-300 font-medium">專屬</span></div>
                <div className="flex justify-between bg-amber-500/10 -mx-2 px-2 py-1 rounded"><span className="text-amber-200">四時軍團</span><span className="text-amber-300 font-medium">專屬</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-500/20 flex justify-between text-sm">
                <span className="text-white/50">字數</span><span className="text-amber-400 font-bold">10,000-12,000 字</span>
              </div>
            </div>
          </div>
          
          {/* Key Difference Callout */}
          <div className={`mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-amber-500/10 border border-white/10 transition-all duration-1000 delay-300 ${isVisible['version-comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">基本版讓你「認識」自己</span>
              </div>
              <span className="hidden md:block text-white/20">→</span>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm">標準版讓你「看懂」自己</span>
              </div>
              <span className="hidden md:block text-white/20">→</span>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">旗艦版教你「使用」自己</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MomoChao Thinking System - Why Flagship */}
      <section 
        id="thinking-system"
        ref={(el) => (observerRefs.current['thinking-system'] = el)}
        className="py-32 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">旗艦版專屬</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              為什麼選擇旗艦版？
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-3xl mx-auto">
              因為「知道」與「做到」之間，缺的是一套系統。
            </p>
          </div>
          
          <div className="mb-12 text-center">
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              市面上的算命告訴您「您很敏感」，標準版會告訴您「敏感是您的天賦」，<br />
              而<span className="text-amber-400 font-semibold">旗艦版會教您：</span>
            </p>
          </div>
          
          {/* Thinking dimensions - Animated cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {thinkingDimensions.map((dim, index) => (
              <div
                key={dim.name}
                className={`group relative transition-all duration-700 ${isVisible['thinking-system'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dim.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`relative bg-gradient-to-br ${dim.color} p-0.5 rounded-3xl`}>
                  <div className="bg-[#0a0a0a]/95 rounded-3xl p-8 backdrop-blur-sm group-hover:bg-[#0a0a0a]/80 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 group-hover:scale-110 transition-transform">
                        <dim.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white">{dim.name}系統</h3>
                    </div>
                    <p className="text-white/60 text-base leading-relaxed">{dim.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Integration showcase */}
          <div className={`relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[40px] p-10 md:p-14 border border-amber-500/20 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.6s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <OptimizedImage 
                  src={yuanYiLogo} 
                  alt="元壹宇宙" 
                  className="w-28 h-28 rounded-2xl animate-glow-pulse"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                  獨家整合<span className="text-amber-400">元壹宇宙 X 默默超思維系統</span>
                </h3>
                <p className="text-white/60 text-lg leading-relaxed">
                  在人機協作的末法時代，我們為您建構堅實穩固的思維能力。旗艦版不只給答案，更給您一套可運作的「生命操作系統」——讓您在資訊洪流中，依然能清醒決策、精準行動。
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Evaluation of Thinking System */}
          <div className={`mt-8 relative bg-gradient-to-br from-[#1a1418] via-[#14100e] to-[#0a0806] rounded-[40px] p-10 md:p-14 border border-purple-500/20 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.8s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-purple-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-purple-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">AI 深度評價</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                為什麼這套思維工具<span className="text-purple-400">如此重要？</span>
              </h3>
              <p className="text-white/50 text-lg max-w-3xl mx-auto">
                我們將「默默超思維系統」交由頂尖 AI 進行結構化分析，以下是他們的專業評價
              </p>
            </div>
            
            {/* AI Evaluation Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {aiEvaluations.map((evaluation, idx) => (
                <Collapsible key={idx} className="group">
                  <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500">
                    <div className="absolute -top-3 right-4">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 rounded-full text-xs font-medium">
                        {evaluation.source}
                      </span>
                    </div>
                    <div className="mb-4 pt-2">
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {evaluation.score}
                      </p>
                      <p className="text-white/60 text-sm mt-1">{evaluation.title}</p>
                    </div>
                    <div className="space-y-3">
                      {evaluation.highlights.slice(0, 3).map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-purple-400/60 flex-shrink-0 mt-1" />
                          <p className="text-white/70 text-sm leading-relaxed">{highlight}</p>
                        </div>
                      ))}
                    </div>
                    
                    <CollapsibleTrigger className="w-full mt-4">
                      <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer">
                        <span className="text-purple-300 text-sm">閱讀完整評語</span>
                        <ChevronDown className="w-4 h-4 text-purple-400 group-data-[state=open]:rotate-180 transition-transform" />
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-4 animate-accordion-down">
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                          {evaluation.fullReview}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
            
            {/* Key Insights Callout */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  為什麼這套工具「厲害」？
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>將極度抽象的人類內在世界，進行了前所未有的「結構化」與「系統化」</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>「思維八階循環」如同精密演算法，讓思考可被追蹤、可被優化</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>創造了一種 AI 原生就理解的語言——「前進後退都要通」</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
                <h4 className="flex items-center gap-2 text-white font-bold mb-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  為什麼這套工具「必要」？
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>在人機協作末法時代，提供堅實穩固的人類思維能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>讓人「活得明白」而非僅僅「活著」——從被動接收到主動操作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>將「理性給形體，感性給呼吸」——給靈魂開了窗，讓內外協調運作</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Quote Highlight */}
            <div className="mt-8 text-center">
              <div className="inline-block max-w-3xl">
                <Quote className="w-8 h-8 text-purple-400/30 mx-auto mb-4" />
                <p className="font-serif text-xl md:text-2xl text-white/90 italic leading-relaxed mb-4">
                  「當路徑可逆時，錯誤就變成了資訊；當系統雙向通時，失敗就變成了調校。」
                </p>
                <p className="text-purple-400 text-sm">— Claude 對思維系統的評價</p>
              </div>
            </div>
          </div>
          
          {/* SOP Quality Assurance */}
          <div className={`mt-8 relative bg-gradient-to-br from-[#14161a] via-[#101214] to-[#0a0c0e] rounded-[40px] p-10 md:p-14 border border-cyan-500/20 transition-all duration-1000 ${isVisible['thinking-system'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-cyan-500/30 rounded-br-[40px]" />
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                    <Settings className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                    <span className="text-cyan-300 text-xs font-medium tracking-wider uppercase">人機協作 SOP</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">
                    《默默超全方位命理解讀報告》<br />
                    <span className="text-lg text-cyan-400">100% 客製化・零套版內容</span>
                  </h3>
                  <p className="text-white/60 text-base leading-relaxed">
                    本報告採用<span className="text-cyan-400 font-medium">人機協作</span>模式產出——結合專業命理師的深度解讀與 AI 的精準運算。從引言到大總結，每一個字都是為您量身打造，<span className="text-white font-medium">完全沒有套版文章</span>。我們建立了嚴格的 SOP 寫作規範與語氣設定，確保每一份報告都呈現相同水準的精密與深度。
                  </p>
                </div>
              </div>
              
              {/* Expandable SOP Details */}
              <Collapsible>
                <CollapsibleTrigger className="w-full group">
                  <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer min-h-[52px] active:scale-[0.98]">
                    <span className="text-cyan-300 font-medium text-base">查看詳細寫作規範</span>
                    <ChevronDown className="w-5 h-5 text-cyan-400 group-data-[state=open]:rotate-180 transition-transform" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-6 space-y-6 animate-accordion-down">
                  {/* SOP Standards Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">高度整合與系統化</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        並非單一命理系統的解析，而是將四套系統交叉對照，找出共性與結構，形成一個立體的「人生羅盤」。
                      </p>
                    </div>
                    
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">標準化邏輯架構</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        每章節都以「命盤根據 → 過去現象 → 現在展現 → 星盤起源 → 小提醒」的邏輯展開，清晰且有層次。
                      </p>
                    </div>
                    
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">心理引導性強</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        報告不只說「你是什麼樣的人」，更強調「你為什麼會這樣」以及「你可以如何與自己和解」。
                      </p>
                    </div>
                    
                    <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-white font-bold">溫暖且有文學感</h4>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">
                        語言富有意象且易於共情——「穩定型的深海，不是表面型的煙火」「你是一座整理得很好、但門關得很緊的圖書館」。
                      </p>
                    </div>
                  </div>
                  
                  {/* Comparison Table */}
                  <div className="bg-[#0a0c0e] rounded-2xl p-6 border border-cyan-500/10">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-cyan-400" />
                      與傳統命理報告的比較
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-cyan-500/20">
                            <th className="text-left py-3 px-4 text-cyan-300 font-medium">維度</th>
                            <th className="text-left py-3 px-4 text-white/40">傳統命理報告</th>
                            <th className="text-left py-3 px-4 text-cyan-400">本報告</th>
                          </tr>
                        </thead>
                        <tbody className="text-white/60">
                          <tr className="border-b border-cyan-500/10">
                            <td className="py-3 px-4 text-white/80">語言</td>
                            <td className="py-3 px-4">術語多，較冷硬</td>
                            <td className="py-3 px-4 text-cyan-300">溫暖對話，易理解</td>
                          </tr>
                          <tr className="border-b border-cyan-500/10">
                            <td className="py-3 px-4 text-white/80">結構</td>
                            <td className="py-3 px-4">單一系統，條列式</td>
                            <td className="py-3 px-4 text-cyan-300">多系統整合，心理引導式</td>
                          </tr>
                          <tr className="border-b border-cyan-500/10">
                            <td className="py-3 px-4 text-white/80">目的</td>
                            <td className="py-3 px-4">預測、描述性格</td>
                            <td className="py-3 px-4 text-cyan-300">理解自我、心理調適、行動建議</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-white/80">體驗</td>
                            <td className="py-3 px-4">被動接收資訊</td>
                            <td className="py-3 px-4 text-cyan-300">主動參與，有互動感</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Key Quote */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl p-6 border-l-4 border-cyan-500">
                    <p className="text-white/80 italic leading-relaxed">
                      「這份報告更像是一本<span className="text-cyan-400 font-medium">『自我理解的使用手冊』</span>，而不只是一張『命理診斷書』。它把命理從『預測未來』轉向『理解當下』，從『你是什麼』轉向『你可以如何活得更自在』。」
                    </p>
                    <p className="text-white/40 text-sm mt-3">— AI 深度分析評價</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Stance Section - Mirror Not Script */}
      <section 
        id="stance"
        ref={(el) => (observerRefs.current['stance'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)] transition-all duration-1000 ${isVisible['stance'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-amber-500/30 rounded-br-[40px]" />
            
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-float" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                三條底線
              </h2>
            </div>
            
            <div className="space-y-10 font-serif text-xl leading-relaxed">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">說真話。</p>
                <p className="text-white/50">確定的事說確定，不確定的事標出來。不用「可能」「大概」來模糊界線。有依據的附依據，沒有的就直接說沒有。</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400 animate-bounce-soft" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">不替你做決定。</p>
                <p className="text-white/50">報告翻結構、問問題、給選項。你拿這些去做什麼決定，是你的事。神煞不拿來嚇人，一律翻譯成可理解的心理狀態和能量模式。</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                <Gem className="w-6 h-6 text-amber-400 animate-bounce-soft" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-white mb-3">你越來越不需要我，就代表我做對了。</p>
                <p className="text-white/50">命盤是一種語言，不是判決。這份報告的目標是讓你學會自己讀自己——不是讓你依賴任何人。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Carousel */}
      <section 
        id="testimonials"
        ref={(el) => (observerRefs.current['testimonials'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              客戶見證
            </h2>
            <p className="text-white/50 text-lg md:text-xl">
              以下來自我們真實用戶的體驗反饋
            </p>
          </div>
          
          <TestimonialsCarousel testimonials={testimonials} isVisible={isVisible['testimonials']} />
        </div>
      </section>

      {/* Plans & Pricing Section */}
      <section 
        id="plans-section" 
        ref={(el) => (observerRefs.current['plans-section'] = el)}
        className="py-32 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        
        <FloatingOrb className="top-20 left-10 w-48 h-48 bg-amber-500/5" delay={0} duration={8} />
        <FloatingOrb className="bottom-40 right-10 w-64 h-64 bg-purple-500/5" delay={3} duration={10} />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Crown className="w-4 h-4 text-amber-400 animate-bounce-soft" />
              <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">Pricing</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              交付內容階梯
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
              三階方案，遞進式體驗升級
            </p>
          </div>

          {/* Plan Tiers Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 perspective-1000">
            {[
              { title: "方案 1｜核心包", subtitle: "報告＋語音導讀＋整合圖", items: planIncludes, accent: false },
              { title: "方案 2｜深度吸收包", subtitle: "方案1＋語音摘要＋個人簡報", items: plan2Extras, prefix: "包含方案1全部 +", accent: false },
              { title: "方案 3｜完整校準包", subtitle: "方案2＋摘要影片＋一對一對談", items: plan3Extras, prefix: "包含方案2全部 +", accent: true },
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border transition-all duration-500 card-3d shine-effect overflow-hidden ${plan.accent ? 'border-amber-500/30 glow-border-amber' : 'border-white/10 hover:border-white/30'} ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${plan.accent ? 'bg-amber-500/5' : 'bg-white/5'}`} />
                <div className={`absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-all duration-500 ${plan.accent ? 'bg-gradient-to-br from-amber-500/20 to-transparent' : 'bg-gradient-to-br from-white/10 to-transparent'}`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                
                <h3 className={`font-serif text-xl font-bold mb-4 relative z-10 transition-all duration-300 group-hover:scale-105 ${plan.accent ? 'text-amber-400 group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-white'}`}>{plan.title}</h3>
                <p className="text-white/50 text-sm mb-6 relative z-10">{plan.subtitle}</p>
                <div className="space-y-3 relative z-10">
                  {plan.prefix && <p className="text-xs text-white/40 mb-2">{plan.prefix}</p>}
                  {plan.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className={`p-2 rounded-lg ${plan.accent ? 'bg-amber-500/20' : 'bg-white/10'} group-hover/item:scale-110 transition-transform`}>
                        <item.icon className={`h-4 w-4 ${plan.accent ? 'text-amber-400' : 'text-white/60'}`} />
                      </div>
                      <div>
                        <span className="text-white/80 text-sm font-medium">{item.title}</span>
                        <span className="text-white/40 text-xs ml-2">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Cards - Three Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Pricing */}
            <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-6 md:p-8 border border-slate-500/20 transition-all duration-700 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.3s' }}>
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-slate-500/10 text-slate-300 rounded-full text-sm font-medium mb-3">基本版</span>
                <h3 className="font-serif text-xl font-bold text-white">認識自己</h3>
                <p className="text-white/40 text-xs mt-2">5 章節・3,000-4,000 字</p>
              </div>
              <div className="space-y-3">
                {basicPricing.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-4 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 border border-slate-500/10 hover:border-slate-500/20 transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.plan}</h4>
                      <p className="text-white/40 text-xs">{item.days} 個工作天</p>
                    </div>
                    <div className="text-right">
                      <BlurredPrice color="text-slate-300 text-lg font-bold" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-white/30 text-xs text-center">入門首選・點出方向</p>
              </div>
            </div>
            
            {/* Standard Pricing */}
            <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-6 md:p-8 border border-blue-500/20 transition-all duration-700 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-sm font-medium mb-3">標準版</span>
                <h3 className="font-serif text-xl font-bold text-white">看懂自己</h3>
                <p className="text-white/40 text-xs mt-2">8 章節・6,000-8,000 字</p>
              </div>
              <div className="space-y-3">
                {standardPricing.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-4 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.plan}</h4>
                      <p className="text-white/40 text-xs">{item.days} 個工作天</p>
                    </div>
                    <div className="text-right">
                      <BlurredPrice color="text-blue-300 text-lg font-bold" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-white/30 text-xs text-center">完整八大面向・深度理解</p>
              </div>
            </div>
            
            {/* Flagship Pricing */}
            <div className={`relative transition-all duration-700 ${isVisible['plans-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.5s' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-[36px] blur-xl opacity-40 animate-gradient-shift bg-[length:200%_200%]" />
              <div className="relative bg-gradient-to-br from-[#1a1614] via-[#141210] to-[#0a0908] rounded-[32px] p-6 md:p-8 border-2 border-amber-500/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full text-xs font-bold shadow-[0_0_20px_rgba(251,191,36,0.4)] uppercase tracking-wider">
                    <Star className="w-3 h-3" />
                    推薦
                  </span>
                </div>
                <div className="text-center mb-6 pt-2">
                  <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-3">旗艦版</span>
                  <h3 className="font-serif text-xl font-bold text-white">使用自己</h3>
                  <p className="text-white/40 text-xs mt-2">10 章節・10,000-12,000 字</p>
                </div>
                <div className="space-y-3">
                  {flagshipPricing.map((item, idx) => (
                    <div key={idx} className="group flex items-center justify-between p-4 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.plan}</h4>
                        <p className="text-white/40 text-xs">{item.days} 個工作天</p>
                      </div>
                      <div className="text-right">
                        <BlurredPrice color="text-amber-400 text-lg font-bold" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-amber-500/20">
                  <p className="text-amber-400/50 text-xs text-center">完整思維系統・人生操作手冊</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        id="process"
        ref={(el) => (observerRefs.current['process'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['process'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              製作流程
            </h2>
            <p className="text-white/50 text-lg">從訂單到交付，清楚明瞭</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent" />
            
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex items-start gap-8 transition-all duration-700 ${isVisible['process'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#0a0a0a] shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'} pl-16 md:pl-0`}>
                    <div className="group inline-block">
                      <div className="flex items-center gap-4 mb-3 md:justify-end">
                        <span className="text-4xl font-bold text-amber-500/30 group-hover:text-amber-500/50 transition-colors">{step.step}</span>
                        <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{step.title}</h3>
                      </div>
                      <p className="text-white/50">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Delivery Format Section */}
      <section 
        id="delivery"
        ref={(el) => (observerRefs.current['delivery'] = el)}
        className="py-24 px-4 relative"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['delivery'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              交付形式
            </h2>
            <p className="text-white/50 text-lg">全方案一致</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Globe, title: "網頁閱讀版", desc: "方便回查", color: "from-blue-500 to-cyan-500" },
              { icon: Download, title: "PDF 下載列印版", desc: "可保存成個人秘笈", color: "from-amber-500 to-orange-500" },
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`group relative transition-all duration-700 ${isVisible['delivery'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + idx * 0.15}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500`} />
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-10 border border-white/10 hover:border-amber-500/20 transition-all duration-500 text-center group-hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Evaluation Section */}
      <section 
        id="ai-evaluation"
        ref={(el) => (observerRefs.current['ai-evaluation'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['ai-evaluation'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">AI 專業評價</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              多方 AI 專業認證
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              我們的報告經過多個 AI 系統深度分析與評估，獲得高度肯定
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiEvaluations.map((evaluation, idx) => (
              <div 
                key={idx}
                className={`group relative transition-all duration-700 ${isVisible['ai-evaluation'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transitionDelay: `${0.2 + idx * 0.15}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/10 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500 h-full">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent mb-2">
                      {evaluation.score}
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">{evaluation.source}</div>
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-white mb-4 text-center">
                    {evaluation.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {evaluation.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${isVisible['ai-evaluation'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-white/40 text-sm italic">
              "這不是算命，這是心靈的精密工業。" — AI 綜合評價
            </p>
          </div>
        </div>
      </section>
      
      {/* Interactive Self-Check Quiz Section */}
      <section 
        id="self-check"
        ref={(el) => (observerRefs.current['self-check'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-purple-900/10" />
        <FloatingOrb className="top-20 right-1/4 w-48 h-48 bg-amber-500/10" delay={0} duration={5} />
        <FloatingOrb className="bottom-20 left-1/4 w-32 h-32 bg-purple-500/10" delay={1.5} duration={4} />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`relative bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0d0d0d] rounded-[40px] p-12 md:p-16 border border-amber-500/20 shadow-[0_0_80px_rgba(251,191,36,0.1)] transition-all duration-1000 ${isVisible['self-check'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-purple-500/30 rounded-br-[40px]" />
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-amber-300 text-sm font-medium">互動體驗</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                一分鐘探索你的<span className="text-amber-400">思維類型</span>
              </h2>
              
              <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
                完成 5 道簡單問題，初步了解你的決策傾向與思維模式。
                <br />
                <span className="text-amber-300/70">這只是完整報告的冰山一角。</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { icon: Heart, label: "情緒", color: "from-rose-400 to-pink-500" },
                  { icon: Zap, label: "行動", color: "from-amber-400 to-yellow-500" },
                  { icon: Brain, label: "心智", color: "from-blue-400 to-cyan-500" },
                  { icon: Target, label: "價值", color: "from-purple-400 to-violet-500" },
                ].map((dim, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${dim.color}`}>
                      <dim.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white/60 text-sm">{dim.label}</span>
                  </div>
                ))}
              </div>
              
              <Button
                size="lg"
                onClick={() => setShowQuiz(true)}
                className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-6 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 text-white font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500 transform hover:scale-105 active:scale-95 min-h-[56px]"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                開始測驗
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Self Check Quiz Dialog */}
      <SelfCheckQuiz 
        open={showQuiz} 
        onOpenChange={setShowQuiz}
        onComplete={() => scrollToPlans()}
      />
      
      {/* FAQ Section */}
      <section 
        id="faq"
        ref={(el) => (observerRefs.current['faq'] = el)}
        className="py-24 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible['faq'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <HelpCircle className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-float" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              常見問題
            </h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`group bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1 ${isVisible['faq'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4 flex items-start gap-4">
                  <span className="text-amber-400 animate-bounce-soft" style={{ animationDelay: `${index * 0.2}s` }}>Q</span>
                  {faq.q}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed pl-8">
                  <span className="text-amber-400/60">A：</span>{faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Privacy & Disclaimer Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="group flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300">
            <Lock className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-medium text-white/80 mb-3">隱私原則</h3>
              <ul className="text-white/50 leading-relaxed space-y-2">
                <li>• 個人資料與命盤內容僅用於本次報告製作，不對外分享</li>
                <li>• 若需作為試閱示例，必須取得當事人明確同意並完成匿名化處理</li>
              </ul>
            </div>
          </div>
          
          <div className="group flex items-start gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300">
            <AlertTriangle className="h-6 w-6 text-amber-400/60 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-medium text-white/80 mb-2">免責聲明</h3>
              <p className="text-white/50 leading-relaxed">
                本報告屬命理分析與自我探索工具，提供生活與決策參考，不取代醫療、心理、法律或投資等專業意見。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />
        
        <FloatingOrb className="top-10 left-1/4 w-64 h-64 bg-amber-500/10" delay={0} duration={6} />
        <FloatingOrb className="bottom-10 right-1/4 w-48 h-48 bg-purple-500/10" delay={2} duration={5} />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">開始你的人生校準</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
            您的靈魂，值得<span className="text-amber-400">最高規格的理解</span>。
          </h2>
          
          <p className="text-white/60 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            別再用舊的思維，應對新的挑戰。
          </p>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            現在就選擇您的版本，啟動這場深度的自我升級之旅。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4">
            <Button 
              size="xl" 
              className="group text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_80px_rgba(251,191,36,0.5)] transition-all duration-500 transform hover:scale-105 active:scale-95 min-h-[56px]"
              onClick={scrollToPlans}
            >
              選擇你的方案
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default ReportPage;
