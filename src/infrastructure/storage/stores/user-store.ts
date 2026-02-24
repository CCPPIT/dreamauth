import { create } from 'zustand';

interface UserState {
  sleepHours: number | null;
  personality: 'single' | 'married' | 'family' | null;
  age: number | null;
  personalityResult: string | null;
  comfortScore: number | null;
  setSleepHours: (hours: number) => void;
  setPersonality: (personality: 'single' | 'married' | 'family') => void;
  setAge: (age: number) => void;
  setPersonalityResult: (result: string) => void;
  setComfortScore: (score: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  sleepHours: null,
  personality: null,
  age: null,
  personalityResult: null,
  comfortScore: null,
  setSleepHours: (hours) => set({ sleepHours: hours }),
  setPersonality: (personality) => set({ personality }),
  setAge: (age) => set({ age }),
  setPersonalityResult: (personalityResult) => set({ personalityResult }),
  setComfortScore: (comfortScore) => set({ comfortScore }),
}));
