'use client';

import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // You could fetch initial user data from an API or cookie here if needed
  
  return (
    <>
      {/* Initialize the store if you have user data at startup */}
      {/* <UserStoreInitializer email="user@example.com" firstName="John" /> */}
      {children}
    </>
  );
}