'use client';

import { getProfile } from '@/actions/authAction';
import useLocalStorage from '@/hooks/useLocalStorage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from '@bprogress/next/app';
import toast from 'react-hot-toast';
import LoadingPage from '@/components/Loading/LoadingPage';
import { Profile } from '@/types/authTypes';
import { usePathname } from "next/navigation";
import { STANDARD_PROFILE_LIST } from '@/constant';

interface AuthContextType {
  profileList: string[];
  activeProfile: string;
  profilesDetails: Profile[];
  setProfileList: (value: string[]) => void;
  setActiveProfile: (value: string) => void;
  user: string;
  loadingProfile: boolean;
  isAuthorized: (requiredRoles?: string[] | undefined) => boolean;
  getProfileCode: (roleName: string) => any;
}

const AuthContext = createContext<AuthContextType>({
  activeProfile: "",
  profileList: [],
  profilesDetails: [], 
  setProfileList: () => {},
  setActiveProfile: () => {},
  user: "",
  loadingProfile: true,
  isAuthorized: () => false,
  getProfileCode: (roleName: string) => "",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profileList, setProfileList] = useLocalStorage("selectedProfile", [] as string[]);
  const [activeProfile, setActiveProfile] = useLocalStorage("activeProfile", "");
  const [profilesDetails, setProfilesDetails] = useState<Profile[]>([]);
  const [user, setUser] = useLocalStorage("user", "");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const pathname = usePathname();
  const router = useRouter();


  useEffect(() => {
    if(pathname){
      const role = pathname.split('/');
      if(STANDARD_PROFILE_LIST.includes(role[1].toUpperCase())){
        manualInit(role[1].toUpperCase());
      }
    }
  }, [pathname]);

  const isAuthorized = (requiredRoles?: string[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => JSON.parse(user).roles.includes(role));
  };

  const getProfileCode = (roleName: string) => {
    if (!user) return null;
    const userObj = JSON.parse(user);
    return userObj.Profiles.filter((item: any) => item.RoleCode == roleName)[0] || null;
  };

  const manualInit = async (_role: string) => {
    console.log('-->manualInit.role', _role);
    const role = _role == "SUPPORT" ? "ADMIN" : _role;

    try {
      if(profileList && profileList.includes(role.toUpperCase())){
        if(role == activeProfile){
          console.log('same role')
          return
        } else {
          console.log('-->1');
          console.log('-->role', role);
          console.log('-->activeProfile', activeProfile);
          setActiveProfile(role);
        }
      } else {
        console.log('-->Fetch role');
        const result = await getProfile();
        console.log('->result', result);
        if(result.data){
          const userInfo = result.data;

          const roles = userInfo?.roles;
          console.log('->roles', roles);
          console.log('->roles.includes', roles.includes(role.toUpperCase()));
          if(roles.length > 0){
            if(roles.includes(role.toUpperCase())){
              console.log('-->2');
              setActiveProfile(role);
            } else {
              console.log('-->3');
              setActiveProfile("RENTER");
              router.push('/renter');
            }
            setProfileList(roles);
          } else {
            router.push('/signin');
          }
          setUser(JSON.stringify(userInfo));
          setProfilesDetails(result.data.Profiles);
        } else {
          if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
        }
      }
    } catch (error) {
      console.log('error', error);
      router.push('/signin');
      return;
    } finally {
      setLoadingProfile(false);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      profileList, 
      activeProfile, 
      setProfileList, 
      setActiveProfile,
      user, 
      loadingProfile, 
      isAuthorized, 
      getProfileCode,
      profilesDetails,
    }}>
      {loadingProfile ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);