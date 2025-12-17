import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TypewriterText } from "@/components/TypewriterText";
import { PageLoadingSkeleton } from "@/components/public/PageLoadingSkeleton";
import { useSEO } from "@/hooks/useSEO";
import { Sparkles, Moon, Compass, User, ExternalLink } from "lucide-react";

const thinkingConcepts = [
  {
    title: "完整性哲學",
    description: "世界缺乏的並非「正確性」，而是「完整性」。\n錯誤不是廢棄物，而是材料。",
  },
  {
    title: "弧度模型",
    description: "以「弧度」取代「二元」。\n所有狀態，都在圓周上的不同位置。",
  },
  {
    title: "高度整合型思維",
    description: "不以刪除錯誤來追求秩序，\n而以「整合全部」來追求穩定。",
  },
  {
    title: "鏡子非劇本",
    description: "我們不給答案，只給倒影。\n命運從來不是劇本，它只是一面鏡子。",
  },
];

const portalItems = [
  {
    title: "虹靈御所",
    subtitle: "Hongling Yusuo",
    description: "看見命盤裡的自己，而非被命運定義",
    cta: "進入虹靈御所",
    icon: Moon,
    href: "/home",
    glowColor: "rgba(245, 158, 11, 0.4)",
    particleColor: "bg-amber-300",
    borderColor: "border-amber-400/20",
    iconColor: "text-amber-300",
    accentHsl: "38, 92%, 50%",
  },
  {
    title: "超烜創意",
    subtitle: "Maison de Chao",
    description: "讓品牌成為一面鏡子，照見獨特的本質",
    cta: "進入超烜創意",
    icon: Sparkles,
    href: "/chaoxuan",
    glowColor: "rgba(201, 169, 98, 0.5)",
    particleColor: "bg-[#c9a962]",
    borderColor: "border-[#c9a962]/20",
    iconColor: "text-[#c9a962]",
    accentHsl: "43, 47%, 59%",
  },
  {
    title: "元壹宇宙",
    subtitle: "Yuan-Yi Universe",
    description: "在思維的鏡面裡，重新命名自己的世界",
    cta: "進入元壹宇宙",
    icon: Compass,
    href: "/about",
    glowColor: "rgba(168, 85, 247, 0.35)",
    particleColor: "bg-purple-300",
    borderColor: "border-purple-400/20",
    iconColor: "text-purple-300",
    accentHsl: "271, 91%, 65%",
  },
  {
    title: "默默超是誰",
    subtitle: "Who is MomoChao",
    description: "或許，只是另一個正在學會凝視自己的人",
    cta: "認識默默超",
    icon: User,
    href: "https://im-momochao.manus.space",
    isExternal: true,
    glowColor: "rgba(52, 211, 153, 0.35)",
    particleColor: "bg-emerald-300",
    borderColor: "border-emerald-400/20",
    iconColor: "text-emerald-300",
    accentHsl: "160, 84%, 39%",
  },
];

const weDoSay = ['看見', '照見', '回望', '聽見', '觀察', '辨識', '重新命名', '試試看', '留著', '安放'];
const weDontSay = ['評論', '批判', '判斷', '定義', '修正', '糾錯', '放下', '忘記', '拋棄'];

// Animation stages
type AnimationStage = 
  | 'loading'
  | 'greeting1' | 'greeting2' | 'greeting3' | 'greeting4'
  | 'tagline'
  | 'title'
  | 'intro'
  | 'thinking-title'
  | 'thinking-cards'
  | 'language-title'
  | 'language-content'
  | 'portal-fly'
  | 'final-greeting';

