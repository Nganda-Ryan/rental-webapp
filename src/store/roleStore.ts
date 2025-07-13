import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileDetail } from '@/types/authTypes';

interface RoleState {
  activeRole: string;
  user: ProfileDetail | undefined;
  setActiveRole: (value: string) => void;
  setUser: (value: ProfileDetail) => void;
  resetAuth: () => void;
  isAuthorized: (value: string[]) => boolean;
  getProfileCode: (value: string) => string | null;
}

export const roleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      activeRole: '',
      user: undefined,

      setActiveRole: (value) => set({ activeRole: value }),
      setUser: (value) => set({ user: value }),

      resetAuth: () => set({activeRole: '', user: undefined,}),

      isAuthorized: (requiredRoles: string[]) => {
        const user = get().user;
        if (!user) return false;

        if (!requiredRoles || requiredRoles.length === 0) return false;

        return requiredRoles.some((role) => user.roles.includes(role));
      },

      getProfileCode: (roleName: string) => {
        const user = get().user;
        if (!user) return null;

        return user.Profiles.find((item: any) => item.RoleCode == roleName)?.Code || null;
      },
    }),
    {
      name: 'role-store',
    }
  )
);
