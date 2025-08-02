'use client';
import { useCallback } from 'react';
import { roleStore } from '@/store/roleStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProfile } from '@/actions/authAction';
import toast from 'react-hot-toast';
import LoadingPage from '@/components/Loading/LoadingPage';

interface Props {
  children: React.ReactNode;
}

/**
 * Maps a URL path segment to a user role.
 * @param segment The URL segment (e.g., 'admin', 'support').
 * @returns The corresponding role as a string.
 */
const mapUrlSegmentToRole = (segment?: string): string | undefined => {
  if (!segment) return undefined;
  const upperCaseSegment = segment.toUpperCase();
  return upperCaseSegment === "SUPPORT" ? "ADMIN" : upperCaseSegment;
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

  const init = useCallback(async (role: string | undefined) => {
    try {
      const result = await getProfile();
      if (result.data) {
        const userInfo = result.data;
        setUser(userInfo);
        // Set the active role only if one was provided
        if (role) {
          setActiveRole(role);
        }
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
  }, [router, setActiveRole, setUser]); // Dependencies for useCallback

  useEffect(() => {
    const browsedRole = mapUrlSegmentToRole(pathname?.split('/')[1]);

    if (!browsedRole || browsedRole === activeRole) {
      setLoadingProfile(false);
    } else if (user?.roles.includes(browsedRole)) {
      setActiveRole(browsedRole);
      setLoadingProfile(false);
    } else {
      init(browsedRole);
    }
  }, [pathname, activeRole, user, setActiveRole, init]);

  return <>
    {loadingProfile ? <LoadingPage /> : children}
  </>

}
