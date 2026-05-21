import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CompanionProps {
  percentage: number;
  lastLogTime: number;
}

export function HydrationCompanion({ percentage, lastLogTime }: CompanionProps) {
  const getTimeSinceLastLog = () => {
    const diff = Date.now() - lastLogTime;
    return Math.floor(diff / (1000 * 60)); // in minutes
  };

  const minutesSinceLog = lastLogTime > 0 ? getTimeSinceLastLog() : 999;

  const getMood = () => {
    if (percentage >= 100) return 'party';
    if (percentage >= 70) return 'happy';
    if (percentage >= 40) return 'neutral';
    if (minutesSinceLog > 120 || percentage < 20) return 'thirsty';
    return 'neutral';
  };

  const mood = getMood();
  const [isSplashing, setIsSplashing] = React.useState(false);

  const handleMascotClick = () => {
    setIsSplashing(true);
    setTimeout(() => setIsSplashing(false), 500);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3');
    audio.play().catch(() => {});
  };

  const messages = {
    party: [
      "I'M DROWNING IN JOY! 🎉",
      "We are basically a waterfall now.",
      "Is it just me or do we look EXTRA shiny today?",
      "HYDRO-GOD STATUS ACHIEVED."
    ],
    happy: [
      "Mmm, refreshing. My cells are dancing!",
      "We're glowing. Literally.",
      "Keep it coming, I'm feeling buoyant!",
      "Hydration level: Majestic."
    ],
    neutral: [
      "Stay focused. A glass a day keeps the raisin-face away.",
      "Don't stop now, we're halfway to greatness.",
      "I'm feeling... adequate. Let's make it better.",
      "Is that a refill I see in your hand?"
    ],
    thirsty: [
      "HELLO? Is anyone home? I'm drying up here!",
      "I feel like a discarded raisin in the desert.",
      "S.O.S! SEND WATER OR SEND HELP.",
      "My aquatic vibes are reaching critical lows."
    ]
  };

  const currentMessage = messages[mood][Math.floor((Date.now() / 10000) % 4)];

  const getEmoji = () => {
    switch (mood) {
      case 'party': return '😎';
      case 'happy': return '💧';
      case 'thirsty': return '🌵';
      default: return '😐';
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-32 right-8 z-50 flex flex-col items-end pointer-events-none"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentMessage}
          initial={{ opacity: 0, x: 20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: -10 }}
          className="bg-white text-black p-4 rounded-3xl rounded-br-none shadow-2xl mb-4 max-w-[200px] border-4 border-blue-500 font-black text-xs uppercase italic tracking-tighter"
        >
          {currentMessage}
        </motion.div>
      </AnimatePresence>

      <motion.div 
        onClick={handleMascotClick}
        animate={{ 
          y: [0, -15, 0],
          rotate: mood === 'party' ? [0, 10, -10, 0] : 0,
          scale: isSplashing ? [1, 1.2, 1] : 1
        }}
        transition={{ 
          duration: isSplashing ? 0.3 : 3, 
          repeat: isSplashing ? 0 : Infinity,
          ease: "easeInOut"
        }}
        className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 relative pointer-events-auto cursor-pointer select-none ${
          mood === 'thirsty' ? 'bg-orange-200 border-orange-400' : 
          mood === 'party' ? 'bg-blue-400 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)]' :
          'bg-blue-500 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        }`}
      >
        <AnimatePresence>
          {isSplashing && (
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-400 rounded-full"
            />
          )}
        </AnimatePresence>
        
        {getEmoji()}
        
        {/* Face Details */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <div className="flex gap-4 mt-2">
             <div className="w-2 h-2 bg-black/20 rounded-full" />
             <div className="w-2 h-2 bg-black/20 rounded-full" />
           </div>
           <div className={`mt-2 w-8 h-2 rounded-full bg-black/20 ${mood === 'thirsty' ? 'h-4' : ''}`} />
        </div>

        {/* Floating Bubbles if Happy */}
        {mood === 'happy' && (
          <motion.div 
            animate={{ y: -100, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 w-4 h-4 bg-white/40 rounded-full"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
