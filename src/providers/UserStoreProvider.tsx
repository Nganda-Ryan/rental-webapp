'use client';

import { useRef } from 'react';
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
  
  // if (!initialized.current && email) {
  //   useUserStore.getState().setUser();
  //   initialized.current = true;
  // }
  
  return null;
}