import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageLoadingSkeleton } from "@/components/public/PageLoadingSkeleton";
import { useSEO } from "@/hooks/useSEO";
import { useMember } from "@/hooks/useMember";
import { useIsMobile } from "@/hooks/use-mobile";
import { MemberLoginWidget } from "@/components/auth/MemberLoginWidget";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ExternalLink, SkipForward, RotateCcw, Volume2, VolumeX, FastForward, UserCircle2, LogIn } from "lucide-react";

// Brand logos
import logoHongling from "@/assets/logo-hongling-yusuo.png";
import logoChaoxuan from "@/assets/logo-maison-de-chao-full.png";
import logoYuanyi from "@/assets/logo-yuanyi-universe.png";

const portalItems = [
  {
    title: "虹靈御所",
    subtitle: "Rainbow Sanctuary",
    description: "命理工具，不是算命攤。看清現狀、給可執行的下一步，選不選在你。",
    cta: "進入虹靈御所",
    logo: logoHongling,
    href: "/home",
    glowColor: "rgba(245, 158, 11, 0.4)",
    particleColor: "bg-amber-300",
    borderColor: "border-amber-400/20",
  },
  {
    title: "超烜創意",
    subtitle: "Maison de Chao",
    description: "品牌策略與創意服務。把你想說的話說清楚，讓對的人聽見。",
    cta: "進入超烜創意",
    logo: logoChaoxuan,
    href: "/chaoxuan",
    glowColor: "rgba(201, 169, 98, 0.5)",
    particleColor: "bg-[#c9a962]",
    borderColor: "border-[#c9a962]/20",
  },
  {
    title: "元壹宇宙",
    subtitle: "Yuan-Yi Universe",
    description: "把東方玄學拆開來講清楚的思維系統。不賣預言，只做可追溯的說明。",
    cta: "進入元壹宇宙",
    logo: logoYuanyi,
    href: "/universe",
    glowColor: "rgba(168, 85, 247, 0.35)",
    particleColor: "bg-purple-300",
    borderColor: "border-purple-400/20",
  },
  {
    title: "默默超是誰",
    subtitle: "Who is MomoChao",
    description: "一個把自己踩過的坑做成工具的人。不是老師，是思考夥伴。",
    cta: "認識默默超",
    logo: null,
    href: "/about",
    isExternal: false,
    glowColor: "rgba(52, 211, 153, 0.35)",
    particleColor: "bg-emerald-300",
    borderColor: "border-emerald-400/20",
  },
  {
    title: "AI 專屬｜元壹宇宙 × CIP",
    subtitle: "AI Collaboration Portal",
    description: "跟 AI 協作的規則：說真話、標來源、守邊界。讓人機合作有個底線。",
    cta: "進入 AI 協作入口",
    logo: null,
    href: "/ai",
    isExternal: false,
    glowColor: "rgba(59, 130, 246, 0.35)",
    particleColor: "bg-blue-300",
    borderColor: "border-blue-400/20",
  },
];

