'use client';


import { roleStore } from '@/store/roleStore';
import { redirect, useParams } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const store = roleStore();
  const param = useParams();

  useEffect(() => {
    console.log('-->param', param)
    store.setActiveRole("RENTER");
    redirect(`/renter/housing-application/${param.id}}`);
  }, []);

  return (
    <div>

    </div>
  )
};

export default Page;