import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TypewriterText } from "@/components/TypewriterText";
import { PageLoadingSkeleton } from "@/components/public/PageLoadingSkeleton";
import { Sparkles, Moon, Compass, User } from "lucide-react";

const portalItems = [
  {
    title: "虹靈御所",
    subtitle: "Hongling Yusuo",
    description: "看見命盤裡的自己，而非被命運定義",
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
    icon: User,
    href: "/momo",
    glowColor: "rgba(52, 211, 153, 0.35)",
    particleColor: "bg-emerald-300",
    borderColor: "border-emerald-400/20",
    iconColor: "text-emerald-300",
    accentHsl: "160, 84%, 39%",
  },
];

const greetings = [
  "你來了…",
  "這裡是一面鏡子",
  "不給答案，只給倒影",
  "要往哪裡照見自己…",
];

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
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // SEO meta tags
  useEffect(() => {
    document.title = "虹靈御所 × 超烜創意 | 命理報告・品牌創意・生命智慧";
    
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', '虹靈御所與超烜創意的交匯點。探索命理報告、品牌創意服務、元壹宇宙思維系統。看見命盤裡的自己，而非被命運定義。');

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', '命理報告, 紫微斗數, 八字, 占星, 人類圖, 虹靈御所, 超烜創意, 默默超, 品牌設計, 生命智慧');

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: '虹靈御所 × 超烜創意' },
      { property: 'og:description', content: '探索命理報告、品牌創意服務、元壹宇宙思維系統。看見命盤裡的自己，而非被命運定義。' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: '虹靈御所 × 超烜創意' },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    return () => {
      document.title = "虹靈御所";
    };
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleGreetingComplete = () => {
    if (currentGreetingIndex < greetings.length - 1) {
      setTimeout(() => {
        setCurrentGreetingIndex(prev => prev + 1);
      }, 400);
    } else {
      setTimeout(() => {
        setShowCards(true);
      }, 200);
    }
  };

  useEffect(() => {
    if (showCards) {
      portalItems.forEach((_, index) => {
        setTimeout(() => {
          setCardsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 120);
      });
    }
  }, [showCards]);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Elegant radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(168,85,247,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_80%,rgba(245,158,11,0.04),transparent)]" />
      
      {/* Animated ambient light */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,98,0.3) 0%, transparent 70%)',
          animation: 'ambientPulse 8s ease-in-out infinite',
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,169,98,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,98,0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 max-w-4xl w-full space-y-16">
        {/* Greeting section */}
        <div className="text-center space-y-8">
          {/* Elegant decorative element */}
          <div className="flex items-center justify-center gap-4 animate-fade-in">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent" />
            <div className="w-2 h-2 rotate-45 border border-[#c9a962]/40" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent" />
          </div>

          {/* Typewriter greetings with elegant typography */}
          <div className="min-h-[140px] flex flex-col items-center justify-center space-y-3">
            {greetings.slice(0, currentGreetingIndex + 1).map((greeting, index) => (
              <div 
                key={index} 
                className={`font-display text-xl md:text-2xl tracking-wide transition-all duration-500 ${
                  index === currentGreetingIndex 
                    ? 'text-white/90' 
                    : 'text-white/30'
                }`}
                style={{
                  textShadow: index === currentGreetingIndex ? '0 0 40px rgba(201,169,98,0.3)' : 'none',
                }}
              >
                {index === currentGreetingIndex ? (
                  <TypewriterText
                    text={greeting}
                    speed={50}
                    delay={index === 0 ? 600 : 0}
                    onComplete={handleGreetingComplete}
                  />
                ) : (
                  <span className="animate-fade-in">{greeting}</span>
                )}
              </div>
            ))}
          </div>

          {/* Elegant separator */}
          <div className={`flex items-center justify-center gap-3 transition-all duration-700 ${showCards ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a962]/30" />
            <div className="text-[#c9a962]/40 text-xs tracking-[0.2em] font-light font-serif">照見・回望・前行</div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a962]/30" />
          </div>
        </div>

        {/* Portal cards with premium styling */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 transition-all duration-700 ${showCards ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {portalItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={`group relative block p-7 rounded-2xl border ${item.borderColor} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] ${cardsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ 
                transitionDelay: `${index * 80}ms`,
                background: `linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(15,15,15,0.95) 100%)`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outer glow effect */}
              <div 
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10"
                style={{ 
                  background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)`,
                }}
              />
              
              {/* Subtle inner gradient on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 30% 0%, hsla(${item.accentHsl}, 0.08) 0%, transparent 60%)`,
                }}
              />
              
              {/* Animated border glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden"
              >
                <div 
                  className="absolute inset-[-1px] rounded-2xl"
                  style={{
                    background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, hsla(${item.accentHsl}, 0.3) 60deg, transparent 120deg)`,
                    animation: hoveredCard === index ? 'borderRotate 4s linear infinite' : 'none',
                  }}
                />
              </div>
              
              {/* Light sweep effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, hsla(${item.accentHsl}, 0.1) 45%, hsla(${item.accentHsl}, 0.2) 50%, hsla(${item.accentHsl}, 0.1) 55%, transparent 60%)`,
                    transform: 'translateX(-100%)',
                    animation: hoveredCard === index ? 'shimmer 2s ease-in-out infinite' : 'none',
                  }}
                />
              </div>
              
              {/* Hover particles */}
              <HoverParticles isHovered={hoveredCard === index} color={item.particleColor} />
              
              {/* Content */}
              <div className="relative flex items-start gap-5">
                {/* Icon with glow */}
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    style={{ backgroundColor: item.glowColor }}
                  />
                  <div 
                    className={`relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center ${item.iconColor} transition-all duration-500 group-hover:border-white/20`}
                    style={{
                      boxShadow: hoveredCard === index ? `0 0 30px ${item.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)` : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    <item.icon className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                
                {/* Text content */}
                <div className="flex-1 space-y-2 pt-1">
                  <h3 
                    className="font-display text-xl md:text-2xl font-medium text-white/90 tracking-wide transition-all duration-300 group-hover:text-white"
                    style={{
                      textShadow: hoveredCard === index ? `0 0 30px ${item.glowColor}` : 'none',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-white/30 font-medium tracking-[0.2em] uppercase group-hover:text-white/50 transition-colors duration-300">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300 font-light">
                    {item.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500"
                  style={{
                    boxShadow: hoveredCard === index ? `0 0 20px ${item.glowColor}` : 'none',
                  }}
                >
                  <span className="text-white/60 text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${showCards ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-[#c9a962]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a962]/50" />
            <div className="w-1 h-1 rounded-full bg-[#c9a962]/30" />
          </div>
          <p className="text-white/20 text-xs tracking-wider font-light font-serif">
            此刻的你，已在途中
          </p>
        </div>
      </div>
      
      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes borderRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.15; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 0.25; transform: translate(-50%, 0) scale(1.1); }
        }
      `}</style>
    </div>
  );
}