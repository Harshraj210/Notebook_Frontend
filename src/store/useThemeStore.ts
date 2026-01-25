import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default
      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'light' ? 'dark' : 'light';
        updateDom(next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        updateDom(theme);
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
         if (state) updateDom(state.theme);
      }
    }
  )
);

// Helper to update DOM class safely
const updateDom = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  const body = window.document.body;
  
  // Clean up and set new class on BOTH for safety
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  body.classList.remove('light', 'dark');
  body.classList.add(theme); // Some UI libraries check body
};