// Particle component for hover effect
function HoverParticles({ isHovered, color }: { isHovered: boolean; color: string }) {
  const particles = useRef(
    [...Array(8)].map(() => ({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 2,
      delay: Math.random() * 0.3,
      duration: 0.6 + Math.random() * 0.3,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${color} transition-all`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: isHovered ? 0.8 : 0,
            transform: isHovered 
              ? `scale(1) translateY(-30px)` 
              : `scale(0) translateY(0)`,
            transitionDuration: `${particle.duration}s`,
            transitionDelay: `${particle.delay}s`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
    </div>
  );
}

export default function PortalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<AnimationStage>('loading');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false]);
  const [showFinalGreeting, setShowFinalGreeting] = useState(false);

  useSEO({
    title: "虹靈御所 × 超烜創意 | 命理報告・品牌創意・生命智慧",
    description: "虹靈御所與超烜創意的交匯點。探索命理報告、品牌創意服務、元壹宇宙思維系統。看見命盤裡的自己，而非被命運定義。",
    keywords: "命理報告, 紫微斗數, 八字, 占星, 人類圖, 虹靈御所, 超烜創意, 默默超, 品牌設計, 生命智慧",
    ogTitle: "虹靈御所 × 超烜創意",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setStage('greeting1');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const advanceStage = () => {
    setStage(prev => {
      const stages: AnimationStage[] = [
        'loading', 'greeting1', 'greeting2', 'greeting3', 'greeting4',
        'tagline', 'title', 'intro', 'thinking-title', 'thinking-cards',
        'language-title', 'language-content', 'portal-fly', 'final-greeting'
      ];
      const currentIndex = stages.indexOf(prev);
      if (currentIndex < stages.length - 1) {
        return stages[currentIndex + 1];
      }
      return prev;
    });
  };

  // Auto-advance for non-typewriter stages
  useEffect(() => {
    if (stage === 'tagline') {
      const timer = setTimeout(advanceStage, 1500);
      return () => clearTimeout(timer);
    }
    if (stage === 'title') {
      const timer = setTimeout(advanceStage, 2000);
      return () => clearTimeout(timer);
    }
    if (stage === 'intro') {
      const timer = setTimeout(advanceStage, 3500);
      return () => clearTimeout(timer);
    }
    if (stage === 'thinking-title') {
      const timer = setTimeout(advanceStage, 1500);
      return () => clearTimeout(timer);
    }
    if (stage === 'thinking-cards') {
      const timer = setTimeout(advanceStage, 3000);
      return () => clearTimeout(timer);
    }
    if (stage === 'language-title') {
      const timer = setTimeout(advanceStage, 1200);
      return () => clearTimeout(timer);
    }
    if (stage === 'language-content') {
      const timer = setTimeout(advanceStage, 2500);
      return () => clearTimeout(timer);
    }
    if (stage === 'portal-fly') {
      // Fly in cards one by one
      portalItems.forEach((_, index) => {
        setTimeout(() => {
          setCardsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 200);
      });
      // Then show final greeting
      const timer = setTimeout(() => {
        setStage('final-greeting');
        setShowFinalGreeting(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const stageIndex = (s: AnimationStage) => {
    const stages: AnimationStage[] = [
      'loading', 'greeting1', 'greeting2', 'greeting3', 'greeting4',
      'tagline', 'title', 'intro', 'thinking-title', 'thinking-cards',
      'language-title', 'language-content', 'portal-fly', 'final-greeting'
    ];
    return stages.indexOf(s);
  };

  const isPast = (s: AnimationStage) => stageIndex(stage) > stageIndex(s);
  const isAt = (s: AnimationStage) => stage === s;
  const isAtOrPast = (s: AnimationStage) => stageIndex(stage) >= stageIndex(s);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(168,85,247,0.04),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_80%,rgba(245,158,11,0.04),transparent)]" />
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,98,0.3) 0%, transparent 70%)',
            animation: 'ambientPulse 8s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Intro Animation Content */}
        {!isAtOrPast('portal-fly') && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
            {/* Decorative element */}
            <div className={`flex items-center justify-center gap-4 transition-all duration-700 ${isAtOrPast('greeting1') ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-[#c9a962]/40" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent" />
            </div>

            {/* Greetings */}
            <div className="min-h-[200px] flex flex-col items-center justify-center space-y-3">
              {/* Greeting 1 */}
              {isAtOrPast('greeting1') && (
                <div className={`font-display text-xl md:text-2xl lg:text-3xl tracking-wide transition-all duration-500 ${isAt('greeting1') ? 'text-white/90' : 'text-white/30'}`}
                  style={{ textShadow: isAt('greeting1') ? '0 0 40px rgba(201,169,98,0.3)' : 'none' }}>
                  {isAt('greeting1') ? (
                    <TypewriterText text="你來了…" speed={60} delay={300} onComplete={advanceStage} />
                  ) : '你來了…'}
                </div>
              )}
              {/* Greeting 2 */}
              {isAtOrPast('greeting2') && (
                <div className={`font-display text-xl md:text-2xl lg:text-3xl tracking-wide transition-all duration-500 ${isAt('greeting2') ? 'text-white/90' : 'text-white/30'}`}
                  style={{ textShadow: isAt('greeting2') ? '0 0 40px rgba(201,169,98,0.3)' : 'none' }}>
                  {isAt('greeting2') ? (
                    <TypewriterText text="這裡是一面鏡子。" speed={50} delay={200} onComplete={advanceStage} />
                  ) : '這裡是一面鏡子。'}
                </div>
              )}
              {/* Greeting 3 */}
              {isAtOrPast('greeting3') && (
                <div className={`font-display text-xl md:text-2xl lg:text-3xl tracking-wide transition-all duration-500 ${isAt('greeting3') ? 'text-white/90' : 'text-white/30'}`}
                  style={{ textShadow: isAt('greeting3') ? '0 0 40px rgba(201,169,98,0.3)' : 'none' }}>
                  {isAt('greeting3') ? (
                    <TypewriterText text="不給答案，只給倒影。" speed={50} delay={200} onComplete={advanceStage} />
                  ) : '不給答案，只給倒影。'}
                </div>
              )}
              {/* Greeting 4 */}
              {isAtOrPast('greeting4') && (
                <div className={`font-display text-xl md:text-2xl lg:text-3xl tracking-wide transition-all duration-500 ${isAt('greeting4') ? 'text-white/90' : 'text-white/30'}`}
                  style={{ textShadow: isAt('greeting4') ? '0 0 40px rgba(201,169,98,0.3)' : 'none' }}>
                  {isAt('greeting4') ? (
                    <TypewriterText text="你要往哪裡照見自己…" speed={50} delay={200} onComplete={advanceStage} />
                  ) : '你要往哪裡照見自己…'}
                </div>
              )}
            </div>

            {/* Tagline */}
            {isAtOrPast('tagline') && (
              <div className={`flex items-center justify-center gap-3 transition-all duration-700 ${isAtOrPast('tagline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a962]/30" />
                <div className="text-[#c9a962]/50 text-xs md:text-sm tracking-[0.2em] font-light font-serif">照見・回望・前行</div>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a962]/30" />
              </div>
            )}

            {/* Title */}
            {isAtOrPast('title') && (
              <div className={`space-y-4 transition-all duration-700 ${isAtOrPast('title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[#c9a962] tracking-wide">
                  MomoChao — The Guardian of Mirrors
                </h1>
                <p className="text-white/60 text-lg md:text-xl lg:text-2xl font-light italic">
                  「我們不預測未來，只幫你看清現在。」
                </p>
              </div>
            )}

            {/* Intro text */}
            {isAtOrPast('intro') && (
              <div className={`max-w-xl space-y-4 text-white/60 text-base md:text-lg leading-relaxed font-light transition-all duration-700 ${isAtOrPast('intro') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <p>默默超不是一個人名，<br />而是一種思維方式的代稱。</p>
                <p>它代表一種觀看世界的角度：<br />不急著評判，不急著給答案，<br />而是先安靜地看見。</p>
                <p className="text-white/80">「默默」是方法，「超」是目標。<br /><span className="text-[#c9a962]">在沉默中觀察，在理解中超越。</span></p>
              </div>
            )}

            {/* Thinking system title */}
            {isAtOrPast('thinking-title') && (
              <div className={`text-center space-y-2 transition-all duration-700 ${isAtOrPast('thinking-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <h2 className="font-display text-xl md:text-2xl text-white/90 tracking-wide">默默超思維</h2>
                <p className="text-[#c9a962]/80 text-sm tracking-wider">一套改變世界的文明級生活方法</p>
              </div>
            )}

            {/* Thinking cards */}
            {isAtOrPast('thinking-cards') && (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl transition-all duration-700 ${isAtOrPast('thinking-cards') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {thinkingConcepts.map((concept, index) => (
                  <div 
                    key={concept.title}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <h3 className="text-[#c9a962]/90 font-medium mb-2 tracking-wide">{concept.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-light whitespace-pre-line">{concept.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Language style title */}
            {isAtOrPast('language-title') && (
              <h2 className={`font-display text-xl md:text-2xl text-white/90 tracking-wide transition-all duration-700 ${isAtOrPast('language-title') ? 'opacity-100' : 'opacity-0'}`}>
                語言風格
              </h2>
            )}

            {/* Language content */}
            {isAtOrPast('language-content') && (
              <div className={`max-w-2xl w-full space-y-6 transition-all duration-700 ${isAtOrPast('language-content') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                    <p className="text-emerald-300 font-medium text-sm tracking-wide">我們這樣說</p>
                    <div className="flex flex-wrap gap-2">
                      {weDoSay.map(word => (
                        <span key={word} className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300/90 text-xs border border-emerald-500/20">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                    <p className="text-white/40 font-medium text-sm tracking-wide">我們不這樣說</p>
                    <div className="flex flex-wrap gap-2">
                      {weDontSay.map(word => (
                        <span key={word} className="px-2 py-1 rounded-full bg-white/[0.03] text-white/30 text-xs border border-white/[0.05] line-through">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-center text-white/50 text-sm">
                  對話以「<span className="text-[#c9a962]">我聽見…</span>」「<span className="text-[#c9a962]">要不要…</span>」「<span className="text-[#c9a962]">或許…</span>」開場，<br />
                  取代「<span className="text-white/30 line-through">你應該…</span>」「<span className="text-white/30 line-through">所以…</span>」「<span className="text-white/30 line-through">應該是…</span>」。
                </p>
              </div>
            )}
          </div>
        )}

        {/* Portal Cards - Fly in */}
        {isAtOrPast('portal-fly') && (
          <div className="min-h-screen flex flex-col items-center justify-center py-12 space-y-8">
            {/* Final greeting with typewriter */}
            {showFinalGreeting && (
              <div className="text-center mb-8">
                <div className="font-display text-xl md:text-2xl lg:text-3xl text-[#c9a962] tracking-wide">
                  <TypewriterText 
                    text="你好！我是默默超！想從哪裡開始呢？" 
                    speed={50} 
                    delay={300} 
                  />
                </div>
              </div>
            )}

            {/* Portal cards 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl w-full">
              {portalItems.map((item, index) => {
                const CardWrapper = ({ children }: { children: React.ReactNode }) => 
                  item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative block p-6 md:p-7 rounded-2xl border ${item.borderColor} backdrop-blur-sm transition-all duration-700 hover:scale-[1.02] ${
                        cardsVisible[index] 
                          ? 'opacity-100 translate-y-0 translate-x-0' 
                          : 'opacity-0 translate-y-12 ' + (index % 2 === 0 ? '-translate-x-12' : 'translate-x-12')
                      }`}
                      style={{ 
                        background: `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(15,15,15,0.95) 100%)`,
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {children}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group relative block p-6 md:p-7 rounded-2xl border ${item.borderColor} backdrop-blur-sm transition-all duration-700 hover:scale-[1.02] ${
                        cardsVisible[index] 
                          ? 'opacity-100 translate-y-0 translate-x-0' 
                          : 'opacity-0 translate-y-12 ' + (index % 2 === 0 ? '-translate-x-12' : 'translate-x-12')
                      }`}
                      style={{ 
                        background: `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(15,15,15,0.95) 100%)`,
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {children}
                    </Link>
                  );

                return (
                  <CardWrapper key={item.title}>
                    {/* Outer glow effect */}
                    <div 
                      className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10"
                      style={{ background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)` }}
                    />
                    
                    {/* Subtle inner gradient on hover */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at 30% 0%, hsla(${item.accentHsl}, 0.08) 0%, transparent 60%)` }}
                    />
                    
                    {/* Hover particles */}
                    <HoverParticles isHovered={hoveredCard === index} color={item.particleColor} />
                    
                    {/* Content */}
                    <div className="relative flex items-start gap-4 md:gap-5">
                      <div className="relative shrink-0">
                        <div 
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                          style={{ backgroundColor: item.glowColor }}
                        />
                        <div 
                          className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center ${item.iconColor} transition-all duration-500 group-hover:border-white/20`}
                          style={{ boxShadow: hoveredCard === index ? `0 0 30px ${item.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)` : 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
                        >
                          <item.icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 
                          className="font-display text-lg md:text-xl lg:text-2xl font-medium text-white/90 tracking-wide transition-all duration-300 group-hover:text-white flex items-center gap-2"
                          style={{ textShadow: hoveredCard === index ? `0 0 30px ${item.glowColor}` : 'none' }}
                        >
                          {item.title}
                          {item.isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                        </h3>
                        <p className="text-[10px] text-white/30 font-medium tracking-[0.2em] uppercase group-hover:text-white/50 transition-colors duration-300">
                          {item.subtitle}
                        </p>
                        <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300 font-light">
                          {item.description}
                        </p>
                        <p className={`text-sm font-medium transition-colors duration-300 ${item.iconColor} group-hover:opacity-100 opacity-70 flex items-center gap-1 pt-1`}>
                          {item.isExternal ? '↗' : '→'} {item.cta}
                        </p>
                      </div>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>

            {/* Footer closing */}
            <div className={`flex flex-col items-center gap-4 pt-8 transition-all duration-700 ${showFinalGreeting ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#c9a962]/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a962]/50" />
                <div className="w-1 h-1 rounded-full bg-[#c9a962]/30" />
              </div>
              <p className="text-white/30 text-sm md:text-base tracking-wider font-light font-serif">
                此刻的你，已在途中。
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Animations */}
      <style>{`
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.15; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 0.25; transform: translate(-50%, 0) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
