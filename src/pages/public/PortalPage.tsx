import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TypewriterText } from "@/components/TypewriterText";
import { PageLoadingSkeleton } from "@/components/public/PageLoadingSkeleton";
import { useSEO } from "@/hooks/useSEO";
import { Sparkles, Moon, Compass, User, ExternalLink, SkipForward, RotateCcw } from "lucide-react";

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

// Floating particle component
function FloatingParticles() {
  const particles = useRef(
    [...Array(30)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#c9a962]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Light rays component
function LightRays({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 h-[200vh] w-1"
          style={{
            background: `linear-gradient(to bottom, transparent, rgba(201,169,98,0.15), transparent)`,
            transform: `rotate(${i * 45}deg) translateY(-50%)`,
            transformOrigin: 'center top',
            animation: `rayPulse 4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Sparkle burst component
function SparkleBurst({ active }: { active: boolean }) {
  const sparkles = useRef(
    [...Array(20)].map(() => ({
      angle: Math.random() * 360,
      distance: 50 + Math.random() * 150,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.5,
    }))
  ).current;

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            background: 'radial-gradient(circle, #fff 0%, #c9a962 50%, transparent 100%)',
            borderRadius: '50%',
            opacity: active ? 0 : 0,
            transform: active 
              ? `rotate(${sparkle.angle}deg) translateX(${sparkle.distance}px) scale(0)` 
              : `rotate(${sparkle.angle}deg) translateX(0) scale(1)`,
            animation: active ? `sparkleBurst 1s ease-out ${sparkle.delay}s forwards` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// Hover particles for cards
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
            transform: isHovered ? `scale(1) translateY(-30px)` : `scale(0) translateY(0)`,
            transitionDuration: `${particle.duration}s`,
            transitionDelay: `${particle.delay}s`,
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
  const [burstActive, setBurstActive] = useState(false);

  useSEO({
    title: "虹靈御所 × 超烜創意 | 命理報告・品牌創意・生命智慧",
    description: "虹靈御所與超烜創意的交匯點。探索命理報告、品牌創意服務、元壹宇宙思維系統。",
    keywords: "命理報告, 紫微斗數, 八字, 占星, 人類圖, 虹靈御所, 超烜創意, 默默超",
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

  useEffect(() => {
    // Trigger burst on title stage
    if (stage === 'title') {
      setBurstActive(true);
      setTimeout(() => setBurstActive(false), 1500);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'tagline') {
      const timer = setTimeout(advanceStage, 1200);
      return () => clearTimeout(timer);
    }
    if (stage === 'title') {
      const timer = setTimeout(advanceStage, 2500);
      return () => clearTimeout(timer);
    }
    if (stage === 'intro') {
      const timer = setTimeout(advanceStage, 3000);
      return () => clearTimeout(timer);
    }
    if (stage === 'thinking-title') {
      const timer = setTimeout(advanceStage, 1200);
      return () => clearTimeout(timer);
    }
    if (stage === 'thinking-cards') {
      const timer = setTimeout(advanceStage, 2500);
      return () => clearTimeout(timer);
    }
    if (stage === 'language-title') {
      const timer = setTimeout(advanceStage, 1000);
      return () => clearTimeout(timer);
    }
    if (stage === 'language-content') {
      const timer = setTimeout(advanceStage, 2000);
      return () => clearTimeout(timer);
    }
    if (stage === 'portal-fly') {
      portalItems.forEach((_, index) => {
        setTimeout(() => {
          setCardsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 150);
      });
      const timer = setTimeout(() => {
        setStage('final-greeting');
        setShowFinalGreeting(true);
      }, 1000);
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

  const isAt = (s: AnimationStage) => stage === s;
  const isAtOrPast = (s: AnimationStage) => stageIndex(stage) >= stageIndex(s);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a0a0a_0%,#050505_100%)]" />
        
        {/* Animated nebula effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-[#c9a962]/10 blur-[150px] animate-pulse" 
            style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" 
            style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-amber-500/5 blur-[180px] animate-pulse" 
            style={{ animationDuration: '10s', animationDelay: '1s' }} />
        </div>

        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Light rays on title */}
        <LightRays active={isAtOrPast('title') && !isAtOrPast('portal-fly')} />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,169,98,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,98,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            animation: 'gridMove 20s linear infinite',
          }}
        />

        {/* Central glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,98,0.2) 0%, transparent 60%)',
            animation: 'centralPulse 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Skip and Replay buttons */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {/* Skip button - shown during animation */}
        {!isAtOrPast('final-greeting') && stage !== 'loading' && (
          <button
            onClick={() => {
              setStage('portal-fly');
              portalItems.forEach((_, index) => {
                setTimeout(() => {
                  setCardsVisible(prev => {
                    const newState = [...prev];
                    newState[index] = true;
                    return newState;
                  });
                }, index * 100);
              });
              setTimeout(() => {
                setStage('final-greeting');
                setShowFinalGreeting(true);
              }, 600);
            }}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            <span className="text-sm">跳過</span>
            <SkipForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
        
        {/* Replay button - shown after animation ends */}
        {isAtOrPast('final-greeting') && (
          <button
            onClick={() => {
              setCardsVisible([false, false, false, false]);
              setShowFinalGreeting(false);
              setBurstActive(false);
              setStage('greeting1');
            }}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="text-sm">重播</span>
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Intro Animation Content */}
        {!isAtOrPast('portal-fly') && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
            {/* Decorative spinning rings */}
            <div className={`relative transition-all duration-1000 ${isAtOrPast('greeting1') ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="absolute inset-0 w-20 h-20 mx-auto border border-[#c9a962]/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-0 w-16 h-16 mx-auto mt-2 border border-[#c9a962]/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="w-12 h-12 mx-auto mt-4 border border-[#c9a962]/40 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-[#c9a962] rounded-full animate-ping" />
              </div>
            </div>

            {/* Greetings with glow effect */}
            <div className="min-h-[220px] flex flex-col items-center justify-center space-y-4">
              {isAtOrPast('greeting1') && (
                <div className={`relative transition-all duration-700 ${isAt('greeting1') ? 'scale-110' : 'scale-100'}`}>
                  <div className={`absolute inset-0 blur-2xl transition-opacity duration-500 ${isAt('greeting1') ? 'opacity-60' : 'opacity-0'}`}
                    style={{ background: 'radial-gradient(circle, #c9a962 0%, transparent 70%)' }} />
                  <div className={`relative font-display text-2xl md:text-3xl lg:text-4xl tracking-wide transition-all duration-500 ${isAt('greeting1') ? 'text-white' : 'text-white/30'}`}
                    style={{ textShadow: isAt('greeting1') ? '0 0 60px rgba(201,169,98,0.8), 0 0 120px rgba(201,169,98,0.4)' : 'none' }}>
                    {isAt('greeting1') ? (
                      <TypewriterText text="你來了…" speed={80} delay={500} onComplete={advanceStage} />
                    ) : '你來了…'}
                  </div>
                </div>
              )}
              
              {isAtOrPast('greeting2') && (
                <div className={`relative transition-all duration-700 ${isAt('greeting2') ? 'scale-110' : 'scale-100'}`}>
                  <div className={`absolute inset-0 blur-2xl transition-opacity duration-500 ${isAt('greeting2') ? 'opacity-60' : 'opacity-0'}`}
                    style={{ background: 'radial-gradient(circle, #c9a962 0%, transparent 70%)' }} />
                  <div className={`relative font-display text-2xl md:text-3xl lg:text-4xl tracking-wide transition-all duration-500 ${isAt('greeting2') ? 'text-white' : 'text-white/30'}`}
                    style={{ textShadow: isAt('greeting2') ? '0 0 60px rgba(201,169,98,0.8), 0 0 120px rgba(201,169,98,0.4)' : 'none' }}>
                    {isAt('greeting2') ? (
                      <TypewriterText text="這裡是一面鏡子。" speed={60} delay={300} onComplete={advanceStage} />
                    ) : '這裡是一面鏡子。'}
                  </div>
                </div>
              )}
              
              {isAtOrPast('greeting3') && (
                <div className={`relative transition-all duration-700 ${isAt('greeting3') ? 'scale-110' : 'scale-100'}`}>
                  <div className={`absolute inset-0 blur-2xl transition-opacity duration-500 ${isAt('greeting3') ? 'opacity-60' : 'opacity-0'}`}
                    style={{ background: 'radial-gradient(circle, #c9a962 0%, transparent 70%)' }} />
                  <div className={`relative font-display text-2xl md:text-3xl lg:text-4xl tracking-wide transition-all duration-500 ${isAt('greeting3') ? 'text-white' : 'text-white/30'}`}
                    style={{ textShadow: isAt('greeting3') ? '0 0 60px rgba(201,169,98,0.8), 0 0 120px rgba(201,169,98,0.4)' : 'none' }}>
                    {isAt('greeting3') ? (
                      <TypewriterText text="不給答案，只給倒影。" speed={60} delay={300} onComplete={advanceStage} />
                    ) : '不給答案，只給倒影。'}
                  </div>
                </div>
              )}
              
              {isAtOrPast('greeting4') && (
                <div className={`relative transition-all duration-700 ${isAt('greeting4') ? 'scale-110' : 'scale-100'}`}>
                  <div className={`absolute inset-0 blur-2xl transition-opacity duration-500 ${isAt('greeting4') ? 'opacity-60' : 'opacity-0'}`}
                    style={{ background: 'radial-gradient(circle, #c9a962 0%, transparent 70%)' }} />
                  <div className={`relative font-display text-2xl md:text-3xl lg:text-4xl tracking-wide transition-all duration-500 ${isAt('greeting4') ? 'text-white' : 'text-white/30'}`}
                    style={{ textShadow: isAt('greeting4') ? '0 0 60px rgba(201,169,98,0.8), 0 0 120px rgba(201,169,98,0.4)' : 'none' }}>
                    {isAt('greeting4') ? (
                      <TypewriterText text="你要往哪裡照見自己…" speed={60} delay={300} onComplete={advanceStage} />
                    ) : '你要往哪裡照見自己…'}
                  </div>
                </div>
              )}
            </div>

            {/* Tagline with shimmer */}
            {isAtOrPast('tagline') && (
              <div className="relative overflow-hidden py-4">
                <div className={`flex items-center justify-center gap-3 transition-all duration-1000 ${isAtOrPast('tagline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#c9a962] to-transparent animate-pulse" />
                  <div className="text-[#c9a962] text-sm md:text-base tracking-[0.3em] font-light relative">
                    <span className="relative z-10">照見・回望・前行</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#c9a962] to-transparent animate-pulse" />
                </div>
              </div>
            )}

            {/* Title with burst effect */}
            {isAtOrPast('title') && (
              <div className="relative">
                <SparkleBurst active={burstActive} />
                <div className={`space-y-4 transition-all duration-1000 ${isAtOrPast('title') ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide relative">
                    <span className="relative inline-block">
                      <span className="absolute inset-0 blur-xl bg-gradient-to-r from-[#c9a962] via-amber-400 to-[#c9a962] opacity-50 animate-pulse" />
                      <span className="relative bg-gradient-to-r from-[#c9a962] via-amber-300 to-[#c9a962] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradientFlow">
                        MomoChao
                      </span>
                    </span>
                    <span className="text-white/80"> — </span>
                    <span className="text-white/90">The Guardian of Mirrors</span>
                  </h1>
                  <p className="text-white/70 text-xl md:text-2xl font-light italic animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    「我們不預測未來，只幫你看清現在。」
                  </p>
                </div>
              </div>
            )}

            {/* Intro text with stagger */}
            {isAtOrPast('intro') && (
              <div className="max-w-xl space-y-4 text-white/60 text-base md:text-lg leading-relaxed font-light">
                <p className="animate-slideUp" style={{ animationDelay: '0s' }}>
                  默默超不是一個人名，<br />而是一種思維方式的代稱。
                </p>
                <p className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
                  它代表一種觀看世界的角度：<br />不急著評判，不急著給答案，<br />而是先安靜地看見。
                </p>
                <p className="animate-slideUp text-white/80" style={{ animationDelay: '0.6s' }}>
                  「默默」是方法，「超」是目標。<br />
                  <span className="text-[#c9a962] font-medium">在沉默中觀察，在理解中超越。</span>
                </p>
              </div>
            )}

            {/* Thinking system */}
            {isAtOrPast('thinking-title') && (
              <div className="text-center space-y-2 animate-zoomIn">
                <h2 className="font-display text-xl md:text-2xl text-white/90 tracking-wide">默默超思維</h2>
                <p className="text-[#c9a962]/80 text-sm tracking-wider">一套改變世界的文明級生活方法</p>
              </div>
            )}

            {/* Thinking cards with stagger */}
            {isAtOrPast('thinking-cards') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {thinkingConcepts.map((concept, index) => (
                  <div 
                    key={concept.title}
                    className="p-5 rounded-xl bg-white/[0.03] border border-[#c9a962]/20 backdrop-blur-sm animate-cardFlip hover:border-[#c9a962]/40 hover:bg-white/[0.05] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,169,98,0.15)]"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <h3 className="text-[#c9a962] font-medium mb-2 tracking-wide">{concept.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-light whitespace-pre-line">{concept.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Language style */}
            {isAtOrPast('language-title') && (
              <h2 className="font-display text-xl md:text-2xl text-white/90 tracking-wide animate-zoomIn">
                語言風格
              </h2>
            )}

            {isAtOrPast('language-content') && (
              <div className="max-w-2xl w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-slideInLeft backdrop-blur-sm">
                    <p className="text-emerald-300 font-medium text-sm tracking-wide">我們這樣說</p>
                    <div className="flex flex-wrap gap-2">
                      {weDoSay.map((word, i) => (
                        <span key={word} 
                          className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300/90 text-xs border border-emerald-500/30 animate-popIn"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3 animate-slideInRight backdrop-blur-sm">
                    <p className="text-white/40 font-medium text-sm tracking-wide">我們不這樣說</p>
                    <div className="flex flex-wrap gap-2">
                      {weDontSay.map((word, i) => (
                        <span key={word} 
                          className="px-2 py-1 rounded-full bg-white/[0.03] text-white/30 text-xs border border-white/[0.05] line-through animate-popIn"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-center text-white/50 text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  對話以「<span className="text-[#c9a962]">我聽見…</span>」「<span className="text-[#c9a962]">要不要…</span>」「<span className="text-[#c9a962]">或許…</span>」開場
                </p>
              </div>
            )}
          </div>
        )}

        {/* Portal Cards - Fly in with dramatic entrance */}
        {isAtOrPast('portal-fly') && (
          <div className="min-h-screen flex flex-col items-center justify-center py-12 space-y-8">
            {/* Final greeting with typewriter */}
            {showFinalGreeting && (
              <div className="text-center mb-8 relative">
                <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: 'radial-gradient(circle, #c9a962 0%, transparent 70%)' }} />
                <div className="relative font-display text-2xl md:text-3xl lg:text-4xl tracking-wide">
                  <span className="bg-gradient-to-r from-[#c9a962] via-amber-300 to-[#c9a962] bg-clip-text text-transparent">
                    <TypewriterText 
                      text="你好！我是默默超！想從哪裡開始呢？" 
                      speed={50} 
                      delay={400} 
                    />
                  </span>
                </div>
              </div>
            )}

            {/* Portal cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl w-full">
              {portalItems.map((item, index) => {
                const CardWrapper = ({ children }: { children: React.ReactNode }) => 
                  item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative block p-6 md:p-7 rounded-2xl border ${item.borderColor} backdrop-blur-sm transition-all duration-700 hover:scale-[1.03] ${
                        cardsVisible[index] 
                          ? 'opacity-100 translate-y-0 rotate-0' 
                          : 'opacity-0 translate-y-20 rotate-3'
                      }`}
                      style={{ 
                        background: `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {children}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group relative block p-6 md:p-7 rounded-2xl border ${item.borderColor} backdrop-blur-sm transition-all duration-700 hover:scale-[1.03] ${
                        cardsVisible[index] 
                          ? 'opacity-100 translate-y-0 rotate-0' 
                          : 'opacity-0 translate-y-20 rotate-3'
                      }`}
                      style={{ 
                        background: `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {children}
                    </Link>
                  );

                return (
                  <CardWrapper key={item.title}>
                    <div 
                      className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                      style={{ background: `radial-gradient(circle at center, ${item.glowColor}, transparent 60%)` }}
                    />
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden"
                    >
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(105deg, transparent 40%, hsla(${item.accentHsl}, 0.2) 50%, transparent 60%)`,
                          animation: hoveredCard === index ? 'shimmerCard 1.5s ease-in-out infinite' : 'none',
                        }}
                      />
                    </div>
                    <HoverParticles isHovered={hoveredCard === index} color={item.particleColor} />
                    
                    <div className="relative flex items-start gap-4 md:gap-5">
                      <div className="relative shrink-0">
                        <div 
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                          style={{ backgroundColor: item.glowColor }}
                        />
                        <div 
                          className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/[0.1] to-white/[0.02] border border-white/[0.1] flex items-center justify-center ${item.iconColor} transition-all duration-500 group-hover:border-white/30`}
                          style={{ boxShadow: hoveredCard === index ? `0 0 40px ${item.glowColor}` : 'none' }}
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
                        <p className="text-[10px] text-white/30 font-medium tracking-[0.2em] uppercase">{item.subtitle}</p>
                        <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">{item.description}</p>
                        <p className={`text-sm font-medium ${item.iconColor} opacity-70 group-hover:opacity-100 flex items-center gap-1 pt-1`}>
                          {item.isExternal ? '↗' : '→'} {item.cta}
                        </p>
                      </div>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>

            {/* Footer */}
            <div className={`flex flex-col items-center gap-4 pt-8 transition-all duration-1000 ${showFinalGreeting ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#c9a962]/30 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#c9a962]/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-1 h-1 rounded-full bg-[#c9a962]/30 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <p className="text-white/40 text-sm md:text-base tracking-wider font-light font-serif">
                此刻的你，已在途中。
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Animations */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(-15px); opacity: 0.3; }
          75% { transform: translateY(-40px) translateX(5px); opacity: 0.2; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.1; transform: rotate(var(--rotation)) scaleY(1); }
          50% { opacity: 0.3; transform: rotate(var(--rotation)) scaleY(1.2); }
        }
        @keyframes centralPulse {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(80px); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shimmerCard {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes sparkleBurst {
          0% { opacity: 1; transform: rotate(var(--angle)) translateX(0) scale(1); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(150px) scale(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cardFlip {
          from { opacity: 0; transform: rotateX(-15deg) translateY(30px); }
          to { opacity: 1; transform: rotateX(0) translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
        .animate-zoomIn { animation: zoomIn 0.6s ease-out forwards; }
        .animate-cardFlip { animation: cardFlip 0.7s ease-out forwards; opacity: 0; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
        .animate-popIn { animation: popIn 0.4s ease-out forwards; opacity: 0; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-gradientFlow { animation: gradientFlow 3s linear infinite; }
      `}</style>
    </div>
  );
}
