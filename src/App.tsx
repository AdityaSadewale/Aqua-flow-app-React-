import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopNav, Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WaterGame } from './components/WaterGames';
import { Benefits } from './components/Benefits';
import { useHydration } from './hooks/useHydration';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';

function AquaFlowApp() {
  const { user } = useAuth();
  const { 
    profile, 
    updateProfile, 
    getTodayIntake, 
    addLog, 
    addXP,
    lastLogTime,
    tasks, 
    toggleTask, 
    exportData,
    getCurrentDay,
    getStreak,
    loading: hydrationLoading
  } = useHydration(user?.uid);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const waterFacts = [
    "Water is the only substance found naturally on Earth in three forms: liquid, gas, solid, and 'forgotten bottle in the car'.",
    "You are currently a more sophisticated cucumber.",
    "Banging your head against a wall uses 150 calories an hour. Drinking water uses zero, but is much better for your head.",
    "97% of the world's water is salty. Don't be like the world. Be hydrated.",
    "A human can survive for a month without food, but only a week without water. Choose wisely.",
    "Drinking water can actually help you lose weight. Mostly because you're busy walking to the bathroom.",
  ];
  const [factIndex] = useState(Math.floor(Math.random() * waterFacts.length));

  useEffect(() => {
    if (user && !hydrationLoading) {
      setShowOnboarding(!profile.onboarded);
    }
  }, [user, profile.onboarded, hydrationLoading]);

  // Browser Notifications Permission
  useEffect(() => {
    if (user && profile.onboarded && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [user, profile.onboarded]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            intake={getTodayIntake()} 
            goal={profile.dailyGoal} 
            onAddLog={addLog}
            tasks={tasks}
            onToggleTask={toggleTask}
            exportData={exportData}
            currentDay={getCurrentDay()}
            streak={getStreak()}
            level={profile.level || 1}
            xp={profile.xp || 0}
            badges={profile.badges || []}
            lastLogTime={lastLogTime}
          />
        );
      case 'games':
        return <WaterGame onEarnXP={addXP} />;
      case 'benefits':
        return <Benefits />;
      default:
        return null;
    }
  };

  if (!user) {
    return <Auth />;
  }

  if (hydrationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-blue-500 blur-xl"
        />
        <p className="text-white/50 font-black animate-pulse ml-4">HYDRATING DATA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans no-scrollbar text-white">
      {/* Global Background Animation */}
      <div className="fixed inset-0 -z-50 bg-[#0f172a]" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence>
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Onboarding 
              onComplete={(data) => {
                updateProfile(data);
                setShowOnboarding(false);
              }} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            <TopNav />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 pb-40">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={activeSection}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 >
                   {renderSection()}
                 </motion.div>
               </AnimatePresence>
            </main>

            <Navigation 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />

            <footer className="w-full py-12 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm space-y-6">
              <div className="max-w-md mx-auto px-6">
                <p className="text-[10px] text-blue-400/50 font-black uppercase tracking-[0.2em] mb-2">Did you know?</p>
                <p className="text-xs text-white/40 italic leading-relaxed">
                  "{waterFacts[factIndex]}"
                </p>
              </div>
              <div className="h-[1px] w-12 bg-white/10 mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                Created with <span className="text-blue-500 animate-pulse inline-block">💧</span> by <span className="text-white/50 hover:text-blue-400 transition-colors cursor-default">Aditya Sadewale</span>
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AquaFlowApp />
    </AuthProvider>
  );
}
