import { useState, useEffect } from "react";
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
    gradient: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    hoverGlow: "hover:shadow-amber-500/20",
  },
  {
    title: "超烜創意",
    subtitle: "Maison de Chao",
    description: "頂級創意服務，打造品牌獨特魅力",
    icon: Sparkles,
    href: "/chaoxuan",
    gradient: "from-yellow-500/20 via-amber-500/10 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    hoverGlow: "hover:shadow-yellow-500/20",
  },
  {
    title: "元壹宇宙",
    subtitle: "Yuan-Yi Universe",
    description: "生命哲學與思維方法論的探索",
    icon: Compass,
    href: "/about",
    gradient: "from-purple-500/20 via-indigo-500/10 to-blue-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    hoverGlow: "hover:shadow-purple-500/20",
  },
  {
    title: "默默超是誰",
    subtitle: "Who is MomoChao",
    description: "認識默默超，了解思維系統的創始者",
    icon: User,
    href: "/momo",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    hoverGlow: "hover:shadow-emerald-500/20",
  },
];

const greetings = [
  "嗨，歡迎來到這裡 ✨",
  "我是默默超，很高興見到你",
  "這裡是一個探索自我的起點",
  "請選擇你想前往的地方吧 👇",
];

export default function PortalPage() {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false]);

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
              className={`group relative block p-6 rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.gradient} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] ${item.hoverGlow} hover:shadow-2xl ${cardsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 font-medium tracking-wider uppercase">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-white/60 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-white/60">→</span>
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
    </div>
  );
}
