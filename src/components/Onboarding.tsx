import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ChevronRight, Weight, Calendar } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

const FemaleIcon = () => <span className="text-2xl font-bold">♀</span>;
const MaleIcon = () => <span className="text-2xl font-bold">♂</span>;

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<'boy' | 'girl' | null>(null);
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  const calculateGoal = (w: number) => {
    // Formula: Weight (kg) * 35ml
    return Math.round(w * 35);
  };

  const handleFinish = () => {
    if (!gender || !weight || !age) return;
    const w = parseFloat(weight);
    const a = parseInt(age);
    onComplete({
      gender,
      weight: w,
      age: a,
      dailyGoal: calculateGoal(w),
      onboarded: true
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f172a] flex items-center justify-center p-6 overflow-hidden text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[#0f172a]" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" 
        />
      </div>

      <div className="w-full max-w-lg glass rounded-[3rem] p-10 relative">
        <div className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-2">AquaFlow AI Studio</span>
          <h2 className="text-3xl font-black tracking-tight text-white leading-tight underline decoration-blue-500/50 decoration-wavy underline-offset-8">Welcome, <br/>Aditya Sadewale.</h2>
          <p className="text-white/60 mt-6 font-medium italic">"The AI thinks you're actually 60% water. Let's make it 70%."</p>
        </div>

        <div className="space-y-10">
          {/* Gender */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Biological Gender</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setGender('boy')}
                className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all duration-300 border ${
                  gender === 'boy' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-blue-400' 
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${gender === 'boy' ? 'bg-white/20' : 'bg-blue-500/10 text-blue-400'}`}>
                   <User size={28} />
                </div>
                <span className="font-bold">Boy</span>
              </button>
              <button 
                onClick={() => setGender('girl')}
                className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all duration-300 border ${
                  gender === 'girl' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-blue-400' 
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${gender === 'girl' ? 'bg-white/20' : 'bg-blue-500/10 text-blue-400'}`}>
                   <User size={28} />
                </div>
                <span className="font-bold">Girl</span>
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-3 font-headline">
               <p className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Weight (KG)</p>
               <input 
                 type="number"
                 value={weight}
                 onChange={(e) => setWeight(e.target.value)}
                 placeholder="65"
                 className="w-full bg-white/5 border-none rounded-2xl p-4 text-2xl font-black text-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-center placeholder:text-white/10"
               />
             </div>
             <div className="space-y-3 font-headline">
               <p className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Age (YRS)</p>
               <input 
                 type="number"
                 value={age}
                 onChange={(e) => setAge(e.target.value)}
                 placeholder="25"
                 className="w-full bg-white/5 border-none rounded-2xl p-4 text-2xl font-black text-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-center placeholder:text-white/10"
               />
             </div>
          </div>

          <button 
            disabled={!gender || !weight || !age}
            onClick={handleFinish}
            className="w-full py-5 rounded-full bg-blue-500 text-white font-black text-lg shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
          >
            Calculate Daily Goal
            <ChevronRight size={20} />
          </button>
        </div>

        <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-10">Trusted by over 1M+ Health Enthusiasts</p>
      </div>
    </div>
  );
}
