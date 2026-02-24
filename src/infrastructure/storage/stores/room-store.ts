import { create } from 'zustand';

interface RoomState {
  color: string;
  woodType: string;
  price: number;
  furniture: string[];
  length: number;
  width: number;
  budget: number;
  mood: string;
  setColor: (color: string) => void;
  setWoodType: (woodType: string) => void;
  updatePrice: (price: number) => void;
  addFurniture: (item: string) => void;
  removeFurniture: (item: string) => void;
  setLength: (length: number) => void;
  setWidth: (width: number) => void;
  setBudget: (budget: number) => void;
  setMood: (mood: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  color: 'white',
  woodType: 'oak',
  price: 1000,
  furniture: [],
  length: 0,
  width: 0,
  budget: 5000,
  mood: 'neutral',
  setColor: (color) => set({ color }),
  setWoodType: (woodType) => set({ woodType }),
  updatePrice: (price) => set({ price }),
  addFurniture: (item) => set((state) => ({
    furniture: [...state.furniture, item],
    price: state.price + 100
  })),
  removeFurniture: (item) => set((state) => ({
    furniture: state.furniture.filter(f => f !== item),
    price: state.price - 100
  })),
  setLength: (length) => set({ length }),
  setWidth: (width) => set({ width }),
  setBudget: (budget) => set({ budget }),
  setMood: (mood) => set({ mood }),
}));
