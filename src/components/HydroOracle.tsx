import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Zap } from 'lucide-react';

export function HydroOracle() {
  const [fortune, setFortune] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const fortunes = [
    "Your future is clear... like distilled water.",
    "A tall glass of water is in your immediate future. Drink it.",
    "You are currently 70.4% awesome and 29.6% thirsty. Fix the ratio.",
    "The ocean called. It wants its vibe back. Stay hydrated.",
    "Your hydration aura is glowing neon blue today.",
    "I see a drout in your cells. Deploy liquid immediately!",
    "You're not grumpy, you're just a slightly dried-out human.",
    "Success flows to those who are properly saturated.",
    "Warning: Low water levels detected. Personality may become 'salty'.",
    "You're basically a more complex cucumber. Keep watering yourself.",
    "Hydration is the only thing standing between you and a headache. Choice is yours.",
    "I see... a refill in your future. Don't fight destiny.",
    "If you were a plant, you'd be wilting right now. Go drink.",
    "Your brain is 80% water. Right now it's trying to run on 2%.",
    "Drinking water is the easiest way to feel like you've got your life together.",
    "You're not tired, you're just a battery running low on electrolyte juice.",
    "The AI predicts a 100% chance of you drinking water in the next 5 minutes.",
    "Water is the best debugger for your morning brain."
  ];

  const getNewFortune = () => {
    setIsSpinning(true);
    setFortune(null);
    
    // Play funny sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.play().catch(() => {});

    setTimeout(() => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setFortune(randomFortune);
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="glass rounded-[2.5rem] p-8 space-y-6 border border-white/5 relative overflow-hidden group bg-gradient-to-br from-indigo-500/10 to-blue-500/10">
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Mystic Terminal</span>
          <MessageSquare size={14} className="text-indigo-400" />
        </div>
        
        <h4 className="text-2xl font-black text-white italic">THE HYDRO ORACLE</h4>
        
        <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div 
              animate={isSpinning ? { rotate: 360, scale: [1, 1.2, 1] } : { y: [0, -5, 0] }}
              transition={isSpinning ? { duration: 0.5, repeat: Infinity, ease: "linear" } : { duration: 3, repeat: Infinity }}
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(99,102,241,0.3)] ${isSpinning ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/10 bg-white/5'}`}
            >
              {isSpinning ? <Zap className="text-indigo-400 animate-pulse" /> : "🔮"}
            </motion.div>
            
            {/* Ambient Glow */}
            <div className={`absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl transition-opacity duration-1000 ${isSpinning ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        <AnimatePresence mode="wait">
          {fortune ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl"
            >
              <p className="text-sm font-medium text-white italic leading-relaxed">
                "{fortune}"
              </p>
            </motion.div>
          ) : (
             <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
               {isSpinning ? 'Consulting the Tides...' : 'Seek Liquid Wisdom'}
             </p>
          )}
        </AnimatePresence>

        <button 
          onClick={getNewFortune}
          disabled={isSpinning}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
        >
          {fortune ? 'Ask Again' : 'Consult Oracle'}
        </button>
      </div>

      {/* Decorative Spheres */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
    </div>
  );
}
