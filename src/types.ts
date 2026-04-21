export interface UserProfile {
  name: string;
  gender: 'boy' | 'girl';
  weight: number;
  age: number;
  dailyGoal: number; // in ml
  onboarded: boolean;
  createdAt?: number;
  level?: number;
  xp?: number;
  badges?: string[];
}

export interface HydrationLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
}

export interface DailyTask {
  id: number;
  day: number;
  task: string;
  completed: boolean;
}

export interface FeedbackRecord {
  id: string;
  name: string;
  comment: string;
  rating: number;
  timestamp: number;
}