// Gentle ambient music
function useAmbientMusic() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const intervalsRef = useRef<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const startMusic = useCallback(() => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const nodes: AudioNode[] = [];
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Reverb
    const createReverb = () => {
      const convolver = ctx.createConvolver();
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.5;
      const sampleRate = ctx.sampleRate;
      const length = sampleRate * 4;
      const impulse = ctx.createBuffer(2, length, sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
        }
      }
      convolver.buffer = impulse;
      convolver.connect(reverbGain);
      reverbGain.connect(masterGain);
      return convolver;
    };

    const reverb = createReverb();
    nodes.push(reverb);

    // Warm pad
    const createWarmPad = () => {
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;
        
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.03 + Math.random() * 0.02;
        lfoGain.gain.value = 0.008;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        nodes.push(lfo);
        
        gain.gain.value = 0.025;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        gain.connect(reverb);
        osc.start();
        nodes.push(osc);
      });
    };

    // Vocal hum
    const createVocalHum = () => {
      const baseFreq = 165;
      const formants = [
        { freq: 400, Q: 6, gain: 1.0 },
        { freq: 800, Q: 8, gain: 0.4 },
        { freq: 1600, Q: 10, gain: 0.15 },
      ];

      const vocalOsc = ctx.createOscillator();
      vocalOsc.type = 'triangle';
      vocalOsc.frequency.value = baseFreq;
      
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 3.5;
      vibratoGain.gain.value = 1.5;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(vocalOsc.frequency);
      vibrato.start();
      nodes.push(vibrato);

      formants.forEach(formant => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = formant.freq;
        filter.Q.value = formant.Q;
        const formantGain = ctx.createGain();
        formantGain.gain.value = formant.gain * 0.006;
        vocalOsc.connect(filter);
        filter.connect(formantGain);
        formantGain.connect(reverb);
      });

      vocalOsc.start();
      nodes.push(vocalOsc);
    };

    // Chimes
    const createGentleChimes = () => {
      const chimeNotes = [1046.5, 1174.66, 1318.5, 1396.91, 1568.0];
      
      const playChime = () => {
        const freq = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        filter.type = 'highpass';
        filter.frequency.value = 800;
        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(reverb);
        osc.start();
        osc.stop(ctx.currentTime + 4.5);
      };
      
      const scheduleChime = () => {
        playChime();
        const nextDelay = 4000 + Math.random() * 6000;
        const timeout = window.setTimeout(scheduleChime, nextDelay);
        intervalsRef.current.push(timeout);
      };
      
      const initialDelay = window.setTimeout(scheduleChime, 3000);
      intervalsRef.current.push(initialDelay);
    };

    createWarmPad();
    createVocalHum();
    createGentleChimes();
    nodesRef.current = nodes;
    masterGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 5);
    setIsPlaying(true);
  }, []);

  const stopMusic = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 2);
      intervalsRef.current.forEach(id => clearTimeout(id));
      intervalsRef.current = [];
      setTimeout(() => {
        nodesRef.current.forEach(node => {
          try { if (node instanceof OscillatorNode) node.stop(); } catch (e) {}
        });
        audioContextRef.current?.close();
        audioContextRef.current = null;
        gainNodeRef.current = null;
        nodesRef.current = [];
      }, 2500);
    }
    setIsPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) stopMusic();
    else startMusic();
  }, [isPlaying, startMusic, stopMusic]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(id => clearTimeout(id));
      nodesRef.current.forEach(node => {
        try { if (node instanceof OscillatorNode) node.stop(); } catch (e) {}
      });
      audioContextRef.current?.close();
    };
  }, []);

  return { isPlaying, startMusic, toggleMusic };
}

// Floating particles - optimized for mobile
function FloatingParticles({ isMobile }: { isMobile: boolean }) {
  const particles = useMemo(() => 
    [...Array(isMobile ? 12 : 40)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  , [isMobile]);

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
            animation: isMobile ? undefined : `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Shooting stars - optimized for mobile (fewer stars, simpler animation)
function ShootingStars({ isMobile }: { isMobile: boolean }) {
  const stars = useMemo(() => 
    [...Array(isMobile ? 2 : 6)].map(() => ({
      startX: Math.random() * 100,
      startY: Math.random() * 30,
      angle: 20 + Math.random() * 40,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 12,
      length: isMobile ? 60 : 80 + Math.random() * 100,
    }))
  , [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: star.length,
            height: 2,
            background: `linear-gradient(90deg, transparent, #c9a962 30%, #fff 50%, #c9a962 70%, transparent)`,
            transform: `rotate(${star.angle}deg)`,
            animation: `shootingStar ${star.duration}s ease-out ${star.delay}s infinite`,
            opacity: 0,
            boxShadow: isMobile ? undefined : '0 0 8px #c9a962',
          }}
        />
      ))}
    </div>
  );
}

