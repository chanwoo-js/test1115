// theme.store.ts
// 전역 테마 상태 관리

import { create } from "zustand";

interface ThemeStroeType {
  theme : 'light' | 'dark';
  toggleTheme : () => void;
}

const useThemeStore = create<ThemeStroeType>((set) => ({
  theme : "light",

  toggleTheme : () => set((state) => ({
    theme : state.theme === 'light' ? 'dark' : 'light'
  })),
}));

export default useThemeStore;