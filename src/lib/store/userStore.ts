// store/userStore.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { UserState  } from '@/types/user';

// Initialisation de l'état par défaut
const initialState = {
  email: null,
  firstName: null,
  lastName: null,
  profiles: [],
  authorisations: [],
  isAuthenticated: false,
};

// Création du store avec persistance
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // État initial
      ...initialState,
      
      // Actions pour manipuler l'état
      setUser: (userData) => 
        set({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profiles: userData.profiles,
          authorisations: userData.authorisations,
          isAuthenticated: true,
        }),
      
      clearUser: () => 
        set(initialState),
      
      updateUserProfile: (profile) =>
        set((state) => ({
          profiles: state.profiles.map(p => 
            p.id === profile.id ? profile : p
          ),
        })),
      
      updateAuthorisations: (authorisations) =>
        set({ authorisations }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
    }
  )
);