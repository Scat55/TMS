import { create } from 'zustand'
import { type Theme, setTheme, getTheme } from '@/shared/lib/theme'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getTheme(),
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    set({ theme: newTheme })
  },
}))
