import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageLoadingSkeleton } from "@/components/public/PageLoadingSkeleton";
import { useSEO } from "@/hooks/useSEO";
import { Sparkles, Moon, Compass, User, ExternalLink, SkipForward, RotateCcw, Volume2, VolumeX, FastForward } from "lucide-react";

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

// Floating particles
function FloatingParticles() {
  const particles = useRef(
    [...Array(40)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
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

// Shooting stars
function ShootingStars() {
  const stars = useRef(
    [...Array(6)].map(() => ({
      startX: Math.random() * 100,
      startY: Math.random() * 30,
      angle: 20 + Math.random() * 40,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 12,
      length: 80 + Math.random() * 100,
    }))
  ).current;

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
            boxShadow: '0 0 8px #c9a962',
          }}
        />
      ))}
    </div>
  );
}

// Glowing orbs
function GlowingOrbs() {
  const orbs = [
    { x: 20, y: 30, size: 80, color: 'rgba(201, 169, 98, 0.2)', delay: 0 },
    { x: 80, y: 20, size: 60, color: 'rgba(168, 85, 247, 0.15)', delay: 1 },
    { x: 70, y: 70, size: 90, color: 'rgba(245, 158, 11, 0.15)', delay: 2 },
    { x: 30, y: 75, size: 70, color: 'rgba(52, 211, 153, 0.15)', delay: 0.5 },
  ];

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
            animation: `orbFloat 12s ease-in-out ${orb.delay}s infinite`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

// Cosmic dust swirl
function CosmicDust() {
  const dust = useRef(
    [...Array(60)].map(() => ({
      orbitRadius: 150 + Math.random() * 350,
      duration: 30 + Math.random() * 50,
      delay: Math.random() * 30,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2,
      startAngle: Math.random() * 360,
    }))
  ).current;

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

// Lightning bolts
function LightningBolts() {
  const [bolts, setBolts] = useState<{ id: number; x: number; path: string; delay: number }[]>([]);
  
  useEffect(() => {
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
  }, []);

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

// Energy ripples
function EnergyRipples() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setRipples(prev => [
          ...prev.slice(-3),
          { id: Date.now(), x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }
        ]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

// Light pillars
function LightPillars() {
  const pillars = useRef(
    [...Array(5)].map(() => ({
      x: 10 + Math.random() * 80,
      width: 2 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.2,
    }))
  ).current;

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
            animation: `pillarGlow ${pillar.duration}s ease-in-out ${pillar.delay}s infinite`,
            filter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  );
}

// Hover particles for cards
function HoverParticles({ isHovered, color }: { isHovered: boolean; color: string }) {
  const particles = useRef(
    [...Array(12)].map(() => ({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.3,
      duration: 0.5 + Math.random() * 0.3,
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
            transform: isHovered ? `scale(1) translateY(-40px)` : `scale(0) translateY(0)`,
            transitionDuration: `${particle.duration}s`,
            transitionDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Content sections with cross-fade
const introSections = [
  {
    id: 'greeting',
    content: (
      <div className="space-y-6">
        <div className="text-[#c9a962] text-xl md:text-2xl tracking-[0.3em] font-light opacity-80">
          照見・回望・前行
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide">
          <span className="relative inline-block">
            <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-[#c9a962] via-amber-400 to-[#c9a962] opacity-40" />
            <span className="relative text-[#c9a962]">MomoChao</span>
          </span>
        </h1>
        <p className="text-white/70 text-xl md:text-2xl font-light italic">
          「我們不預測未來，只幫你看清現在。」
        </p>
      </div>
    ),
    duration: 6000,
  },
  {
    id: 'intro',
    content: (
      <div className="space-y-8 text-white/80 text-xl md:text-2xl leading-relaxed font-light max-w-2xl mx-auto">
        <p>默默超不是一個人名，<br />而是一種思維方式的代稱。</p>
        <p>不急著評判，不急著給答案，<br />而是先安靜地看見。</p>
        <p>「默默」是方法，「超」是目標。<br />
          <span className="text-[#c9a962]">在沉默中觀察，在理解中超越。</span>
        </p>
      </div>
    ),
    duration: 8000,
  },
  {
    id: 'philosophy',
    content: (
      <div className="space-y-8 max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-8">默默超思維</h2>
        <div className="grid gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/20 rounded-2xl p-6 text-left">
            <h3 className="text-[#c9a962] text-xl font-display mb-3">鏡子非劇本</h3>
            <p className="text-white/60 text-base leading-relaxed">命運從來不是劇本，它只是一面鏡子。我們不給答案，只給倒影。</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/20 rounded-2xl p-6 text-left">
            <h3 className="text-[#c9a962] text-xl font-display mb-3">完整性哲學</h3>
            <p className="text-white/60 text-base leading-relaxed">世界缺乏的並非「正確性」，而是「完整性」。錯誤不是廢棄物，而是材料。</p>
          </div>
        </div>
      </div>
    ),
    duration: 7000,
  },
];

export default function PortalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const { isPlaying, startMusic, toggleMusic } = useAmbientMusic();
  const hasStartedMusic = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useSEO({
    title: "虹靈御所 × 超烜創意 | 命理報告・品牌創意・生命智慧",
    description: "虹靈御所與超烜創意的交匯點。探索命理報告、品牌創意服務、元壹宇宙思維系統。",
    keywords: "命理報告, 紫微斗數, 八字, 占星, 人類圖, 虹靈御所, 超烜創意, 默默超",
    ogTitle: "虹靈御所 × 超烜創意",
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
    setCardsVisible([false, false, false, false]);
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

        <FloatingParticles />
        <ShootingStars />
        <GlowingOrbs />
        <CosmicDust />
        <LightningBolts />
        <EnergyRipples />
        <LightPillars />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button
          onClick={toggleMusic}
          className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {isInIntro && (
          <>
            <button
              onClick={toggleSpeed}
              className={`group flex items-center gap-2 px-4 py-2 border rounded-full transition-all duration-300 backdrop-blur-sm ${
                speedMultiplier > 1 
                  ? 'bg-[#c9a962]/20 border-[#c9a962]/40 text-[#c9a962]' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#c9a962]/30 text-white/60 hover:text-white'
              }`}
            >
              <FastForward className="w-4 h-4" />
              <span className="text-sm">{speedMultiplier}x</span>
            </button>
            <button
              onClick={skipToEnd}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              <span className="text-sm">跳過</span>
              <SkipForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
        
        {!isInIntro && (
          <button
            onClick={replay}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="text-sm">重播</span>
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
            <div className="text-center mb-8">
              <h2 
                className="font-display text-2xl md:text-3xl text-white mb-3"
                style={{ textShadow: '0 0 40px rgba(201,169,98,0.4)' }}
              >
                你好！我是默默超！
              </h2>
              <p className="text-white/50 text-lg">想從哪裡開始呢？</p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl w-full">
              {portalItems.map((item, index) => {
                const Icon = item.icon;
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
                        className={`group relative block p-6 rounded-2xl border ${item.borderColor} bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] overflow-hidden`}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <HoverParticles isHovered={isHovered} color={item.particleColor} />
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                          style={{ boxShadow: `inset 0 0 60px ${item.glowColor}` }}
                        />
                        <div className="relative flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-white/5 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-xl text-white group-hover:text-[#c9a962] transition-colors">{item.title}</h3>
                              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                            </div>
                            <p className="text-white/40 text-sm mb-2">{item.subtitle}</p>
                            <p className="text-white/60 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className={`group relative block p-6 rounded-2xl border ${item.borderColor} bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] overflow-hidden`}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <HoverParticles isHovered={isHovered} color={item.particleColor} />
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                          style={{ boxShadow: `inset 0 0 60px ${item.glowColor}` }}
                        />
                        <div className="relative flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-white/5 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display text-xl text-white group-hover:text-[#c9a962] transition-colors mb-1">{item.title}</h3>
                            <p className="text-white/40 text-sm mb-2">{item.subtitle}</p>
                            <p className="text-white/60 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <p className="text-white/30 text-sm mt-8">
              此刻的你，已在途中。
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
      `}</style>
    </div>
  );
}
