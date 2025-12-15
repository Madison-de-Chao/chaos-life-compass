import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import { Quote, Lightbulb, Heart, Brain, Compass } from "lucide-react";

const philosophies = [
  {
    icon: Brain,
    title: "完整性哲學",
    content: "世界缺乏的並非「正確性」，而是「完整性」。錯誤不是廢棄物，而是材料。當錯誤被排除，它無法被理解、無法被整合、無法轉化。",
  },
  {
    icon: Compass,
    title: "弧度模型",
    content: "以「弧度模型」取代「二元模型」。所有狀態都在圓周上的不同位置，所有碎片皆為未完成的弧線，每一段皆指向圓心。",
  },
  {
    icon: Lightbulb,
    title: "高度整合型思維",
    content: "不以刪除錯誤來追求秩序，而是以「整合全部」來追求穩定。情緒是資訊、失誤是材料、幻覺是可能性、錯估是線索。",
  },
  {
    icon: Heart,
    title: "鏡子非劇本",
    content: "我們不給答案，只給倒影。真理不在預言中，而在誠實地凝視自己。命運從來不是劇本，它只是一面鏡子。",
  },
];

const MomoPage = () => {
  return (
    <div className="min-h-screen bg-parchment">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-parchment-hero" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            誰是<span className="text-primary">默默超</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            MomoChao — The Guardian of Mirrors
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            「我們不預測未來，只幫你看清現在。」
          </p>
        </div>
      </section>
      
      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <div className="flex justify-center mb-8">
              <Quote className="h-12 w-12 text-primary/30" />
            </div>
            <div className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90 text-center space-y-6">
              <p>
                默默超不是一個人名，<br />
                而是一種思維方式的代稱。
              </p>
              <p>
                它代表著一種觀看世界的角度：<br />
                不急著評判，不急著給答案，<br />
                而是先安靜地看見。
              </p>
              <p className="text-muted-foreground">
                「默默」是方法，「超」是目標。<br />
                在沉默中觀察，在理解中超越。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Philosophy Cards */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-800/5 to-transparent" />
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            默默超思維
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            一套改變世界的文明級生活方法
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {philosophies.map((item, index) => (
              <div 
                key={item.title}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Language Style */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
            語言風格
          </h2>
          
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  我們這樣說
                </h3>
                <ul className="space-y-3 text-foreground/80">
                  <li>• 看見、照見、回望、聽見</li>
                  <li>• 觀察、辨識、重新命名</li>
                  <li>• 重寫、行動、轉換、試試看</li>
                  <li>• 留著、紀錄、照顧、安放</li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  我們不這樣說
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• 評論、分析、批判</li>
                  <li>• 判斷、定義、解釋</li>
                  <li>• 修正、糾正、糾錯</li>
                  <li>• 放下、忘記、拋棄</li>
                </ul>
              </div>
            </div>
            
            <hr className="border-border/50 my-8" />
            
            <div className="text-center">
              <p className="font-serif text-lg text-foreground/80 mb-4">
                對話以「我聽見」「要不要」「或許」開場
              </p>
              <p className="text-muted-foreground">
                取代「你應該」「所以」「應該是」
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Closing Quote */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-700/5 to-transparent" />
        <div className="container mx-auto max-w-3xl text-center">
          <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed mb-8">
            「看見自己，是最深的修行。<br />
            而此刻的你，已在途中。」
          </blockquote>
          <p className="text-primary font-medium">—— 默默超</p>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
};

export default MomoPage;
