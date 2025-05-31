import { useUserStore } from "@/lib/store/userStore";

export function useUser() {
  const user = useUserStore();
  
  return {
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profiles: user.profiles,
      authorisations: user.authorisations,
      isAuthenticated: user.isAuthenticated,
    },
    setUser: user.setUser,
    clearUser: user.clearUser,
    updateUserProfile: user.updateUserProfile,
    updateAuthorisations: user.updateAuthorisations,
    
    // Méthodes utilitaires
    getFullName: () => {
      if (!user.firstName && !user.lastName) return '';
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    },
    
    hasPermission: (resource: string, permission: string) => {
      return user.authorisations.some(
        auth => auth.resource === resource && auth.permissions.includes(permission)
      );
    },
    
    getActiveProfile: () => {
      return user.profiles[0] || null;
    }
  };
}