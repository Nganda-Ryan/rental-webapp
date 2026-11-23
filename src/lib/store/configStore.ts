import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { IConfig, ICountry, IState, ICity, IStreet } from '@/types/configType'

interface ConfigStore {
  country: ICountry[]
  state: IState[]
  city: ICity[]
  street: IStreet[]
  isLocationLoading: boolean
  setConfig: (config: IConfig) => void
  mergeConfig: (partial: Partial<IConfig>) => void
  setLocationLoading: (loading: boolean) => void
  resetConfig: () => void
}

const initialState = {
  country: [] as ICountry[],
  state: [] as IState[],
  city: [] as ICity[],
  street: [] as IStreet[],
  isLocationLoading: false,
}

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

      mergeConfig: (partial: Partial<IConfig>) =>
        set((current) => ({
          country: partial.country ?? current.country,
          state: partial.state ?? current.state,
          city: partial.city ?? current.city,
          street: partial.street ?? current.street,
        })),

      setLocationLoading: (loading: boolean) =>
        set({ isLocationLoading: loading }),

      resetConfig: () => set({ ...initialState }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : (null as unknown as Storage),
      ),
      partialize: (state) => ({
        country: state.country,
        state: state.state,
        city: state.city,
        street: state.street,
      }),
    },
  ),
)