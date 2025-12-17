import { useEffect, useState } from "react";

export function PageLoadingSkeleton() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,98,0.4) 0%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Animated logo placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a962]/20 to-[#c9a962]/5 border border-[#c9a962]/20 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-[#c9a962]/30 animate-pulse" />
        </div>

        {/* Loading text with dots animation */}
        <div className="flex items-center gap-1">
          <span className="text-white/50 text-sm tracking-wider font-light">正在載入</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#c9a962]/60"
                style={{
                  animation: `bounce 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#c9a962]/40 to-[#c9a962]/80 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Skeleton cards preview */}
        <div className="grid grid-cols-2 gap-3 mt-8 opacity-30">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-32 h-20 rounded-xl bg-white/5 border border-white/5 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
