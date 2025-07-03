'use client';

import { getProfile } from '@/actions/authAction';
import useLocalStorage from '@/hooks/useLocalStorage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from '@bprogress/next/app';
import toast from 'react-hot-toast';
import LoadingPage from '@/components/Loading/LoadingPage';
import { Profile } from '@/types/authTypes';



interface AuthContextType {
  profileList: string [];
  activeProfile: string;
  profilesDetails: Profile[];
  setProfileList: (value: string[]) => void;
  setActiveProfile: (value: string) => void;
  user: string,
  loadingProfile: boolean,
  isAuthorized: (requiredRoles?: string[] | undefined) => boolean
}


const AuthContext = createContext<AuthContextType>({
  activeProfile: "",
  profileList: [],
  profilesDetails: [], 
  setProfileList: () => {},
  setActiveProfile: () => {},
  user: "",
  loadingProfile: true,
  isAuthorized: () => false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profileList, setProfileList] = useLocalStorage("selectedProfile", [] as string []);
  const [activeProfile, setActiveProfile] = useLocalStorage("activeProfile", "");
  const [profilesDetails, setProfilesDetails] = useState<Profile[]>([]);
  const [user, setUser] = useLocalStorage("user", "");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const result = await getProfile();
        if(result.data){
          const userInfo = result.data;
          setUser(JSON.stringify({
            roles: userInfo.roles ?? [],
            userId: userInfo.userId ?? "",
            activeRole: userInfo.activeRole ?? "",
            expiresAt: userInfo.expiresAt ?? ""
          }));
          setProfilesDetails(result.data.Profiles)
          // console.log('-->userInfo', userInfo);
          const profiles = userInfo?.roles;
          if (profiles?.length > 0) {
            setProfileList(profiles);
            if (!activeProfile) {
              setActiveProfile(profiles[0]);
            }
          } else {
            setProfileList(["RENTER"]);
          }
        } else {
          if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
        }
      } catch (error) {
        router.push('/signin');
        return;
      } finally {
        setLoadingProfile(false);
      }
    }

    getUserProfile();
  }, []);
  

  const isAuthorized = (requiredRoles?: string[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => JSON.parse(user).roles.includes(role));
  };

  return (
      <AuthContext.Provider value={{ profileList, activeProfile, setProfileList, setActiveProfile, user, loadingProfile, isAuthorized, profilesDetails }}>
        {loadingProfile ? <LoadingPage /> : children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
