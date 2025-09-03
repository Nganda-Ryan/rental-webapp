"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';
import { geRequestDetail } from '@/actions/requestAction';

const Page = () => {
    const params = useParams();
    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        const result = await geRequestDetail(params.requestid as string);
        console.log('-->result', result)
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName={`Application detail`} />
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                Request detail page
            </div>
        </DefaultLayout>
    )
}

export default Page