'use client';

import { useRef } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { UserProfile, UserAuthorisation } from '../types/user';


export function UserStoreInitializer({
  email,
  firstName,
  lastName,
  profiles,
  authorisations,
}: {
  email?: string;
  firstName?: string;
  lastName?: string;
  profiles?: UserProfile[];
  authorisations?: UserAuthorisation[];
}) {
  // Utiliser useRef pour éviter de multiples rendus
  const initialized = useRef(false);
  
  if (!initialized.current && email) {
    useUserStore.getState().setUser({
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      profiles: profiles || [],
      authorisations: authorisations || [],
    });
    initialized.current = true;
  }
  
  return null;
}