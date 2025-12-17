import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TypewriterText } from "@/components/TypewriterText";
import { Sparkles, Moon, Compass, User } from "lucide-react";

const portalItems = [
  {
    title: "虹靈御所",
    subtitle: "Hongling Yusuo",
    description: "探索命理的奧秘，解讀人生的密碼",
    icon: Moon,
    href: "/home",
    glowColor: "rgba(245, 158, 11, 0.4)",
    particleColor: "bg-amber-400",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    accentHsl: "38, 92%, 50%",
  },
  {
    title: "超烜創意",
    subtitle: "Maison de Chao",
    description: "頂級創意服務，打造品牌獨特魅力",
    icon: Sparkles,
    href: "/chaoxuan",
    glowColor: "rgba(234, 179, 8, 0.4)",
    particleColor: "bg-yellow-400",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    accentHsl: "48, 96%, 53%",
  },
  {
    title: "元壹宇宙",
    subtitle: "Yuan-Yi Universe",
    description: "生命哲學與思維方法論的探索",
    icon: Compass,
    href: "/about",
    glowColor: "rgba(168, 85, 247, 0.4)",
    particleColor: "bg-purple-400",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    accentHsl: "271, 91%, 65%",
  },
  {
    title: "默默超是誰",
    subtitle: "Who is MomoChao",
    description: "認識默默超，了解思維系統的創始者",
    icon: User,
    href: "/momo",
    glowColor: "rgba(52, 211, 153, 0.4)",
    particleColor: "bg-emerald-400",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    accentHsl: "160, 84%, 39%",
  },
];

const greetings = [
  "嗨，歡迎來到這裡 ✨",
  "我是默默超，很高興見到你",
  "這裡是一個探索自我的起點",
  "請選擇你想前往的地方吧 👇",
];

// Particle component for hover effect
function HoverParticles({ isHovered, color }: { isHovered: boolean; color: string }) {
  const particles = useRef(
    [...Array(12)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.4,
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
            opacity: isHovered ? 1 : 0,
            transform: isHovered 
              ? `scale(1) translateY(-20px)` 
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
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleGreetingComplete = () => {
    if (currentGreetingIndex < greetings.length - 1) {
      setTimeout(() => {
        setCurrentGreetingIndex(prev => prev + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowCards(true);
      }, 300);
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
        }, index * 150);
      });
    }
  }, [showCards]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.08),transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-12">
        {/* Greeting section */}
        <div className="text-center space-y-6">
          {/* Avatar */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center animate-fade-in">
            <span className="text-3xl">🌟</span>
          </div>

          {/* Typewriter greetings */}
          <div className="min-h-[120px] flex flex-col items-center justify-center space-y-2">
            {greetings.slice(0, currentGreetingIndex + 1).map((greeting, index) => (
              <div 
                key={index} 
                className={`text-lg md:text-xl ${index === currentGreetingIndex ? 'text-white' : 'text-white/50'}`}
              >
                {index === currentGreetingIndex ? (
                  <TypewriterText
                    text={greeting}
                    speed={60}
                    delay={index === 0 ? 500 : 0}
                    onComplete={handleGreetingComplete}
                  />
                ) : (
                  <span className="animate-fade-in">{greeting}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Portal cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-opacity duration-500 ${showCards ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {portalItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={`group relative block p-6 rounded-2xl border ${item.borderColor} backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] ${cardsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: `${index * 50}ms`,
                background: `linear-gradient(135deg, hsla(${item.accentHsl}, 0.1) 0%, hsla(${item.accentHsl}, 0.05) 50%, transparent 100%)`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outer glow effect */}
              <div 
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ 
                  background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)`,
                }}
              />
              
              {/* Inner card background */}
              <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm" />
              
              {/* Animated border glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, hsla(${item.accentHsl}, 0.3) 0%, transparent 50%, hsla(${item.accentHsl}, 0.3) 100%)`,
                  padding: '1px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                }}
              />
              
              {/* Light sweep effect */}
              <div 
                className="absolute inset-0 rounded-2xl overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, hsla(${item.accentHsl}, 0.15) 45%, hsla(${item.accentHsl}, 0.3) 50%, hsla(${item.accentHsl}, 0.15) 55%, transparent 60%)`,
                    transform: 'translateX(-100%)',
                    animation: hoveredCard === index ? 'shimmer 1.5s ease-in-out infinite' : 'none',
                  }}
                />
              </div>
              
              {/* Hover particles */}
              <HoverParticles isHovered={hoveredCard === index} color={item.particleColor} />
              
              {/* Radial glow behind icon */}
              <div 
                className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: item.glowColor }}
              />
              
              <div className="relative flex items-start gap-4">
                <div 
                  className={`w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center ${item.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  style={{
                    boxShadow: hoveredCard === index ? `0 0 20px ${item.glowColor}` : 'none',
                  }}
                >
                  <item.icon className="w-6 h-6 group-hover:animate-pulse" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <h3 
                    className="text-xl font-bold text-white transition-all duration-300"
                    style={{
                      textShadow: hoveredCard === index ? `0 0 20px ${item.glowColor}` : 'none',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 font-medium tracking-wider uppercase group-hover:text-white/60 transition-colors">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-white/60 mt-2 leading-relaxed group-hover:text-white/80 transition-colors">
                    {item.description}
                  </p>
                </div>

                {/* Arrow indicator with glow */}
                <div 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  style={{
                    boxShadow: hoveredCard === index ? `0 0 15px ${item.glowColor}` : 'none',
                  }}
                >
                  <span className="text-white/80">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Skip button for returning users */}
        <div className={`text-center transition-opacity duration-500 ${showCards ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/30 text-sm">
            按下任一入口開始探索
          </p>
        </div>
      </div>
      
      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}