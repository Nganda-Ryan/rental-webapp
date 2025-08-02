import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { IConfig, ICountry, IState, ICity, IStreet } from '@/types/locationType'

// 👇 Interface du store avec méthode
interface ConfigStore {
  country: ICountry[]
  state: IState[]
  city: ICity[]
  street: IStreet[]
  setConfig: (config: IConfig) => void
  resetConfig: () => void
}

// État initial
const initialState = {
  country: [],
  state: [],
  city: [],
  street: [],
}

// ✅ Store Zustand
export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      ...initialState,

      setConfig: (config: IConfig) =>
        set({
          country: config.country,
          state: config.state,
          city: config.city,
          street: config.street,
        }),

      resetConfig: () => set({ ...initialState }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : (null as any)
      ),
    }
  )
)