// Glowing orbs - optimized for mobile (fewer orbs, no animation on mobile)
function GlowingOrbs({ isMobile }: { isMobile: boolean }) {
  const orbs = useMemo(() => isMobile ? [
    { x: 50, y: 40, size: 100, color: 'rgba(201, 169, 98, 0.15)', delay: 0 },
  ] : [
    { x: 20, y: 30, size: 80, color: 'rgba(201, 169, 98, 0.2)', delay: 0 },
    { x: 80, y: 20, size: 60, color: 'rgba(168, 85, 247, 0.15)', delay: 1 },
    { x: 70, y: 70, size: 90, color: 'rgba(245, 158, 11, 0.15)', delay: 2 },
    { x: 30, y: 75, size: 70, color: 'rgba(52, 211, 153, 0.15)', delay: 0.5 },
  ], [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            animation: isMobile ? undefined : `orbFloat 12s ease-in-out ${orb.delay}s infinite`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

// Cosmic dust swirl - disabled on mobile for performance
function CosmicDust({ isMobile }: { isMobile: boolean }) {
  const dust = useMemo(() => 
    isMobile ? [] : [...Array(60)].map(() => ({
      orbitRadius: 150 + Math.random() * 350,
      duration: 30 + Math.random() * 50,
      delay: Math.random() * 30,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2,
      startAngle: Math.random() * 360,
    }))
  , [isMobile]);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dust.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#c9a962]"
          style={{
            left: '50%',
            top: '50%',
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animation: `cosmicOrbit ${d.duration}s linear ${d.delay}s infinite`,
            '--orbit-radius': `${d.orbitRadius}px`,
            '--start-angle': `${d.startAngle}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Lightning bolts - disabled on mobile for performance
function LightningBolts({ isMobile }: { isMobile: boolean }) {
  const [bolts, setBolts] = useState<{ id: number; x: number; path: string; delay: number }[]>([]);
  
  useEffect(() => {
    if (isMobile) return;
    
    const generateBolt = () => {
      const x = 10 + Math.random() * 80;
      let path = `M ${x} 0`;
      let y = 0;
      while (y < 100) {
        y += 5 + Math.random() * 15;
        const xOffset = (Math.random() - 0.5) * 20;
        path += ` L ${x + xOffset} ${y}`;
      }
      return { id: Date.now(), x, path, delay: 0 };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBolts(prev => [...prev.slice(-2), generateBolt()]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full absolute">
        {bolts.map((bolt) => (
          <g key={bolt.id}>
            <path
              d={bolt.path}
              fill="none"
              stroke="rgba(201, 169, 98, 0.6)"
              strokeWidth="3"
              filter="url(#glow)"
              style={{ animation: 'lightningFlash 0.5s ease-out forwards' }}
            />
            <path
              d={bolt.path}
              fill="none"
              stroke="white"
              strokeWidth="1"
              style={{ animation: 'lightningFlash 0.5s ease-out forwards' }}
            />
          </g>
        ))}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// Energy ripples - disabled on mobile for performance
function EnergyRipples({ isMobile }: { isMobile: boolean }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isMobile) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setRipples(prev => [
          ...prev.slice(-3),
          { id: Date.now(), x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }
        ]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-[#c9a962]/40"
              style={{
                width: 20,
                height: 20,
                transform: 'translate(-50%, -50%)',
                animation: `rippleExpand 3s ease-out ${i * 0.4}s forwards`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Light pillars - simplified on mobile
function LightPillars({ isMobile }: { isMobile: boolean }) {
  const pillars = useMemo(() => 
    isMobile ? [
      { x: 50, width: 3, delay: 0, duration: 6, opacity: 0.1 },
    ] : [...Array(5)].map(() => ({
      x: 10 + Math.random() * 80,
      width: 2 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.2,
    }))
  , [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pillars.map((pillar, i) => (
        <div
          key={i}
          className="absolute top-0 h-full"
          style={{
            left: `${pillar.x}%`,
            width: pillar.width,
            background: `linear-gradient(180deg, transparent 0%, rgba(201, 169, 98, ${pillar.opacity}) 20%, rgba(201, 169, 98, ${pillar.opacity * 1.5}) 50%, rgba(201, 169, 98, ${pillar.opacity}) 80%, transparent 100%)`,
            animation: isMobile ? undefined : `pillarGlow ${pillar.duration}s ease-in-out ${pillar.delay}s infinite`,
            filter: isMobile ? undefined : 'blur(2px)',
            opacity: isMobile ? 0.15 : undefined,
          }}
        />
      ))}
    </div>
  );
}

// Hover particles for cards - simplified on mobile
function HoverParticles({ isHovered, color, isMobile }: { isHovered: boolean; color: string; isMobile: boolean }) {
  const particles = useMemo(() => 
    [...Array(isMobile ? 4 : 12)].map(() => ({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.3,
      duration: 0.5 + Math.random() * 0.3,
    }))
  , [isMobile]);

  // Skip rendering on mobile for better performance
  if (isMobile) return null;

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
            transform: isHovered ? `scale(1) translateY(-40px)` : `scale(0) translateY(0)`,
            transitionDuration: `${particle.duration}s`,
            transitionDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Member login section component
function MemberLoginSection() {
  const { user } = useMember();
  const [showWidget, setShowWidget] = useState(false);

  if (user) {
    return (
      <div className="mt-8 flex justify-center">
        <a
          href="https://member.momo-chao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          <UserCircle2 className="w-5 h-5 text-[#c9a962]" />
          <span>前往會員中心</span>
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center">
      {!showWidget ? (
        <button
          onClick={() => setShowWidget(true)}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          <LogIn className="w-5 h-5 text-[#c9a962]" />
          <span>會員登入 / 註冊</span>
        </button>
      ) : (
        <div className="w-full max-w-sm animate-fade-in">
          <MemberLoginWidget 
            onClose={() => setShowWidget(false)} 
            compact
          />
        </div>
      )}
    </div>
  );
}

// Content sections with cross-fade - uses logos imported at top of file
const createIntroSections = () => [
  {
    id: 'logos',
    content: (
      <div className="space-y-6 sm:space-y-8 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10">
          <div className="relative group">
            <div className="absolute inset-0 blur-2xl bg-amber-400/30 rounded-full animate-pulse" />
            <img 
              src={logoHongling} 
              alt="虹靈御所" 
              className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain animate-[float_4s_ease-in-out_infinite]" 
            />
          </div>
          <div className="relative group" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 blur-2xl bg-[#c9a962]/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <img 
              src={logoChaoxuan} 
              alt="超烜創意" 
              className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 object-contain animate-[float_4s_ease-in-out_0.5s_infinite]" 
            />
          </div>
          <div className="relative group" style={{ animationDelay: '1s' }}>
            <div className="absolute inset-0 blur-2xl bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <img 
              src={logoYuanyi} 
              alt="元壹宇宙" 
              className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain animate-[float_4s_ease-in-out_1s_infinite]" 
            />
          </div>
        </div>
        <div className="text-[#c9a962] text-sm sm:text-lg md:text-xl tracking-[0.2em] sm:tracking-[0.3em] font-light opacity-70">
          三個入口，同一套思維系統
        </div>
      </div>
    ),
    duration: 5000,
  },
  {
    id: 'greeting',
    content: (
      <div className="space-y-4 sm:space-y-6 px-4">
        <div className="text-[#c9a962] text-base sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] font-light opacity-80">
          說真話，說人話，守住邊界
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
          <span className="relative inline-block">
            <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-[#c9a962] via-amber-400 to-[#c9a962] opacity-40" />
            <span className="relative text-[#c9a962]">默默超元壹體系</span>
          </span>
        </h1>
        <p className="text-white/70 text-base sm:text-xl md:text-2xl font-light italic">
          「幫你看清自己的狀況，不替你做決定。」
        </p>
      </div>
    ),
    duration: 6000,
  },
  {
    id: 'intro',
    content: (
      <div className="space-y-5 sm:space-y-8 text-white/80 text-base sm:text-xl md:text-2xl leading-relaxed font-light max-w-2xl mx-auto px-6">
        <p>這裡不告訴你「你是誰」。<br className="hidden sm:block" /><span className="sm:hidden"> </span>這裡幫你看清現狀，然後給你可以做的下一步。</p>
        <p>確定的事說確定，不確定的標出來。有來源的附來源，沒有的直接說沒有。</p>
        <p><span className="text-[#c9a962]">不是算命，不是心靈雞湯，不是課程推銷。</span><br />
          是工具。決定怎麼用，是你的事。
        </p>
      </div>
    ),
    duration: 8000,
  },
  {
    id: 'philosophy',
    content: (
      <div className="space-y-5 sm:space-y-8 max-w-2xl mx-auto px-4">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-4 sm:mb-8">三條底線</h2>
        <div className="grid gap-4 sm:gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
            <h3 className="text-[#c9a962] text-lg sm:text-xl font-display mb-2 sm:mb-3">說真話</h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">確定的說確定，不確定的標出來。不用「可能」「大概」來模糊界線。</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
            <h3 className="text-[#c9a962] text-lg sm:text-xl font-display mb-2 sm:mb-3">說人話</h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">不說場面話，每一段都有實際內容。像值得信任的朋友，不像客服。</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
            <h3 className="text-[#c9a962] text-lg sm:text-xl font-display mb-2 sm:mb-3">守住邊界</h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">分清事實、推測、立場。不替你做選擇，不承接不屬於自己的責任。</p>
          </div>
        </div>
      </div>
    ),
    duration: 7000,
  },
  {
    id: 'four-dimensions',
    content: (
      <div className="space-y-5 sm:space-y-8 max-w-3xl mx-auto px-4">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2 sm:mb-4">四個操作維度</h2>
        <p className="text-white/60 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">任何決定都跑不出這四件事</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 backdrop-blur-sm border border-rose-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💭</div>
            <h3 className="text-rose-300 text-base sm:text-lg font-display mb-1 sm:mb-2">情緒</h3>
            <p className="text-white/50 text-xs sm:text-sm">你現在感覺什麼</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm border border-amber-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">⚡</div>
            <h3 className="text-amber-300 text-base sm:text-lg font-display mb-1 sm:mb-2">行動</h3>
            <p className="text-white/50 text-xs sm:text-sm">你接下來能做什麼</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm border border-blue-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🧠</div>
            <h3 className="text-blue-300 text-base sm:text-lg font-display mb-1 sm:mb-2">心智</h3>
            <p className="text-white/50 text-xs sm:text-sm">你怎麼看這件事</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm border border-emerald-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💎</div>
            <h3 className="text-emerald-300 text-base sm:text-lg font-display mb-1 sm:mb-2">價值</h3>
            <p className="text-white/50 text-xs sm:text-sm">你在乎的到底是什麼</p>
          </div>
        </div>
      </div>
    ),
    duration: 7000,
  },
  {
    id: 'human-ai-era',
    content: (
      <div className="space-y-5 sm:space-y-8 max-w-2xl mx-auto px-5">
        <div className="text-[#c9a962]/60 text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] uppercase">人機協作時代</div>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-wide leading-relaxed">
          AI 能回答問題，<br />
          <span className="text-[#c9a962]">但問題要你自己問對。</span>
        </h2>
        <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed">
          工具再強，用的人不清楚自己要什麼，<br className="hidden sm:block" />
          <span className="sm:hidden"> </span>結果就是被工具帶著跑。<br className="hidden sm:block" />
          <span className="sm:hidden"> </span>這套系統幫你搞清楚自己的立場，再去用工具。
        </p>
      </div>
    ),
    duration: 8000,
  },
  {
    id: 'closing',
    content: (
      <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto px-5">
        <p className="text-white/70 text-lg sm:text-xl md:text-2xl font-light leading-relaxed italic">
          「對方越來越不需要你，就代表你做對了。」
        </p>
        <p className="text-white/50 text-sm sm:text-base md:text-lg">
          我們不想讓你依賴這套系統。<br className="hidden sm:block" />
          用完覺得有用就好，不用就放著，沒關係。
        </p>
        <div className="pt-2 sm:pt-4">
          <div className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 border border-[#c9a962]/30 rounded-full">
            <span className="text-[#c9a962] text-base sm:text-lg tracking-wider">選擇你的入口 ↓</span>
          </div>
        </div>
      </div>
    ),
    duration: 5000,
  },
];

const introSections = createIntroSections();

export default function PortalPage() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false, false]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const { isPlaying, startMusic, toggleMusic } = useAmbientMusic();
  const hasStartedMusic = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useSEO({
    title: "默默超元壹體系｜說真話的自我探索工具",
    description: "不是算命、不是心靈雞湯、不是課程推銷。默默超元壹體系是一套幫你看清現狀、給可執行下一步的思維工具。確定的說確定，不確定的標出來，選擇權在你手上。",
    keywords: "默默超, 元壹宇宙, 虹靈御所, 超烜創意, 自我探索, 決策工具, 思考夥伴",
    ogTitle: "默默超元壹體系 — 幫你看清狀況，不替你做決定",
  });

  // Start music on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasStartedMusic.current) {
        startMusic();
        hasStartedMusic.current = true;
      }
    };
    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, [startMusic]);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Section progression with cross-fade
  useEffect(() => {
    if (isLoading || showPortal) return;
    
    const section = introSections[currentSection];
    if (!section) return;

    // Wait for duration (adjusted by speed multiplier), then fade out and advance
    const adjustedDuration = section.duration / speedMultiplier;
    const fadeTime = Math.max(400, 1000 / speedMultiplier);
    
    timeoutRef.current = window.setTimeout(() => {
      if (currentSection < introSections.length - 1) {
        setIsFading(true);
        // Wait for fade out with blur, then switch content
        setTimeout(() => {
          setCurrentSection(prev => prev + 1);
          setIsFading(false);
        }, fadeTime);
      } else {
        // Show portal after last section
        setIsFading(true);
        setTimeout(() => {
          setShowPortal(true);
          setIsFading(false);
          // Reveal cards one by one
          portalItems.forEach((_, index) => {
            setTimeout(() => {
              setCardsVisible(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, (300 + index * 200) / speedMultiplier);
          });
        }, fadeTime);
      }
    }, adjustedDuration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, currentSection, showPortal, speedMultiplier]);

  const skipToEnd = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFading(true);
    setTimeout(() => {
      setShowPortal(true);
      setIsFading(false);
      portalItems.forEach((_, index) => {
        setTimeout(() => {
          setCardsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 150 + index * 120);
      });
    }, 800);
  }, []);

  const replay = useCallback(() => {
    setShowPortal(false);
    setCardsVisible([false, false, false, false, false]);
    setCurrentSection(0);
    setIsFading(false);
    setSpeedMultiplier(1);
  }, []);

  const toggleSpeed = useCallback(() => {
    setSpeedMultiplier(prev => prev === 1 ? 2 : prev === 2 ? 3 : 1);
  }, []);

  const isInIntro = !showPortal;

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a0a0a_0%,#050505_100%)]" />
        
        {/* Nebula */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#c9a962]/5 blur-[180px]"
            style={{ animation: 'breathe 8s ease-in-out infinite' }} 
          />
          <div 
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]"
            style={{ animation: 'breathe 10s ease-in-out 2s infinite' }} 
          />
          <div 
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px]"
            style={{ animation: 'breathe 9s ease-in-out 1s infinite' }} 
          />
        </div>

        <FloatingParticles isMobile={isMobile} />
        <ShootingStars isMobile={isMobile} />
        <GlowingOrbs isMobile={isMobile} />
        <CosmicDust isMobile={isMobile} />
        <LightningBolts isMobile={isMobile} />
        <EnergyRipples isMobile={isMobile} />
        <LightPillars isMobile={isMobile} />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Controls - optimized for mobile touch */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex gap-2 md:gap-3">
        <button
          onClick={toggleMusic}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 md:w-10 md:h-10 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm touch-manipulation active:scale-95"
        >
          {isPlaying ? <Volume2 className="w-5 h-5 md:w-4 md:h-4" /> : <VolumeX className="w-5 h-5 md:w-4 md:h-4" />}
        </button>

        {isInIntro && (
          <>
            <button
              onClick={toggleSpeed}
              className={`group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 min-h-[44px] border rounded-full transition-all duration-300 backdrop-blur-sm touch-manipulation active:scale-95 ${
                speedMultiplier > 1 
                  ? 'bg-[#c9a962]/20 border-[#c9a962]/40 text-[#c9a962]' 
                  : 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/10 hover:border-[#c9a962]/30 text-white/60 hover:text-white'
              }`}
            >
              <FastForward className="w-4 h-4" />
              <span className="text-sm font-medium">{speedMultiplier}x</span>
            </button>
            <button
              onClick={skipToEnd}
              className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 min-h-[44px] bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm touch-manipulation active:scale-95"
            >
              <span className="text-sm font-medium">跳過</span>
              <SkipForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
        
        {!isInIntro && (
          <button
            onClick={replay}
            className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 min-h-[44px] bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm touch-manipulation active:scale-95"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="text-sm font-medium">重播</span>
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full">
        
        {/* Intro sections with cross-fade */}
        {isInIntro && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div 
              className={`text-center max-w-3xl px-6 transition-all ease-in-out ${
                isFading 
                  ? 'opacity-0 scale-95 blur-sm' 
                  : 'opacity-100 scale-100 blur-0'
              }`}
              style={{ transitionDuration: '1000ms' }}
            >
              {introSections[currentSection]?.content}
            </div>
            
            {/* Progress indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {introSections.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    idx === currentSection ? 'bg-[#c9a962] w-6' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Portal cards */}
        {showPortal && (
          <div 
            className={`fixed inset-0 flex flex-col items-center justify-center px-4 transition-all ${
              isFading ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
            }`}
            style={{ transitionDuration: '1000ms' }}
          >
            {/* Greeting */}
            <div className="text-center mb-6 md:mb-8 px-4">
              <h2 
                className="font-display text-xl sm:text-2xl md:text-3xl text-white mb-2 md:mb-3"
                style={{ textShadow: '0 0 40px rgba(201,169,98,0.4)' }}
              >
                你好，我是默默超。
              </h2>
              <p className="text-white/50 text-base md:text-lg">想從哪裡開始？</p>
            </div>

            {/* Cards grid - optimized for mobile touch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-4xl w-full px-4 sm:px-6">
              {portalItems.map((item, index) => {
                const isHovered = hoveredCard === index;
                const isVisible = cardsVisible[index];
                const fromLeft = index % 2 === 0;

                return (
                  <div
                    key={item.title}
                    className={`transition-all duration-700 ease-out ${
                      isVisible 
                        ? 'opacity-100 translate-x-0 translate-y-0' 
                        : fromLeft 
                          ? 'opacity-0 -translate-x-12' 
                          : 'opacity-0 translate-x-12'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {item.isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative block p-4 sm:p-5 md:p-6 rounded-2xl border ${item.borderColor} bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] active:bg-white/[0.08] overflow-hidden touch-manipulation active:scale-[0.98] min-h-[88px]`}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onTouchStart={() => setHoveredCard(index)}
                        onTouchEnd={() => setTimeout(() => setHoveredCard(null), 150)}
                      >
                        <HoverParticles isHovered={isHovered} color={item.particleColor} isMobile={isMobile} />
                        <div 
                          className={`absolute inset-0 transition-opacity duration-500 rounded-2xl ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                          style={{ boxShadow: `inset 0 0 60px ${item.glowColor}` }}
                        />
                        <div className="relative flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-active:scale-105 transition-transform duration-300 overflow-hidden">
                            <span className="text-emerald-300 text-xl sm:text-2xl font-display">默</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                              <h3 className="font-display text-lg sm:text-xl text-white group-hover:text-[#c9a962] group-active:text-[#c9a962] transition-colors truncate">{item.title}</h3>
                              <ExternalLink className="w-4 h-4 flex-shrink-0 text-white/30 group-hover:text-white/60 transition-colors" />
                            </div>
                            <p className="text-white/40 text-xs sm:text-sm mb-1 sm:mb-2 truncate">{item.subtitle}</p>
                            <p className="text-white/60 text-xs sm:text-sm line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className={`group relative block p-4 sm:p-5 md:p-6 rounded-2xl border ${item.borderColor} bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] active:bg-white/[0.08] overflow-hidden touch-manipulation active:scale-[0.98] min-h-[88px]`}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onTouchStart={() => setHoveredCard(index)}
                        onTouchEnd={() => setTimeout(() => setHoveredCard(null), 150)}
                      >
                        <HoverParticles isHovered={isHovered} color={item.particleColor} isMobile={isMobile} />
                        <div 
                          className={`absolute inset-0 transition-opacity duration-500 rounded-2xl ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                          style={{ boxShadow: `inset 0 0 60px ${item.glowColor}` }}
                        />
                        <div className="relative flex items-center gap-3 sm:gap-4">
                          {item.logo ? (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-active:scale-105 transition-transform duration-300 overflow-hidden">
                              <img 
                                src={item.logo} 
                                alt={item.title} 
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-active:scale-105 transition-transform duration-300 overflow-hidden">
                              <span className="text-emerald-300 text-xl sm:text-2xl font-display">默</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg sm:text-xl text-white group-hover:text-[#c9a962] group-active:text-[#c9a962] transition-colors mb-0.5 sm:mb-1 truncate">{item.title}</h3>
                            <p className="text-white/40 text-xs sm:text-sm mb-1 sm:mb-2 truncate">{item.subtitle}</p>
                            <p className="text-white/60 text-xs sm:text-sm line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Member Login Section */}
            <MemberLoginSection />

            {/* Footer */}
            <p className="text-white/30 text-xs sm:text-sm mt-6 md:mt-8 px-4 text-center">
              選不選都行，看過就好。
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: var(--opacity, 0.2); 
          }
          50% { 
            transform: translate(30px, -40px) scale(1.1); 
            opacity: calc(var(--opacity, 0.2) * 1.3); 
          }
        }
        @keyframes breathe {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.4; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2); 
            opacity: 0.7; 
          }
        }
        @keyframes shootingStar {
          0% { 
            opacity: 0; 
            transform: rotate(var(--angle, 30deg)) translateX(-100px); 
          }
          10% { opacity: 0.8; }
          100% { 
            opacity: 0; 
            transform: rotate(var(--angle, 30deg)) translateX(600px); 
          }
        }
        @keyframes orbFloat {
          0%, 100% { 
            transform: translate(-50%, -50%) translate(0, 0); 
          }
          25% { 
            transform: translate(-50%, -50%) translate(25px, -15px); 
          }
          50% { 
            transform: translate(-50%, -50%) translate(-15px, 25px); 
          }
          75% { 
            transform: translate(-50%, -50%) translate(-25px, -10px); 
          }
        }
        @keyframes cosmicOrbit {
          from { 
            transform: rotate(var(--start-angle, 0deg)) translateX(var(--orbit-radius, 200px)) rotate(calc(-1 * var(--start-angle, 0deg)));
          }
          to { 
            transform: rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--orbit-radius, 200px)) rotate(calc(-1 * (var(--start-angle, 0deg) + 360deg)));
          }
        }
        @keyframes lightningFlash {
          0% { opacity: 0; }
          10% { opacity: 1; }
          30% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes rippleExpand {
          0% { 
            width: 20px; 
            height: 20px; 
            opacity: 0.6; 
          }
          100% { 
            width: 200px; 
            height: 200px; 
            opacity: 0; 
          }
        }
        @keyframes pillarGlow {
          0%, 100% { 
            opacity: 0.1; 
            transform: scaleY(0.8);
          }
          50% { 
            opacity: 0.4; 
            transform: scaleY(1);
          }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
