import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { TypewriterText } from "@/components/TypewriterText";
import { PageLoadingSkeleton } from "@/components/public/PageLoadingSkeleton";
import { useSEO } from "@/hooks/useSEO";
import { Sparkles, Moon, Compass, User, ExternalLink, SkipForward, RotateCcw, Volume2, VolumeX } from "lucide-react";

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
  | 'intro1' | 'intro2' | 'intro3'
  | 'thinking-title'
  | 'thinking-card1' | 'thinking-card2' | 'thinking-card3' | 'thinking-card4'
  | 'language-title'
  | 'language-do' | 'language-dont'
  | 'portal-fly'
  | 'final-greeting';

// Epic/Mysterious ambient music generator using Web Audio API
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
    
    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create reverb using delay network
    const createReverb = () => {
      const convolver = ctx.createConvolver();
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.3;
      
      // Create impulse response for reverb
      const sampleRate = ctx.sampleRate;
      const length = sampleRate * 3;
      const impulse = ctx.createBuffer(2, length, sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
        }
      }
      convolver.buffer = impulse;
      convolver.connect(reverbGain);
      reverbGain.connect(masterGain);
      return convolver;
    };

    const reverb = createReverb();
    nodes.push(reverb);

    // Deep sub-bass drone (mysterious rumble)
    const createSubBass = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = 32.7; // C1 - very deep
      
      filter.type = 'lowpass';
      filter.frequency.value = 80;
      filter.Q.value = 2;
      
      // Slow pulsing
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08;
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      nodes.push(lfo);
      
      gain.gain.value = 0.25;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      nodes.push(osc);
    };

    // String pad layers (epic/cinematic feel)
    const createStringPad = () => {
      const notes = [65.41, 98.00, 130.81, 164.81, 196.00]; // C2, G2, C3, E3, G3 (Cmaj)
      
      notes.forEach((freq, i) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        // Detuned oscillators for richness
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.value = freq;
        osc2.frequency.value = freq * 1.003; // Slight detune
        
        filter.type = 'lowpass';
        filter.frequency.value = 800 + i * 100;
        filter.Q.value = 1;
        
        // Slow filter sweep for movement
        const filterLfo = ctx.createOscillator();
        const filterLfoGain = ctx.createGain();
        filterLfo.frequency.value = 0.05 + Math.random() * 0.03;
        filterLfoGain.gain.value = 400;
        filterLfo.connect(filterLfoGain);
        filterLfoGain.connect(filter.frequency);
        filterLfo.start();
        nodes.push(filterLfo);
        
        gain.gain.value = 0.04 / (i + 1);
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        gain.connect(reverb);
        
        osc1.start();
        osc2.start();
        nodes.push(osc1, osc2);
      });
    };

    // High shimmer/sparkle layer (mysterious)
    const createShimmer = () => {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        filter.type = 'bandpass';
        filter.frequency.value = freq;
        filter.Q.value = 5;
        
        // Random amplitude modulation for twinkling
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.3 + Math.random() * 0.5;
        lfoGain.gain.value = 0.015;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        nodes.push(lfo);
        
        gain.gain.value = 0.02;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(reverb);
        
        osc.start();
        nodes.push(osc);
      });
    };

    // Epic brass-like drone
    const createBrassDrone = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.value = 130.81; // C3
      
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      filter.Q.value = 3;
      
      // Slow crescendo/decrescendo
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.02;
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      nodes.push(lfo);
      
      gain.gain.value = 0.05;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      gain.connect(reverb);
      
      osc.start();
      nodes.push(osc);
    };

    // Random bell/chime hits (mysterious accents)
    const createRandomChimes = () => {
      const chimeNotes = [1046.5, 1318.5, 1568.0, 2093.0, 2637.0]; // High C, E, G
      
      const playChime = () => {
        const freq = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq * (0.98 + Math.random() * 0.04);
        
        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
        
        osc.connect(gain);
        gain.connect(reverb);
        
        osc.start();
        osc.stop(ctx.currentTime + 3.5);
      };
      
      // Play chimes at random intervals
      const scheduleChime = () => {
        playChime();
        const nextDelay = 3000 + Math.random() * 5000;
        const timeout = window.setTimeout(scheduleChime, nextDelay);
        intervalsRef.current.push(timeout);
      };
      
      const initialDelay = window.setTimeout(scheduleChime, 2000);
      intervalsRef.current.push(initialDelay);
    };

    // Initialize all layers
    createSubBass();
    createStringPad();
    createShimmer();
    createBrassDrone();
    createRandomChimes();

    nodesRef.current = nodes;

    // Slow fade in for epic entrance
    masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 4);
    setIsPlaying(true);
  }, []);

  const stopMusic = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 2);
      
      // Clear all intervals
      intervalsRef.current.forEach(id => clearTimeout(id));
      intervalsRef.current = [];
      
      setTimeout(() => {
        nodesRef.current.forEach(node => {
          try { 
            if (node instanceof OscillatorNode) node.stop(); 
          } catch (e) {}
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
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(id => clearTimeout(id));
      nodesRef.current.forEach(node => {
        try { 
          if (node instanceof OscillatorNode) node.stop(); 
        } catch (e) {}
      });
      audioContextRef.current?.close();
    };
  }, []);

  return { isPlaying, startMusic, stopMusic, toggleMusic };
}

