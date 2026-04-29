import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Flame, Clock, Quote, Sparkles, LogOut, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, DailyTask } from '../types';
import { HydrationCompanion } from './HydrationCompanion';
import { HydroOracle } from './HydroOracle';

interface DashboardProps {
  intake: number;
  goal: number;
  onAddLog: (amount: number) => void;
  tasks: DailyTask[];
  onToggleTask: (id: number) => void;
  exportData: () => void;
  currentDay: number;
  streak: number;
  level: number;
  xp: number;
  badges: string[];
  lastLogTime: number;
}

export function Dashboard({ intake, goal, onAddLog, tasks, onToggleTask, exportData, currentDay, streak, level, xp, badges, lastLogTime }: DashboardProps) {
  const percentage = goal > 0 ? Math.min(Math.round((intake / goal) * 100), 100) : 0;
  const [isCelebrated, setIsCelebrated] = useState(false);

  const getHydrationGrade = (p: number) => {
    if (p >= 100) return { label: 'S-TIER HYDRO GOD', color: 'text-cyan-400 blush-glow' };
    if (p >= 80) return { label: 'A-TIER OASIS', color: 'text-blue-400' };
    if (p >= 50) return { label: 'B-TIER PUDDLE', color: 'text-blue-300' };
    if (p >= 20) return { label: 'C-TIER DESERT WANDERER', color: 'text-orange-400' };
    return { label: 'D-TIER DRY RAISIN', color: 'text-red-500 animate-pulse' };
  };

  const grade = getHydrationGrade(percentage);

  // Calculate past 30 days progress for the matrix
  const matrixData = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.setHours(0, 0, 0, 0);
    
    // Check if user reached goal on that day (this is simplified as we don't have daily goals stored historically)
    // For now, we check if there are logs for that day
    // Wait, useHydration returns all logs.
    return {
      day: i + 1,
      isFilled: i + 1 < currentDay,
      isToday: i + 1 === currentDay,
      date: dateStr
    };
  });

  // Play funny sounds
  const playSlurp = () => {
    const audios = [
      'https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3', // Bubble
      'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'  // Swish
    ];
    const audio = new Audio(audios[Math.floor(Math.random() * audios.length)]);
    audio.play().catch(() => {});
  };

  const handleAddWater = () => {
    onAddLog(250);
    playSlurp();
    if (intake + 250 >= goal && !isCelebrated) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#ffffff']
      });
      setIsCelebrated(true);
    }
  };

   const quotes = [
    "Water is life's mater and matrix, mother and medium.",
    "Health is the real wealth, hydration is the key.",
    "Drink water, feel better, stay focused.",
    "A glass of water a day keeps the brain fog away.",
    "You're not grumpy, you're just a slightly dried-out human.",
    "Hydration is the only thing standing between you and a headache.",
    "The AI thinks you look thirsty. Don't prove it right.",
  ];

   const milestoneBadges = [
    { title: 'Spring Novice', icon: '🌱', level: 1 },
    { title: 'River Runner', icon: '🌊', level: 3 },
    { title: 'Ocean Deep', icon: '🔱', level: 5 },
    { title: 'Rain Master', icon: '⛈️', level: 7 },
  ];

  return (
    <div className={`space-y-10 transition-all duration-1000 ${percentage < 20 ? 'grayscale brightness-[0.7] sepia-[0.3]' : ''}`}>
      {/* Thirst Warning */}
      <AnimatePresence>
        {percentage < 20 && (
          <motion.div 
            initial={{ height: 0, opacity: 0, scale: 0.8 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.8 }}
            className="bg-red-500/30 border-2 border-red-500 p-6 rounded-[2.5rem] flex items-center justify-between overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)] relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(239,68,68,0.2)_100%)] animate-pulse" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center text-white animate-bounce shadow-lg shadow-red-500/40">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-red-400 font-black text-[10px] uppercase tracking-[0.3em]">Critical Status: Parched</p>
                <p className="text-lg text-white font-black italic">"I'm seeing mirages of giant water bottles. HELPPP!" — Gulp</p>
              </div>
            </div>
            <button 
              onClick={handleAddWater}
              className="relative z-10 bg-white text-red-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              DRINK NOW
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <HydrationCompanion percentage={percentage} lastLogTime={lastLogTime} />

      {/* Daily Progress Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start space-y-12">
          <div className="text-center lg:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-2">Live Hydration Level</span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-7xl font-black tracking-tighter text-white leading-none">{intake}</h2>
              <span className="text-2xl font-bold text-white/20 italic">/ {goal} ml</span>
            </div>
            <p className="text-white/50 font-medium mt-2 flex items-center gap-2 lg:justify-start justify-center">
              You are <span className="text-blue-400 font-bold">{percentage}%</span> through your goal today!
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ${grade.color}`}>
                {grade.label}
              </span>
            </p>
            
            {/* Level & XP Progress Bar */}
            <div className="mt-8 w-full max-w-sm space-y-3">
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Biological Power Level</p>
                   <h3 className="text-2xl font-black text-white italic">Level {level}</h3>
                </div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{xp % 1000} / 1000 Vitality XP</p>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 1000) / 10}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Central Water Jar */}
          <div className="relative w-64 h-[400px] group">
            <div className="absolute inset-0 glass rounded-[4rem] refractive-edge overflow-hidden shadow-inner">
               {/* Liquid Layer */}
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${percentage}%` }}
                 transition={{ type: 'spring', damping: 20, stiffness: 40 }}
                 className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400"
               >
                 {/* Wave SVG Animation */}
                 <div className="absolute -top-8 left-0 right-0 h-16 opacity-40">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <motion.path 
                        animate={{ d: [
                          "M0,20 C30,10 70,30 100,20 L100,40 L0,40 Z",
                          "M0,20 C30,30 70,10 100,20 L100,40 L0,40 Z",
                          "M0,20 C30,10 70,30 100,20 L100,40 L0,40 Z"
                        ]}}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        fill="white" 
                      />
                    </svg>
                 </div>
               </motion.div>
            </div>
            
            {/* Floaties */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-12 right-6 w-4 h-4 bg-white/20 rounded-full blur-[2px]" 
            />
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="absolute bottom-32 left-10 w-2 h-2 bg-white/40 rounded-full blur-[1px]" 
            />
          </div>

          <button 
            onClick={handleAddWater}
            className="group relative flex items-center justify-center gap-4 bg-blue-500 text-white px-12 py-6 rounded-full font-black text-xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
            Log 250ml
            <AnimatePresence>
               <motion.span 
                 initial={{ opacity: 0, y: 0 }}
                 animate={{ opacity: 1, y: -40 }}
                 exit={{ opacity: 0 }}
                 key={intake}
                 className="absolute top-0 right-[-60px] text-blue-500 font-bold"
               >
                 +250ml
               </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-5 space-y-8">
           {/* Motivational Quote Block */}
           {percentage >= 50 && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden"
             >
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Quote size={20} />
                  </div>
                  <h3 className="text-xl font-bold leading-snug italic underline decoration-blue-500 underline-offset-8">
                    "{quotes[Math.floor(Date.now() / 10000) % quotes.length]}"
                  </h3>
                  <div className="h-[1px] w-full bg-white/10" />
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-blue-300">
                    <Sparkles size={12} />
                    Tier 2 Hydration Level
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]" />
             </motion.div>
           )}

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-[2rem] p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-white/5 text-orange-400 flex items-center justify-center mx-auto mb-2 border border-white/5">
                  <Flame size={20} />
                </div>
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Gulp Streak</p>
                <p className="text-2xl font-black text-white leading-none">{streak} Days of Flow</p>
              </div>
              <div className="glass rounded-[2rem] p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-white/5 text-blue-400 flex items-center justify-center mx-auto mb-2 border border-white/5">
                  <Clock size={20} />
                </div>
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Next Refill</p>
                <p className="text-2xl font-black text-white leading-none">ASAP</p>
              </div>
           </div>

           {/* Badge Shelf */}
           <div className="glass rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Identity Vault</p>
                   <h4 className="text-xl font-black text-white">Earned Badges</h4>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                 {milestoneBadges.map((badge, i) => (
                   <div 
                     key={i} 
                     className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                       level >= badge.level 
                         ? 'bg-blue-500/20 border-blue-500/40 opacity-100' 
                         : 'bg-white/5 border-white/10 opacity-30 grayscale'
                     }`}
                     title={level >= badge.level ? badge.title : `Unlock at Level ${badge.level}`}
                   >
                     <span className="text-2xl">{badge.icon}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Progress Matrix */}
           <div className="glass rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-black text-white">Progress Matrix</h4>
                <div className="flex gap-2">
                   <span className="flex items-center gap-1.5 text-[8px] font-black text-white/40">
                     <span className="w-2 h-2 rounded-full bg-blue-400"></span> FILLED
                   </span>
                   <span className="flex items-center gap-1.5 text-[8px] font-black text-white/40">
                     <span className="w-2 h-2 rounded-full bg-white/10"></span> EMPTY
                   </span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                 {matrixData.map((data, i) => (
                   <div 
                     key={i} 
                     className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all border border-white/5 ${
                       data.isToday ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110' : 
                       data.isFilled ? 'bg-blue-400/20 text-blue-400' : 'bg-white/5 text-white/20'
                     }`}
                   >
                     {data.day}
                   </div>
                 ))}
              </div>
           </div>

           {/* Daily Roadmap */}
           <div className="glass rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">The Ascent</p>
                  <h4 className="text-xl font-black text-white">30-Day Roadmap</h4>
                </div>
                <button onClick={exportData} className="p-3 rounded-2xl hover:bg-white/5 transition-colors text-white/30">
                  <LogOut size={20} />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {tasks.slice(0, 31).map((task) => (
                  <button 
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                      task.completed 
                        ? 'bg-blue-500/10 border-blue-500/20 opacity-60' 
                        : (task.day === currentDay 
                            ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 border-white/10 hover:border-blue-500/30'
                          )
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={24} className="text-blue-400 shrink-0" />
                    ) : (
                      <Circle size={24} className={task.day === currentDay ? "text-white shrink-0" : "text-white/10 shrink-0"} />
                    )}
                    <div className="text-left">
                      <p className={`text-xs font-bold ${task.completed ? 'text-blue-400' : (task.day === currentDay ? 'text-white/70' : 'text-white/30')}`}>DAY {task.day}</p>
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-white/30' : (task.day === currentDay ? 'text-white font-black' : 'text-white')}`}>{task.task}</p>
                    </div>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
