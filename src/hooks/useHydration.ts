import { useState, useEffect } from 'react';
import { UserProfile, HydrationLog, DailyTask } from '../types';

export function useHydration(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: 'boy',
    weight: 0,
    age: 0,
    dailyGoal: 2500,
    onboarded: false,
    createdAt: Date.now(),
    level: 1,
    xp: 0,
    badges: [],
  });

  const [logs, setLogs] = useState<HydrationLog[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const storedProfile = localStorage.getItem(`aquaflow_profile_${userId}`);
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile(parsed);
      // Ensure createdAt and levels exist
      if (!parsed.createdAt || parsed.level === undefined) {
        const update = { 
          ...parsed, 
          createdAt: parsed.createdAt || Date.now(),
          level: parsed.level || 1,
          xp: parsed.xp || 0
        };
        localStorage.setItem(`aquaflow_profile_${userId}`, JSON.stringify(update));
        setProfile(update);
      }
    } else {
      // First time initialization
      const initialProfile = { ...profile, createdAt: Date.now() };
      setProfile(initialProfile);
      localStorage.setItem(`aquaflow_profile_${userId}`, JSON.stringify(initialProfile));
    }

    const storedLogs = localStorage.getItem(`aquaflow_logs_${userId}`);
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }

    const storedTasks = localStorage.getItem(`aquaflow_tasks_${userId}`);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Seed initial tasks
      const initialTasks = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        day: i + 1,
        task: getRandomTask(i),
        completed: false,
      }));
      setTasks(initialTasks);
      localStorage.setItem(`aquaflow_tasks_${userId}`, JSON.stringify(initialTasks));
    }

    setLoading(false);
  }, [userId]);

  const addXP = (amount: number) => {
    if (!userId) return;
    const newXP = (profile.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    const updatedProfile = { 
      ...profile, 
      xp: newXP, 
      level: newLevel 
    };
    
    setProfile(updatedProfile);
    localStorage.setItem(`aquaflow_profile_${userId}`, JSON.stringify(updatedProfile));
    
    // Level up celebration check (optional)
    if (newLevel > (profile.level || 1)) {
      console.log(`%c CONGRATS! You leveled up to ${newLevel}! Your skin is basically glowing now. SHINY! ✨`, 'font-weight: bold; font-size: 20px; color: blue; text-shadow: 1px 1px 0px black;');
    }
  };

  const addLog = (amount: number) => {
    if (!userId) return;
    const newLog: HydrationLog = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      timestamp: Date.now(),
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(`aquaflow_logs_${userId}`, JSON.stringify(updatedLogs));
    
    // Hydrating rewards XP
    addXP(Math.floor(amount / 5));
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!userId) return;
    const updatedProfile = { ...profile, ...data };
    setProfile(updatedProfile);
    localStorage.setItem(`aquaflow_profile_${userId}`, JSON.stringify(updatedProfile));
  };

  const toggleTask = (id: number) => {
    if (!userId) return;
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem(`aquaflow_tasks_${userId}`, JSON.stringify(updatedTasks));
  };

  const getTodayLogs = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return logs.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today);
  };

  const getTodayIntake = () => {
    return getTodayLogs().reduce((acc, log) => acc + log.amount, 0);
  };

  const getCurrentDay = () => {
    if (!profile.createdAt) return 1;
    const diff = Date.now() - profile.createdAt;
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  };

  const getStreak = () => {
    // Basic streak: how many days since join (can be improved with log checking later)
    return getCurrentDay();
  };

  const exportData = () => {
    const data = { profile, logs, tasks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaFlow_Data_${userId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lastLogTime = logs.length > 0 ? logs[0].timestamp : 0;

  return {
    profile,
    logs,
    lastLogTime,
    tasks,
    loading,
    addLog,
    addXP,
    updateProfile,
    toggleTask,
    getTodayLogs,
    getTodayIntake,
    getCurrentDay,
    getStreak,
    exportData,
  };
}

function getRandomTask(index: number) {
  const tasks = [
    "Drink water immediately after waking up",
    "No soda today",
    "Drink water before every meal",
    "Carry a reusable bottle everywhere",
    "Drink a glass of water after every coffee",
    "Skip the juice, choose water",
    "Drink water at room temperature",
    "Replace one snack with a big glass of water",
    "Track every sip today",
    "Hydrate after your workout",
    "Keep water by your bedside",
    "Add a slice of lemon to your water",
    "Take 5 intentional water breaks",
    "Drink 500ml by 10 AM",
    "No sugary drinks after 6 PM",
  ];
  return tasks[index % tasks.length];
}
