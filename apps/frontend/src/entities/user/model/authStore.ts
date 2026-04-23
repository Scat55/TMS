import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuth: false,
      setIsAuth: (isAuth) => set({ isAuth }),
    }),
    { name: 'auth' }
  )
)
