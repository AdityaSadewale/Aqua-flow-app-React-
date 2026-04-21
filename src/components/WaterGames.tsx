import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Trophy, User } from 'lucide-react';

interface WaterGameProps {
  onEarnXP?: (xp: number) => void;
}

export function WaterGame({ onEarnXP }: WaterGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('aquaflow_game_high')) || 0);
  const [lifetimeScore, setLifetimeScore] = useState(() => Number(localStorage.getItem('aquaflow_game_lifetime')) || 0);
  const [isHydroSurgeUnlocked, setIsHydroSurgeUnlocked] = useState(() => Number(localStorage.getItem('aquaflow_game_lifetime')) >= 1000);
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [combo, setCombo] = useState(1);
  const [lastCatchTime, setLastCatchTime] = useState(0);

  // Refs for stable game state
  const raindropsRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);
  const bucketRef = useRef({ x: 0, w: 70, h: 45 });
  const gameLoopRef = useRef<number>(0);
  const comboRef = useRef(1);
  const lastCatchRef = useRef(0);
  const surgeActiveRef = useRef(false);

  // Sync ref with state for use in loop
  useEffect(() => {
    surgeActiveRef.current = isSurgeActive;
  }, [isSurgeActive]);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const raindrops = raindropsRef.current;
    const particles = particlesRef.current;
    const bucket = bucketRef.current;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 400;
      if (bucket.x === 0) bucket.x = canvas.width / 2;
    };
    handleResize();

    const createParticles = (x: number, y: number, color: string) => {
      // Funny catch sound
      if (Math.random() < 0.1) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }

      for (let i = 0; i < 10; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          size: Math.random() * 4 + 2,
          color
        });
      }
    };

    const spawnRaindrop = () => {
      const isGolden = Math.random() < 0.05 && isHydroSurgeUnlocked;
      raindrops.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -30,
        r: Math.random() * 5 + 5,
        speed: (Math.random() * 2 + 3) * (surgeActiveRef.current ? 1.6 : 1),
        isGolden
      });
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Surge Effect
      if (surgeActiveRef.current) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dynamic scanlines
        ctx.fillStyle = 'rgba(34, 211, 238, 0.05)';
        for (let i = 0; i < canvas.height; i += 4) {
          const offset = (Date.now() / 10) % 4;
          ctx.fillRect(0, i + offset, canvas.width, 1);
        }
      }

      // Draw Bucket with Glow
      ctx.shadowBlur = surgeActiveRef.current ? 25 : 15;
      ctx.shadowColor = surgeActiveRef.current ? '#22d3ee' : '#3b82f6';
      ctx.fillStyle = surgeActiveRef.current ? '#22d3ee' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(bucket.x - bucket.w / 2, canvas.height - bucket.h - 10, bucket.w, bucket.h, 16);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Drops
      for (let i = raindrops.length - 1; i >= 0; i--) {
        const drop = raindrops[i];
        drop.y += drop.speed;
        
        ctx.fillStyle = drop.isGolden ? '#facc15' : (surgeActiveRef.current ? '#22d3ee' : '#3b82f6');
        ctx.beginPath();
        if (drop.isGolden) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#facc15';
        }
        ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Catch check
        if (
          drop.y + drop.r > canvas.height - bucket.h - 10 &&
          drop.y - drop.r < canvas.height - 10 &&
          drop.x > bucket.x - (bucket.w / 2 + 10) &&
          drop.x < bucket.x + (bucket.w / 2 + 10)
        ) {
          const currentTime = Date.now();
          const basePoints = drop.isGolden ? 50 : 10;
          
          // Update combo ref and state
          if (currentTime - lastCatchRef.current < 1200) {
            comboRef.current = Math.min(comboRef.current + 0.1, 5);
          } else {
            comboRef.current = 1;
          }
          lastCatchRef.current = currentTime;
          
          const points = Math.floor(basePoints * comboRef.current);
          setScore(s => s + points);
          setCombo(comboRef.current);
          setLastCatchTime(currentTime);
          
          // Emit XP to the global profile
          if (onEarnXP) {
            onEarnXP(Math.floor(points / 2));
          }

          createParticles(drop.x, drop.y, ctx.fillStyle as string);
          raindrops.splice(i, 1);
        } else if (drop.y > canvas.height + 20) {
          raindrops.splice(i, 1);
          comboRef.current = 1;
          setCombo(1);
        }
      }

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.life -= 0.03;
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      const spawnChance = surgeActiveRef.current ? 0.15 : 0.08;
      if (Math.random() < spawnChance) spawnRaindrop();

      gameLoopRef.current = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      bucket.x = Math.max(bucket.w / 2, Math.min(canvas.width - bucket.w / 2, targetX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const targetX = touch.clientX - rect.left;
      bucket.x = Math.max(bucket.w / 2, Math.min(canvas.width - bucket.w / 2, targetX));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    gameLoopRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying, isHydroSurgeUnlocked]);

  const startGame = () => {
    raindropsRef.current = [];
    particlesRef.current = [];
    comboRef.current = 1;
    lastCatchRef.current = 0;
    bucketRef.current = { x: 0, w: 70, h: 45 };
    setIsPlaying(true);
    setScore(0);
    setCombo(1);
    setIsSurgeActive(false);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setIsSurgeActive(false);
    
    // Update Lifetime Score
    const newLifetime = lifetimeScore + score;
    setLifetimeScore(newLifetime);
    localStorage.setItem('aquaflow_game_lifetime', newLifetime.toString());

    if (newLifetime >= 1000 && !isHydroSurgeUnlocked) {
      setIsHydroSurgeUnlocked(true);
    }

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('aquaflow_game_high', score.toString());
    }
  };

  const toggleSurge = () => {
    if (isHydroSurgeUnlocked) {
      setIsSurgeActive(!isSurgeActive);
    }
  };

  const unlockProgress = Math.min((lifetimeScore / 1000) * 100, 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Immersive Header */}
      <div className={`glass rounded-[3rem] p-12 text-center text-white relative overflow-hidden transition-all duration-700 ${isSurgeActive ? 'bg-cyan-900 border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]' : 'bg-gradient-to-br from-blue-700 to-indigo-900 border-white/10 shadow-2xl shadow-blue-500/20'}`}>
        
        {/* Animated Background Gradients */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isSurgeActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(34,211,238,0.15)_100%)] animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 block mb-2">Aquatic Terminal</span>
              <h2 className="text-5xl font-black tracking-tighter italic leading-none">HYDRO <br/>RESONATOR</h2>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5">
                <div className="text-right">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Multiplier</p>
                  <p className="text-xl font-black text-white leading-none">x{combo.toFixed(1)}</p>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="text-right">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Score</p>
                  <p className="text-xl font-black text-white leading-none">{score}</p>
                </div>
              </div>
              
              {isHydroSurgeUnlocked && (
                <button 
                  onClick={toggleSurge}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSurgeActive ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-white/50 hover:text-white'}`}
                >
                  {isSurgeActive ? 'SURGE ACTIVE' : 'UNLEASH SURGE'}
                </button>
              )}
            </div>
          </div>

          <div className="relative rounded-[3rem] bg-black/40 w-full h-[450px] flex items-center justify-center overflow-hidden border border-white/5 shadow-2xl group cursor-crosshair">
            {!isPlaying ? (
              <div className="text-center space-y-6">
                <button 
                  onClick={startGame}
                  className="w-28 h-28 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-110 hover:rotate-12 active:scale-95 transition-all group-hover:bg-white"
                >
                  <Play size={44} className="translate-x-1" fill="currentColor" />
                </button>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Ignite Resonator</p>
              </div>
            ) : (
              <canvas 
                ref={canvasRef} 
                className="w-full h-full block touch-none"
              />
            )}
            
            {isPlaying && (
              <button 
                onClick={stopGame}
                className="absolute top-6 left-6 px-4 py-2 rounded-xl glass-dark flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
              >
                <RotateCcw size={14} />
                Terminate
              </button>
            )}
          </div>
        </div>
        
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 space-y-8 border border-white/5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em] mb-2">Vault Experience</p>
              <h4 className="text-3xl font-black text-white">LIFETIME XP</h4>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white leading-none">{lifetimeScore}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Points Earned</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
              <span className="text-white/40">Surge Mode Unlock</span>
              <span className="text-blue-400">{isHydroSurgeUnlocked ? 'COMPLETED' : `${1000 - lifetimeScore} XP REMAINING`}</span>
            </div>
            <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${unlockProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Rank</p>
              <p className="text-xl font-black text-blue-400">#412 OF SUSTAIN</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Personal Best</p>
              <p className="text-xl font-black text-white">{highScore}</p>
            </div>
          </div>
        </div>

        {/* Milestone Card */}
        <div className="glass rounded-[2.5rem] p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden bg-white/5 group">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Trophy size={32} />
            </div>
            <div>
              <h5 className="text-xl font-black text-white uppercase tracking-tight">Milestones</h5>
              <p className="text-sm text-white/40 font-medium leading-relaxed mt-2 italic">Each drop collected fuels the community's sustainable future. Reach 1000 XP to ignite the Surge Mode.</p>
            </div>
          </div>
          <button className="relative z-10 w-full py-4 glass hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            Leaderboard Access
          </button>
          
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
