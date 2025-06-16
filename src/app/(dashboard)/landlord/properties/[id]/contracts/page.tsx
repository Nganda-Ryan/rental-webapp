import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Nodata from '@/components/error/Nodata'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
      <Breadcrumb previousPage pageName="Locatif" />
        <Nodata />

    </DefaultLayout>
  )
}

export default page