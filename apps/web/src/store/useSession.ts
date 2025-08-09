import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mode } from '@/lib/types';

interface SessionState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  userId: string | null;
  setUserId: (id: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      mode: 'Shopping', // Default mode
      userId: null,
      setMode: (newMode) => set({ mode: newMode }),
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: 'discovery-session-storage', // name of the item in storage (must be unique)
    }
  )
);