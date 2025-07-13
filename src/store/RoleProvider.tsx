'use client';

import { roleStore } from '@/store/roleStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProfile } from '@/actions/authAction';
import toast from 'react-hot-toast';
import LoadingPage from '@/components/Loading/LoadingPage';
import { STANDARD_PROFILE_LIST } from '@/constant';


interface Props {
  children: React.ReactNode;
}


export function RoleProvider({
  children,
}: Props) {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const {
    setActiveRole,
    setUser,
    activeRole,
    user
  } = roleStore();

  useEffect(() => {
    const _browsedRole = pathname?.split('/')[1]?.toUpperCase();
    const browsedRole = _browsedRole == "SUPPORT" ? "ADMIN" : _browsedRole;
    if(browsedRole == activeRole){
      console.log('same role');
      setLoadingProfile(false);
      return;
    } else if(user?.roles.includes(browsedRole)) {
      console.log('authorised role');
      setActiveRole(browsedRole);
      setLoadingProfile(false);
      return;
    } else {
      init(browsedRole);
    }
    
  }, [pathname]);

  const init = async (role: string) => {
    try {
      console.log("Init");

      const result = await getProfile();
      if (result.data) {
        const userInfo = result.data;
        setUser(userInfo);
        setActiveRole(role)

      } else {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
        } else {
          toast.error(result.error ?? 'Unexpected error', { position: 'bottom-right' });
        }
      }
    } catch {
      router.push('/signin');
    } finally {
      setLoadingProfile(false);
    }
  };

  return <>
    {loadingProfile ? <LoadingPage /> : children}
  </>

}
