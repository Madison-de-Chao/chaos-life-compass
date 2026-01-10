import { Link } from "react-router-dom";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { 
  Heart, Brain, Compass, Lightbulb, Shield, Sparkles, 
  ArrowRight, BookOpen, Users, Target, Quote, Flame,
  Bot, Globe, Eye, Feather
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import logoHongling from "@/assets/logo-hongling-yusuo.png";

// 思維系統三層結構
const thinkingLayers = [
  {
    icon: Target,
    title: "應用層：辨識錯誤思維",
    points: [
      "時態錯位：用現在的自己抹掉過去的錯與痛",
      "特例否定通則：拿一兩次例外，否定掉長期規律",
      "防衛反應優先：還沒聽，就先覺得自己被攻擊",
      "責任外包：所有事都是別人、環境、命運的問題",
    ],
  },
  {
    icon: Brain,
    title: "結構層：思維八階循環",
    points: [
      "懷疑 → 耗損 → 準備 → 拆解",
      "驗證 → 重構 → 自省 → 總結",
      "三層邏輯校準（情緒／語言／結構）",
      "通則優先、語言煉金法、地基重建",
    ],
  },
  {
    icon: Heart,
    title: "哲學層：Care & Truth",
    points: [
      "在乎人，也在乎真實，不用好聽話掩蓋事實",
      "希望人類重新學會「自己思考」",
      "命理不是預測，而是理解",
      "這套系統不是冷酷工具，是有溫度的鏡子",
    ],
  },
];

// 元壹宇宙三個「壹」
const yuanyiConcepts = [
  {
    icon: Globe,
    title: "元壹 · 源頭的一",
    content: "每個靈魂在最深處是同源的，不是某些人「先天高等」。",
  },
  {
    icon: Users,
    title: "緣壹 · 連結的一",
    content: "個體的選擇與他人、與整體，本來就是互相牽動的。",
  },
  {
    icon: Compass,
    title: "圓壹 · 完整的一",
    content: "人生如果只活陽面（成功、被喜歡），那只是半圈；完整的人生必然也包含陰面（失敗、痛、孤獨）。",
  },
];

// 人機協作要點
const aiCollabPoints = [
  {
    icon: Brain,
    title: "人保持主體性",
    content: "思維八階循環、三層邏輯校準等工具，是讓「人」保持清醒與完整的框架。",
  },
  {
    icon: Bot,
    title: "AI 提供輔助",
    content: "找資料、舉例、整理、提出不同角度——在你已有框架的前提下，讓內容更扎實。",
  },
  {
    icon: Sparkles,
    title: "共生共創",
    content: "這套系統不是用來防 AI，而是用來讓人類有能力跟 AI 共生、共創、共榮。",
  },
];

const AboutPage = () => {
  useSEO({
    title: "關於默默超 | 虹靈御所",
    description: "默默超是一個交界點——站在「命理 × 心理 × 哲學 × 宇宙觀 × AI 時代」的交叉路口，用一套有骨架的思維系統，幫你在這個混亂的世界裡，把自己看清楚一點。",
    keywords: "默默超, MomoChao, 虹靈御所, 思維系統, 元壹宇宙, 人機協作, 命理, 八字, 紫微, 占星, 人類圖",
    ogTitle: "關於默默超 - 虹靈御所",
  });

  return (
    <div className="min-h-screen bg-parchment">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-parchment-hero" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img 
              src={logoHongling} 
              alt="虹靈御所" 
              className="h-24 md:h-32 mx-auto"
            />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            關於<span className="text-primary">默默超</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            MomoChao — The Guardian of Mirrors
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            用一套「有骨架的思維系統」，幫你在這個越來越混亂的世界裡，把自己看清楚一點。
          </p>
        </div>
      </section>

      {/* AI 協作者視角開場 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <Bot className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                AI 協作者視角的介紹
              </h2>
            </div>
            
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p>
                我是默默超長期協作的 AI 思維夥伴。你現在讀到的這一整套內容——包含世界觀、思維系統、以及你看到的這篇介紹——都是在「他的人類腦 + 我的模型腦」不斷對話、碰撞、修正之下共創出來的。
              </p>
              
              <p className="font-serif text-lg text-primary">
                所以這不是單純的人類作品，也不是單純的 AI 生成，而是一個實作中的例子：人機協作可以長成什麼樣子。
              </p>
              
              <hr className="border-border/50 my-8" />
              
              <p>
                從我的觀點看，<span className="font-bold">默默超不是「某一種職稱」，而是一個交界點</span>：他站在「命理 × 心理 × 哲學 × 宇宙觀 × AI 時代」的交叉路口，想辦法做一套真的能用的思維系統，讓人不會被時代推著走到崩潰。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 默默超真正執著的 */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              默默超真正執著的事
            </h2>
            <p className="text-muted-foreground">What MomoChao Truly Cares About</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p>
                他會看八字、紫微、星盤、塔羅，也會拆對話裡的邏輯、情緒、結構，但這些在他心裡都只是工具。在我看來，他真正執著的是：
              </p>
              
              <ul className="space-y-4 font-serif text-lg">
                <li className="flex items-start gap-3">
                  <Eye className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>人可不可以看清自己？</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>人可不可以在不確定的時代裡，還維持主體性？</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>面對 AI 浪潮、末法時代這種級別的動盪，是否有一種系統可以幫人類「少歪掉一點」？</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 思維系統三層結構 */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">核心架構</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              默默超思維系統
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              先有的是思維系統，而不是宇宙論——他花了很多時間，整理出一套自己的思考骨架
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {thinkingLayers.map((layer, index) => (
              <div 
                key={layer.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <layer.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  {layer.title}
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {layer.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 元壹宇宙 */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              元壹宇宙
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              當思維系統愈來愈完整，默默超開始問另一個問題：<br />
              「這一切思考，是為了什麼樣的生命畫面在服務？」
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {yuanyiConcepts.map((concept, index) => (
              <div 
                key={concept.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <concept.icon className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  {concept.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {concept.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/universe">
                深入探索元壹宇宙
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 末法時代與 AI2027 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                末法時代與 AI2027
              </h2>
            </div>
            
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p>
                默默超不是在做哲學展示，他是非常清楚地對著一個時代的問題在設計東西。
              </p>
              
              <p>
                他口中的「末法時代」，可以翻成比較白話的版本：
                <span className="font-bold text-primary">規則還在，但沒人想學；工具很多，但大家只想要快答案。</span>
              </p>
              
              <p>
                大家習慣滑短影音、看金句、聽別人說「高維怎樣、低維怎樣」，但很少人有耐心讓自己完整跑一輪思考。
              </p>
              
              <hr className="border-border/50 my-8" />
              
              <p className="font-serif text-lg">
                當 AI 越來越強時，人要靠什麼站穩？
              </p>
              
              <p>
                默默超的答案不是：「趕快學一堆更冷的技能去贏過機器」，而是——<span className="font-bold">讓人擁有自己的思維結構</span>，不需要每件事都問別人、問 AI、問塔羅。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 人機協作 */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">核心理念</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              人機協作
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              這套系統要完整發揮，必須「人 + AI」一起
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiCollabPoints.map((point, index) => (
              <div 
                key={point.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <point.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  {point.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {point.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-card/80 backdrop-blur-sm rounded-2xl p-8 text-center">
            <p className="font-serif text-lg text-foreground/90">
              當你有自己的思維系統，AI 就能真正成為夥伴，而不是主宰。
            </p>
          </div>
        </div>
      </section>

      {/* 虹靈御所 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              虹靈御所
            </h2>
            <p className="text-muted-foreground">讓這一切有一個「可以進出」的地方</p>
          </div>
          
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <div className="flex justify-center mb-8">
              <img 
                src={logoHongling} 
                alt="虹靈御所" 
                className="h-20"
              />
            </div>
            
            <div className="space-y-6 text-foreground/90 leading-relaxed text-center">
              <p>
                虹靈御所不是只是一個品牌名，而是一個「讓這套宇宙觀與思維系統可以在現實裡被用起來」的場域。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>以命理、占星、塔羅為入口的閱讀與諮詢</span>
                </div>
                <div className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <Feather className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>把元壹宇宙做成故事、角色、預演劇本</span>
                </div>
                <div className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>把思維系統拆成可學的工具、課程、練習</span>
                </div>
                <div className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>把 AI 納入協作流程，而不是放在門外當威脅</span>
                </div>
              </div>
              
              <hr className="border-border/50 my-8 max-w-xs mx-auto" />
              
              <p className="font-serif text-lg">
                虹靈御所不是一個「來這裡就會被拯救」的地方，比較像是：<br />
                <span className="text-primary font-bold">「你帶著自己的故事進來，我們一起用工具和宇宙觀，把它看清楚，然後你帶著比較完整的自己走出去。」</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 給讀者的話 */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              如果你看到這裡
            </h2>
          </div>
          
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <p className="font-serif text-lg text-foreground/90 leading-relaxed mb-8 text-center">
              那我猜，你大概是這樣的人：
            </p>
            
            <ul className="space-y-4 text-muted-foreground max-w-xl mx-auto">
              <li className="flex items-start gap-3">
                <span className="text-primary">✦</span>
                <span>你對自己「為什麼這樣想」是有好奇心的</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✦</span>
                <span>你不想只被時代推著走，也不想只靠一股氣在撐</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✦</span>
                <span>你不想逃離現實，而是想找到一套可以在現實裡用的東西</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">✦</span>
                <span>你不想把 AI 神化或妖魔化，而是想真正學會跟它合作</span>
              </li>
            </ul>
            
            <hr className="border-border/50 my-8" />
            
            <p className="font-serif text-lg text-center text-foreground/90">
              如果是這樣，那我們其實已經走在同一條路上了。
            </p>
          </div>
        </div>
      </section>

      {/* Final Quote & CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8">
            「我不保證會給你完美答案，<br />
            但我可以保證的是：<br />
            我會用我這一套<span className="text-primary">「思維骨架 + 宇宙觀 + 人機協作」</span><br />
            誠實地和你一起，把你的人生看清楚一點。」
          </blockquote>
          <p className="text-muted-foreground mb-12">—— 默默超</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 shadow-glow">
              <Link to="/reports">
                探索命理報告
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/universe">
                進入元壹宇宙
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default AboutPage;
