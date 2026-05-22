import React from 'react';
import { motion } from 'motion/react';
import { Droplet, Trophy, BookOpen, MessageSquare, LayoutDashboard, LogOut, Music, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef } from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'games', label: 'Water Games', icon: Trophy },
    { id: 'benefits', label: 'Benefits', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
      <div className="glass shadow-2xl rounded-3xl p-3 flex justify-between items-center gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`relative flex flex-col items-center gap-1 flex-1 py-2 rounded-2xl transition-all duration-300 ${
                isActive ? 'text-blue-400' : 'text-white/50 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-white/10 rounded-2xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav() {
  const { user, signOut } = useAuth();
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2405/2405-preview.mp3'); // Nature-ish/Water sound
      audioRef.current.loop = true;
    }
    
    if (isMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };
  
  return (
    <header className="sticky top-0 w-full z-40 bg-white/5 border-b border-white/10 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Droplet size={20} fill="currentColor" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          AquaFlow <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-widest font-black">v2.0</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSound}
          className={`p-2 rounded-xl transition-all ${!isMuted ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/30 hover:text-white'}`}
          title="Toggle Ambient Water Sound"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Welcome back,</p>
          <p className="text-sm font-semibold text-white leading-none">{user?.displayName || 'User'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-white/20 flex items-center justify-center">
            <span className="text-blue-400 font-bold">
              {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AF'}
            </span>
          </div>
          <button 
            onClick={() => signOut()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all capitalize text-[10px] font-bold"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}
