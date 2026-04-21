import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Auth() {
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [accessId, setAccessId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    const id = accessId.trim();
    if (id.length < 3) {
      setError("Please enter a valid ID (min 3 chars)");
      setLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      signIn(id, name);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a]" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-dark rounded-[3.5rem] p-12 relative overflow-hidden text-white border border-white/5 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8">
           <span className="text-[10px] font-black text-blue-500/30 uppercase tracking-[0.3em]">v2.0.4</span>
        </div>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Fingerprint size={32} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-1">
            AquaFlow <span className="text-blue-500 italic block">Ultimate</span>
          </h2>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-3">{isLogin ? 'Secure Identity Vault' : 'Initialize Personal ID'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[10px] font-bold mb-6 text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Owner Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all outline-none text-sm font-medium"
                placeholder="Your Name"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Unique ID</label>
            <input
              type="text"
              required
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all outline-none text-sm font-medium tracking-widest"
              placeholder="e.g. aditya"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all outline-none text-sm font-medium"
                placeholder="••••••••"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-500 hover:bg-blue-400 text-white rounded-full font-black text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Opening...' : (isLogin ? 'Enter' : 'Create')}
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
          </button>
        </form>

        <p className="text-center mt-10 text-[10px] text-white/40 font-bold uppercase tracking-widest">
          {isLogin ? "New here?" : "Already have an ID?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline ml-1"
          >
            {isLogin ? 'Quick Start' : 'Sign-In'}
          </button>
        </p>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] leading-relaxed">
            Engineered with Precision by<br/>
            <span className="text-white/40 block mt-1 hover:text-blue-400 transition-colors cursor-default">ADITYA SADEWALE</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
