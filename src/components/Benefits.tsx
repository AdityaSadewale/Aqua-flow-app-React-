import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Zap, Shell, Wind, Coffee, Sun, Moon } from 'lucide-react';

export function Benefits() {
  const cards = [
    { 
      title: 'Skin Health', 
      desc: 'Flush out toxins and maintain elasticity for a natural glow.', 
      icon: Shell, 
      color: 'bg-blue-500/10 text-blue-400',
      tag: 'RADIANCE'
    },
    { 
      title: 'Infinite Energy', 
      desc: 'Fight fatigue and boost metabolism with consistent fluid intake.', 
      icon: Zap, 
      color: 'bg-orange-500/10 text-orange-400',
      tag: 'POWER'
    },
    { 
      title: 'Mental Clarity', 
      desc: 'Prevent brain fog and enhance focus by keeping your brain hydrated.', 
      icon: Wind, 
      color: 'bg-teal-500/10 text-teal-400',
      tag: 'FOCUS'
    },
    { 
      title: 'Body Balance', 
      desc: 'Regulate body temperature and aid digestion naturally.', 
      icon: Heart, 
      color: 'bg-rose-500/10 text-rose-400',
      tag: 'BALANCE'
    },
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-2">Liquid Vitality</span>
         <h2 className="text-5xl font-black tracking-tighter text-white italic leading-none mb-6">Hydration is <br/>the ultimate <span className="text-blue-400 underline decoration-white/10">luxury.</span></h2>
         <p className="text-lg font-medium text-white/50 italic">Water is more than just hydration—it's the fuel for your mind, body, and radiance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[2.5rem] p-10 flex flex-col justify-between h-[320px] group hover:border-blue-400 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border border-white/10 ${card.color}`}>
                  <Icon size={28} />
                </div>
                <div>
                   <span className="text-[10px] font-black tracking-[0.2em] opacity-40 mb-2 block">{card.tag}</span>
                   <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-3">{card.title}</h3>
                   <p className="text-sm font-medium text-white/40 group-hover:text-white/60 transition-colors leading-relaxed italic pr-4">"{card.desc}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-black text-xs group-hover:gap-4 transition-all uppercase tracking-widest">
                Learn Flow <span className="text-lg">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hydration IQ Quiz Placeholder */}
      <section className="glass rounded-[3rem] p-12 bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
         <div className="relative z-10 space-y-6 max-w-lg">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Knowledge is Power</p>
              <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-4">Hydration IQ Quiz</h3>
              <p className="text-white/60 font-medium italic">"By the time you feel thirsty, your body is already dehydrated." <br/>True or False?</p>
            </div>
            <div className="flex gap-4">
               <button className="px-8 py-4 rounded-full bg-white/5 font-black text-blue-400 shadow-sm border border-white/10 hover:border-blue-400 transition-all active:scale-95">True</button>
               <button className="px-8 py-4 rounded-full bg-white/5 font-black text-blue-400 shadow-sm border border-white/10 hover:border-blue-400 transition-all active:scale-95">False</button>
            </div>
         </div>
         <div className="w-64 h-64 rounded-full bg-blue-500/10 blur-[60px] absolute -right-20 -bottom-20" />
         <motion.div 
           animate={{ rotate: [0, 10, 0] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10"
         >
           <Star size={80} className="text-blue-400/20" strokeWidth={1} />
         </motion.div>
      </section>
    </div>
  );
}
