import { create } from 'zustand'

interface ShipmentsStore {
  search: string
  status: string | null
  setSearch: (search: string) => void
  setStatus: (status: string | null) => void
}

export const useShipmentsStore = create<ShipmentsStore>((set) => ({
  search: '',
  status: null,
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
}))
