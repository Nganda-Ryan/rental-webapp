'use client';

import { getProfile } from '@/actions/authAction';
import useLocalStorage from '@/hooks/useLocalStorage';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  profileList: string [];
  activeProfile: string;
  setProfileList: (value: string[]) => void;
  setActiveProfile: (value: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  activeProfile: "",
  profileList: [],
  setProfileList: () => {},
  setActiveProfile: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profileList, setProfileList] = useLocalStorage("selectedProfile", [] as string []);
  const [activeProfile, setActiveProfile] = useLocalStorage("activeProfile", "");


  useEffect(() => {
    const getUserProfile = async () => {
      const userInfo = await getProfile();
      console.log('-->userInfo', userInfo);
      const profiles = userInfo?.roles;
      if (profiles?.length > 0) {
        setProfileList(profiles);
        if (!activeProfile) {
          setActiveProfile(profiles[0]);
        }
      } else {
        setProfileList(["RENTER"]);
      }
    }

    getUserProfile();
  }, []);


    return (
        <AuthContext.Provider value={{ profileList, activeProfile, setProfileList, setActiveProfile }}>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
