'use client';


import { roleStore } from '@/store/roleStore';
import { ReactNode } from 'react';

interface RequireAuthProps {
  roles: string[];
  children: ReactNode;
}

export default function RequireAuth({ roles = [], children }: RequireAuthProps) {
  const { isAuthorized } = roleStore();


  if (!isAuthorized(roles)) {
    return <div className="text-red-600 text-center mt-10">Unauthorized</div>;
  }

  return <>{children}</>;
}