// Floating particle component
function FloatingParticles() {
  const particles = useRef(
    [...Array(50)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.4,
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

// Energy waves
function EnergyWaves({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[#c9a962]"
          style={{
            width: 100 + i * 150,
            height: 100 + i * 150,
            opacity: 0.3 - i * 0.05,
            animation: `ripple 3s ease-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Lightning bolt component
function LightningBolts({ active }: { active: boolean }) {
  const bolts = useRef(
    [...Array(6)].map(() => ({
      x: 10 + Math.random() * 80,
      rotation: -30 + Math.random() * 60,
      delay: Math.random() * 3,
      duration: 0.15 + Math.random() * 0.1,
      scale: 0.5 + Math.random() * 0.8,
    }))
  ).current;

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bolts.map((bolt, i) => (
        <svg
          key={i}
          className="absolute"
          style={{
            left: `${bolt.x}%`,
            top: '-10%',
            width: 60 * bolt.scale,
            height: 300 * bolt.scale,
            transform: `rotate(${bolt.rotation}deg)`,
            animation: `lightning ${bolt.duration}s ease-out ${bolt.delay}s infinite`,
            opacity: 0,
          }}
          viewBox="0 0 60 300"
        >
          <path
            d="M30 0 L35 80 L50 85 L25 160 L40 165 L20 250 L35 170 L20 165 L40 90 L25 85 Z"
            fill="url(#lightning-gradient)"
            filter="url(#lightning-glow)"
          />
          <defs>
            <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="50%" stopColor="#c9a962" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="lightning-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      ))}
    </div>
  );
}

// Shooting stars / meteors
function ShootingStars() {
  const stars = useRef(
    [...Array(8)].map(() => ({
      startX: Math.random() * 100,
      startY: Math.random() * 30,
      angle: 20 + Math.random() * 40,
      duration: 1 + Math.random() * 1.5,
      delay: Math.random() * 8,
      length: 80 + Math.random() * 120,
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
            boxShadow: '0 0 10px #c9a962, 0 0 20px #c9a962',
          }}
        />
      ))}
    </div>
  );
}

// Star burst explosion
function StarBurst({ active, intensity = 1 }: { active: boolean; intensity?: number }) {
  const particles = useRef(
    [...Array(Math.floor(40 * intensity))].map(() => ({
      angle: Math.random() * 360,
      distance: 100 + Math.random() * 300,
      size: 2 + Math.random() * 4,
      duration: 0.8 + Math.random() * 0.6,
      delay: Math.random() * 0.3,
      color: Math.random() > 0.5 ? '#c9a962' : '#fff',
    }))
  ).current;

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: active ? `starBurst ${p.duration}s ease-out ${p.delay}s forwards` : 'none',
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Electric arcs
function ElectricArcs({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <svg
          key={i}
          className="absolute"
          style={{
            width: 400,
            height: 400,
            animation: `electricArc 2s ease-in-out ${i * 0.5}s infinite`,
            transform: `rotate(${i * 90}deg)`,
          }}
          viewBox="0 0 400 400"
        >
          <path
            d="M200 200 Q220 150 250 180 Q280 120 300 160 Q340 100 360 140"
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#arc-glow)"
            style={{ animation: `arcPath 0.5s ease-in-out ${i * 0.1}s infinite alternate` }}
          />
          <defs>
            <linearGradient id="arc-gradient">
              <stop offset="0%" stopColor="#c9a962" stopOpacity="0" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="100%" stopColor="#c9a962" stopOpacity="0" />
            </linearGradient>
            <filter id="arc-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      ))}
    </div>
  );
}

// Cosmic dust swirl
function CosmicDust() {
  const dust = useRef(
    [...Array(100)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      orbitRadius: 100 + Math.random() * 400,
      duration: 20 + Math.random() * 40,
      delay: Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3,
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
            '--start-angle': `${Math.random() * 360}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Glowing orbs
function GlowingOrbs({ active }: { active: boolean }) {
  const orbs = [
    { x: 20, y: 30, size: 80, color: 'rgba(201, 169, 98, 0.3)', delay: 0 },
    { x: 80, y: 20, size: 60, color: 'rgba(168, 85, 247, 0.25)', delay: 1 },
    { x: 70, y: 70, size: 100, color: 'rgba(245, 158, 11, 0.2)', delay: 2 },
    { x: 30, y: 80, size: 70, color: 'rgba(52, 211, 153, 0.25)', delay: 0.5 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
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
            animation: `orbFloat 8s ease-in-out ${orb.delay}s infinite, orbPulse 4s ease-in-out ${orb.delay}s infinite`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

// Central light pillar
function LightPillar({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute w-2 h-[150vh]"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(201,169,98,0.4), rgba(255,255,255,0.6), rgba(201,169,98,0.4), transparent)',
          filter: 'blur(8px)',
          animation: 'pillarPulse 2s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute w-px h-[150vh]"
        style={{
          background: 'linear-gradient(to bottom, transparent, #fff, transparent)',
          filter: 'blur(1px)',
        }}
      />
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

export default function PortalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<AnimationStage>('loading');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([false, false, false, false]);
  const [showFinalGreeting, setShowFinalGreeting] = useState(false);
  const { isPlaying, startMusic, toggleMusic } = useAmbientMusic();
  const hasStartedMusic = useRef(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setStage('greeting1');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const advanceStage = useCallback(() => {
    setStage(prev => {
      const stages: AnimationStage[] = [
        'loading', 'greeting1', 'greeting2', 'greeting3', 'greeting4',
        'tagline', 'title', 'intro1', 'intro2', 'intro3',
        'thinking-title', 'thinking-card1', 'thinking-card2', 'thinking-card3', 'thinking-card4',
        'language-title', 'language-do', 'language-dont',
        'portal-fly', 'final-greeting'
      ];
      const currentIndex = stages.indexOf(prev);
      if (currentIndex < stages.length - 1) {
        return stages[currentIndex + 1];
      }
      return prev;
    });
  }, []);

  const skipToEnd = useCallback(() => {
    setStage('portal-fly');
    portalItems.forEach((_, index) => {
      setTimeout(() => {
        setCardsVisible(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 80);
    });
    setTimeout(() => {
      setStage('final-greeting');
      setShowFinalGreeting(true);
    }, 500);
  }, []);

  const replay = useCallback(() => {
    setCardsVisible([false, false, false, false]);
    setShowFinalGreeting(false);
    setStage('greeting1');
  }, []);

  // Slower, more cohesive timing for each stage
  useEffect(() => {
    const timings: Partial<Record<AnimationStage, number>> = {
      'tagline': 2500,
      'title': 4000,
      'intro1': 3500,
      'intro2': 3500,
      'intro3': 4000,
      'thinking-title': 2500,
      'thinking-card1': 3500,
      'thinking-card2': 3500,
      'thinking-card3': 3500,
      'thinking-card4': 3500,
      'language-title': 2000,
      'language-do': 3000,
      'language-dont': 3000,
    };

    const delay = timings[stage];
    if (delay) {
      const timer = setTimeout(advanceStage, delay);
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
        }, index * 100);
      });
      const timer = setTimeout(() => {
        setStage('final-greeting');
        setShowFinalGreeting(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [stage, advanceStage]);

  const stageIndex = (s: AnimationStage) => {
    const stages: AnimationStage[] = [
      'loading', 'greeting1', 'greeting2', 'greeting3', 'greeting4',
      'tagline', 'title', 'intro1', 'intro2', 'intro3',
      'thinking-title', 'thinking-card1', 'thinking-card2', 'thinking-card3', 'thinking-card4',
      'language-title', 'language-do', 'language-dont',
      'portal-fly', 'final-greeting'
    ];
    return stages.indexOf(s);
  };

  const isAt = (s: AnimationStage) => stage === s;
  const isAtOrPast = (s: AnimationStage) => stageIndex(stage) >= stageIndex(s);
  const isBetween = (start: AnimationStage, end: AnimationStage) => 
    stageIndex(stage) >= stageIndex(start) && stageIndex(stage) <= stageIndex(end);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  // Check if we're in the intro animation phase
  const isInIntro = !isAtOrPast('portal-fly');

  return (
    <div className="min-h-screen h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a0a0a_0%,#050505_100%)]" />
        
        {/* Dynamic nebula */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-[#c9a962]/5 blur-[200px]"
            style={{ animation: 'breathe 6s ease-in-out infinite' }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px]"
            style={{ animation: 'breathe 8s ease-in-out 2s infinite' }} />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px]"
            style={{ animation: 'breathe 7s ease-in-out 1s infinite' }} />
        </div>

        <FloatingParticles />
        <CosmicDust />
        <ShootingStars />
        <GlowingOrbs active={isInIntro} />
        <LightningBolts active={isBetween('title', 'thinking-card4')} />
        <ElectricArcs active={isBetween('thinking-title', 'thinking-card4')} />
        <EnergyWaves active={isBetween('title', 'intro3')} />
        <StarBurst active={isAt('title')} intensity={1.5} />
        <LightPillar active={isAt('title') || isAt('tagline')} />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Control buttons */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {/* Music toggle */}
        <button
          onClick={toggleMusic}
          className="group flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Skip button */}
        {isInIntro && (
          <button
            onClick={skipToEnd}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-full text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            <span className="text-sm">跳過</span>
            <SkipForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
        
        {/* Replay button */}
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

      {/* Main content - fixed center, content replaces instead of stacking */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        
        {/* Intro Animation - Single screen, replacing content */}
        {isInIntro && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="text-center max-w-3xl px-6">
              
              {/* Greetings - one at a time */}
              {isBetween('greeting1', 'greeting4') && (
                <div className="relative">
                  {/* Glow burst */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[400px] h-[400px] rounded-full bg-[#c9a962]/20 blur-[100px] animate-pulse" />
                  </div>
                  
                  <div className="relative font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-white"
                    style={{ textShadow: '0 0 80px rgba(201,169,98,0.8), 0 0 160px rgba(201,169,98,0.4)' }}>
                    {isAt('greeting1') && (
                      <TypewriterText text="你來了…" speed={380} delay={800} onComplete={advanceStage} />
                    )}
                    {isAt('greeting2') && (
                      <TypewriterText text="這裡是一面鏡子。" speed={320} delay={600} onComplete={advanceStage} />
                    )}
                    {isAt('greeting3') && (
                      <TypewriterText text="不給答案，只給倒影。" speed={320} delay={600} onComplete={advanceStage} />
                    )}
                    {isAt('greeting4') && (
                      <TypewriterText text="你要往哪裡照見自己…" speed={320} delay={600} onComplete={advanceStage} />
                    )}
                  </div>
                </div>
              )}

              {/* Tagline */}
              {isAt('tagline') && (
                <div className="animate-zoomIn">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />
                    <div className="text-[#c9a962] text-xl md:text-2xl tracking-[0.4em] font-light">
                      照見・回望・前行
                    </div>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />
                  </div>
                </div>
              )}

              {/* Title */}
              {isAt('title') && (
                <div className="space-y-6 animate-zoomIn">
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide">
                    <span className="relative inline-block">
                      <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-[#c9a962] via-amber-400 to-[#c9a962] opacity-60" />
                      <span className="relative bg-gradient-to-r from-[#c9a962] via-amber-300 to-[#c9a962] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradientFlow">
                        MomoChao
                      </span>
                    </span>
                    <span className="text-white/60"> — </span>
                    <span className="text-white">The Guardian of Mirrors</span>
                  </h1>
                  <p className="text-white/70 text-xl md:text-2xl font-light italic">
                    「我們不預測未來，只幫你看清現在。」
                  </p>
                </div>
              )}

              {/* Intro paragraphs - one at a time */}
              {isBetween('intro1', 'intro3') && (
                <div className="space-y-2 text-white/80 text-xl md:text-2xl leading-relaxed font-light animate-fadeSlide">
                  {isAt('intro1') && (
                    <p>默默超不是一個人名，<br />而是一種思維方式的代稱。</p>
                  )}
                  {isAt('intro2') && (
                    <p>不急著評判，不急著給答案，<br />而是先安靜地看見。</p>
                  )}
                  {isAt('intro3') && (
                    <p>「默默」是方法，「超」是目標。<br />
                      <span className="text-[#c9a962]">在沉默中觀察，在理解中超越。</span>
                    </p>
                  )}
                </div>
              )}

              {/* Thinking system title */}
              {isAt('thinking-title') && (
                <div className="animate-zoomIn space-y-3">
                  <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">默默超思維</h2>
                  <p className="text-[#c9a962] text-lg tracking-wider">一套改變世界的文明級生活方法</p>
                </div>
              )}

              {/* Thinking cards - one at a time */}
              {isBetween('thinking-card1', 'thinking-card4') && (
                <div className="animate-cardFlip">
                  {isAt('thinking-card1') && (
                    <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/30 rounded-2xl p-8 max-w-md mx-auto">
                      <h3 className="text-[#c9a962] text-2xl font-display mb-4">{thinkingConcepts[0].title}</h3>
                      <p className="text-white/70 whitespace-pre-line">{thinkingConcepts[0].description}</p>
                    </div>
                  )}
                  {isAt('thinking-card2') && (
                    <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/30 rounded-2xl p-8 max-w-md mx-auto">
                      <h3 className="text-[#c9a962] text-2xl font-display mb-4">{thinkingConcepts[1].title}</h3>
                      <p className="text-white/70 whitespace-pre-line">{thinkingConcepts[1].description}</p>
                    </div>
                  )}
                  {isAt('thinking-card3') && (
                    <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/30 rounded-2xl p-8 max-w-md mx-auto">
                      <h3 className="text-[#c9a962] text-2xl font-display mb-4">{thinkingConcepts[2].title}</h3>
                      <p className="text-white/70 whitespace-pre-line">{thinkingConcepts[2].description}</p>
                    </div>
                  )}
                  {isAt('thinking-card4') && (
                    <div className="bg-white/5 backdrop-blur-sm border border-[#c9a962]/30 rounded-2xl p-8 max-w-md mx-auto">
                      <h3 className="text-[#c9a962] text-2xl font-display mb-4">{thinkingConcepts[3].title}</h3>
                      <p className="text-white/70 whitespace-pre-line">{thinkingConcepts[3].description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Language style */}
              {isAt('language-title') && (
                <div className="animate-zoomIn">
                  <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">語言風格</h2>
                </div>
              )}

              {isAt('language-do') && (
                <div className="animate-slideInLeft space-y-4">
                  <h3 className="text-emerald-400 text-xl">我們這樣說</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {weDoSay.map((word, i) => (
                      <span 
                        key={word} 
                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300"
                        style={{ animation: `popIn 0.3s ease-out ${i * 0.05}s forwards`, opacity: 0 }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isAt('language-dont') && (
                <div className="animate-slideInRight space-y-4">
                  <h3 className="text-rose-400 text-xl">我們不這樣說</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {weDontSay.map((word, i) => (
                      <span 
                        key={word} 
                        className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-300 line-through decoration-rose-400/50"
                        style={{ animation: `popIn 0.3s ease-out ${i * 0.05}s forwards`, opacity: 0 }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Portal Cards - Final state */}
        {isAtOrPast('portal-fly') && (
          <div className="fixed inset-0 flex flex-col items-center justify-center px-4">
            {/* Final greeting */}
            {showFinalGreeting && (
              <div className="text-center mb-8 animate-fadeSlide">
                <div className="font-display text-2xl md:text-3xl text-white mb-2"
                  style={{ textShadow: '0 0 40px rgba(201,169,98,0.5)' }}>
                  <TypewriterText text="你好！我是默默超！" speed={320} delay={800} />
                </div>
                <p className="text-white/60 text-lg">想從哪裡開始呢？</p>
              </div>
            )}

            {/* Portal cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl w-full">
              {portalItems.map((item, index) => {
                const Icon = item.icon;
                const isHovered = hoveredCard === index;
                const isVisible = cardsVisible[index];
                const fromLeft = index % 2 === 0;

                return (
                  <div
                    key={item.title}
                    className={`transition-all duration-500 ${
                      isVisible 
                        ? 'opacity-100 translate-x-0 translate-y-0' 
                        : fromLeft 
                          ? 'opacity-0 -translate-x-20' 
                          : 'opacity-0 translate-x-20'
                    }`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
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
                        
                        {/* Glow effect */}
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
            {showFinalGreeting && (
              <p className="text-white/30 text-sm mt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
                此刻的你，已在途中。
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: var(--opacity, 0.3); }
          25% { transform: translate(20px, -30px) scale(1.2); }
          50% { transform: translate(-10px, -50px) scale(0.8); opacity: calc(var(--opacity, 0.3) * 1.5); }
          75% { transform: translate(-30px, -20px) scale(1.1); }
        }
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFlip {
          from { opacity: 0; transform: perspective(1000px) rotateX(-30deg) translateY(40px); }
          to { opacity: 1; transform: perspective(1000px) rotateX(0) translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lightning {
          0%, 100% { opacity: 0; }
          5% { opacity: 1; }
          10% { opacity: 0.3; }
          15% { opacity: 0.9; }
          20% { opacity: 0; }
        }
        @keyframes shootingStar {
          0% { opacity: 0; transform: rotate(var(--angle, 30deg)) translateX(-100px); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--angle, 30deg)) translateX(500px); }
        }
        @keyframes starBurst {
          0% { 
            opacity: 1; 
            transform: rotate(var(--angle, 0deg)) translateX(0) scale(1);
          }
          100% { 
            opacity: 0; 
            transform: rotate(var(--angle, 0deg)) translateX(var(--distance, 200px)) scale(0);
          }
        }
        @keyframes electricArc {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes arcPath {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes cosmicOrbit {
          from { 
            transform: rotate(var(--start-angle, 0deg)) translateX(var(--orbit-radius, 200px)) rotate(calc(-1 * var(--start-angle, 0deg)));
          }
          to { 
            transform: rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--orbit-radius, 200px)) rotate(calc(-1 * (var(--start-angle, 0deg) + 360deg)));
          }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          25% { transform: translate(-50%, -50%) translate(30px, -20px); }
          50% { transform: translate(-50%, -50%) translate(-20px, 30px); }
          75% { transform: translate(-50%, -50%) translate(-30px, -10px); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pillarPulse {
          0%, 100% { opacity: 0.5; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.5); }
        }
        .animate-zoomIn { animation: zoomIn 0.5s ease-out forwards; }
        .animate-fadeSlide { animation: fadeSlide 0.6s ease-out forwards; }
        .animate-cardFlip { animation: cardFlip 0.6s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
        .animate-gradientFlow { animation: gradientFlow 3s linear infinite; }
      `}</style>
    </div>
  );
}
