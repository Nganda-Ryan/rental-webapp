"use client"
import React from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Nodata from '@/components/error/Nodata'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { useAuth } from "@/context/AuthContext";
import { PROFILE_LANDLORD_LIST } from "@/constant";

const Page = () => {
  const { isAuthorized, loadingProfile } = useAuth();

  if (!loadingProfile && !isAuthorized(PROFILE_LANDLORD_LIST)) {
    return <div>Unauthorized</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb previousPage pageName="Locatif/Units" />
        <Nodata />

    </DefaultLayout>
  )
}

export default Page